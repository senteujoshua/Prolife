(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });

  // Services submenu
  var sub = document.querySelector(".has-sub");
  var subToggle = document.querySelector(".sub-toggle");
  function setSub(open) {
    sub.classList.toggle("is-open", open);
    subToggle.setAttribute("aria-expanded", String(open));
  }
  subToggle.addEventListener("click", function () {
    setSub(!sub.classList.contains("is-open"));
  });
  document.addEventListener("click", function (e) {
    if (!sub.contains(e.target)) setSub(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    setSub(false);
    if (nav.classList.contains("is-open")) {
      setNav(false);
      toggle.focus();
    }
  });

  // Header hairline once the page has scrolled
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Clinic video
  var dialog = document.getElementById("video-dialog");
  var openVideo = document.getElementById("video-open");
  if (dialog && openVideo) {
    var video = dialog.querySelector("video");
    openVideo.addEventListener("click", function () {
      dialog.showModal();
      video.play().catch(function () {});
    });
    dialog.querySelector(".dialog-close").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      video.pause();
    });
  }

  // Appointment form
  var form = document.getElementById("appointment-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var submit = form.querySelector("button[type=submit]");
  var dateInput = form.elements.date;
  var now = new Date();
  dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function show(kind, html) {
    status.className = "form-status full show" + (kind === "err" ? " err" : "");
    status.innerHTML = html;
    status.focus();
  }

  // Used when the online service is unavailable, so a request is never lost
  function emailFallback(d) {
    var body = "Name: " + d.name + "\nPhone: " + d.phone + "\nEmail: " + (d.email || "-") +
      "\nService: " + d.service + "\nPreferred date: " + d.date +
      (d.message ? "\n\nMessage: " + d.message : "");
    return "mailto:prolifeorthopaedic@gmail.com?subject=" +
      encodeURIComponent("Appointment request from " + d.name) + "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
    var label = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Sending...";

    fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      show("ok", "<strong>Thank you. Your request has been sent.</strong> Our team will contact you to confirm your appointment.");
    }).catch(function () {
      show("err", "<strong>We couldn't send your request online.</strong> Please call <a href=\"tel:+254732027984\">+254 732 027 984</a>, or <a id=\"mail-fallback\">send it by email</a> instead.");
      status.querySelector("#mail-fallback").href = emailFallback(data);
    }).finally(function () {
      submit.disabled = false;
      submit.textContent = label;
    });
  });
})();
