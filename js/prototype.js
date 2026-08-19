(function () {
  "use strict";

  const form = document.getElementById("form");
  if (!form) return;

  /* score: 0–10 in 1-point steps (half-star UI = 0.5 star = 1 point) */
  let score = 0;
  const root = form.querySelector("[data-stars]");
  const btns = root ? [...root.querySelectorAll("[data-i]")] : [];
  const rating = document.getElementById("rating");

  function fmt(n) {
    const s = n % 1 === 0 ? String(n) : n.toFixed(1);
    return s.replace(".", ",");
  }

  function paint(val) {
    const starVal = val / 2;
    btns.forEach((b) => {
      const i = +b.dataset.i;
      let fill = "empty";
      if (starVal >= i) fill = "full";
      else if (starVal >= i - 0.5) fill = "half";
      b.dataset.fill = fill;
      b.setAttribute("aria-checked", String(fill !== "empty" && Math.ceil(starVal) === i));
      b.setAttribute(
        "aria-label",
        fill === "half" ? "Score " + fmt(i * 2 - 1) + " van 10" : "Score " + fmt(i * 2) + " van 10"
      );
    });
  }

  function setScore(val) {
    score = Math.max(0, Math.min(10, val));
    if (rating) rating.value = score ? String(score) : "";
    paint(score);
    bad("rating", false);
  }

  function scoreFromEvent(btn, e) {
    const i = +btn.dataset.i;
    const rect = btn.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const x = clientX - rect.left;
    const half = x < rect.width / 2;
    return half ? i * 2 - 1 : i * 2;
  }

  btns.forEach((b) => {
    b.addEventListener("click", (e) => setScore(scoreFromEvent(b, e)));
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        setScore(Math.min(10, (score || 0) + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        setScore(Math.max(1, (score || 1) - 1));
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setScore(+b.dataset.i * 2);
      }
    });
  });

  const recSel = document.getElementById("RECOMMEND");
  form.querySelectorAll('input[name="recommend"]').forEach((r) => {
    r.addEventListener("change", () => {
      if (recSel) recSel.value = r.value;
      bad("recommend", false);
    });
  });

  const contact = document.getElementById("contact-person");
  const na = document.getElementById("na");
  if (na && contact) {
    na.addEventListener("change", () => {
      contact.disabled = na.checked;
      if (na.checked) contact.value = "";
      bad("contact", false);
    });
  }

  function bad(name, on) {
    form.querySelector('[data-f="' + name + '"]')?.classList.toggle("is-invalid", on);
  }

  function emailOk(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = [];

    if (score < 1) {
      bad("rating", true);
      errs.push("rating");
    } else bad("rating", false);

    if (!document.getElementById("description").value.trim()) {
      bad("title", true);
      errs.push("title");
    } else bad("title", false);

    if (!document.getElementById("body").value.trim()) {
      bad("body", true);
      errs.push("body");
    } else bad("body", false);

    if (recSel.value !== "true" && recSel.value !== "false") {
      bad("recommend", true);
      errs.push("recommend");
    } else bad("recommend", false);

    if (!(na.checked || contact.value)) {
      bad("contact", true);
      errs.push("contact");
    } else bad("contact", false);

    if (!document.getElementById("NAME").value.trim()) {
      bad("name", true);
      errs.push("name");
    } else bad("name", false);

    if (!document.getElementById("CITY").value.trim()) {
      bad("city", true);
      errs.push("city");
    } else bad("city", false);

    const em = document.getElementById("EMAIL").value.trim();
    if (!em || !emailOk(em)) {
      bad("email", true);
      errs.push("email");
    } else bad("email", false);

    if (!document.getElementById("opt-in").checked) {
      bad("consent", true);
      errs.push("consent");
    } else bad("consent", false);

    if (errs.length) {
      form.querySelector('[data-f="' + errs[0] + '"]')?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const params = new URLSearchParams();
    if (score) params.set("score", String(score));
    window.location.href = "thank-you.html" + (params.toString() ? "?" + params.toString() : "");
  });

  const modal = document.getElementById("modal");
  document.querySelectorAll("[data-open-modal]").forEach((b) =>
    b.addEventListener("click", () => {
      modal.hidden = false;
    })
  );
  document.querySelectorAll("[data-close]").forEach((b) =>
    b.addEventListener("click", () => {
      modal.hidden = true;
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.hidden = true;
  });

  const lang = document.querySelector("[data-lang]");
  if (lang) {
    const t = lang.querySelector("[data-lang-toggle]");
    const m = lang.querySelector("[data-lang-menu]");
    const lab = lang.querySelector("[data-lang-label]");
    t?.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !lang.classList.contains("is-open");
      lang.classList.toggle("is-open", open);
      t.setAttribute("aria-expanded", String(open));
      if (m) m.hidden = !open;
    });
    m?.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        if (lab) lab.textContent = b.textContent;
        lang.classList.remove("is-open");
        if (m) m.hidden = true;
      });
    });
    document.addEventListener("click", () => {
      lang.classList.remove("is-open");
      if (m) m.hidden = true;
    });
  }
})();
