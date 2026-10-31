// Vercel serverless function behind the appointment form.
// Credentials come from environment variables and must never be committed:
//   SMTP_USER  mailbox that sends the email
//   SMTP_PASS  Gmail App Password for that mailbox (not the account password)
//   MAIL_TO    optional recipient, defaults to the clinic inbox
//   SMTP_HOST, SMTP_PORT  optional, default to Gmail
const nodemailer = require("nodemailer");

const LIMITS = { name: 100, phone: 30, email: 150, service: 80, date: 10, message: 2000 };

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const clean = (value, max) =>
  (typeof value === "string" ? value : "").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim().slice(0, max);

function validate(body) {
  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) data[key] = clean(body[key], max);
  // Single-line fields feed email headers, so they can't keep line breaks
  for (const key of ["name", "phone", "email", "service", "date"]) data[key] = data[key].replace(/\n/g, " ");

  if (!data.name) return { error: "Please enter your name." };
  if (!/^[+\d][\d\s()-]{6,}$/.test(data.phone)) return { error: "Please enter a valid phone number." };
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: "Please enter a valid email address." };
  if (!data.service) return { error: "Please choose a service." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return { error: "Please choose a preferred date." };
  return { data };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: real visitors never see this field, so report success and drop the bot
  if (body.company) return res.status(200).json({ ok: true });

  const { data, error } = validate(body);
  if (error) return res.status(400).json({ error });

  const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, MAIL_TO } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("Appointment form: SMTP_USER and SMTP_PASS are not set");
    return res.status(503).json({ error: "Online booking is temporarily unavailable." });
  }

  const port = Number(SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email || "Not provided"],
    ["Service", data.service],
    ["Preferred date", data.date],
    ["Message", data.message || "None"],
  ];

  try {
    await transporter.sendMail({
      from: { name: "Prolife Orthopaedic Website", address: SMTP_USER },
      to: MAIL_TO || "prolifeorthopaedic@gmail.com",
      replyTo: data.email ? { name: data.name, address: data.email } : undefined,
      subject: `Appointment request from ${data.name}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      html:
        "<h2>New appointment request</h2>" +
        rows.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value).replace(/\n/g, "<br>")}</p>`).join(""),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Appointment form: mail failed:", err.message);
    return res.status(502).json({ error: "We couldn't send your request." });
  }
};
