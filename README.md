# Prolife Orthopaedic website

Static site for Prolife Orthopaedic, a prosthetics and orthotics clinic in Nairobi, hosted on Vercel.

- Pages are plain HTML in the repo root. Styles are in `assets/css/site.css`, scripts in `assets/js/site.js`.
- `images/` and `prolifevideos/` hold the full-size originals and are not deployed. The site uses the optimised copies in `assets/`.

## Appointment form

The form posts to `api/appointment.js`. Set these in Vercel under Project Settings > Environment Variables, then redeploy:

| Variable | Value |
| --- | --- |
| `SMTP_USER` | The Gmail address that sends the email |
| `SMTP_PASS` | A Gmail App Password, never the account password |
| `MAIL_TO` | Optional. Recipient address, defaults to prolifeorthopaedic@gmail.com |

Never commit credentials to this repo. Until these are set, the form shows visitors the phone number and an email link instead.

## Moving to a custom domain

Replace `https://prolife-iota.vercel.app` with the new address in every `.html` file, `sitemap.xml` and `robots.txt`.
