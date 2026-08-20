(function () {
  "use strict";

  const THEME_KEY = "kiyoh-theme";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyTheme(mode) {
    const on = mode === "contrast";
    document.documentElement.setAttribute("data-theme", on ? "contrast" : "light");
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Hoog contrast uitschakelen" : "Hoog contrast inschakelen");
    });
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "contrast" ? "contrast" : "light";
  }

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = currentTheme() === "contrast" ? "light" : "contrast";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      applyTheme(next);
    });
  });
  applyTheme(currentTheme());

  const lang = document.querySelector("[data-lang]");
  if (lang) {
    const t = lang.querySelector("[data-lang-toggle]");
    const m = lang.querySelector("[data-lang-menu]");
    const lab = lang.querySelector("[data-lang-label]");

    function setLangOpen(open) {
      lang.classList.toggle("is-open", open);
      t?.setAttribute("aria-expanded", String(open));
      if (m) m.hidden = !open;
    }

    t?.addEventListener("click", (e) => {
      e.stopPropagation();
      setLangOpen(!lang.classList.contains("is-open"));
    });
    m?.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        const name = (b.textContent || "").trim();
        if (lab) lab.textContent = name;
        m.querySelectorAll("button").forEach((opt) => {
          opt.setAttribute("aria-selected", String(opt === b));
        });
        t?.setAttribute("aria-label", "Taal kiezen, huidige taal: " + name);
        setLangOpen(false);
      });
    });
    document.addEventListener("click", () => setLangOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setLangOpen(false);
    });
  }

  const modal = document.getElementById("modal");
  const dialog = modal?.querySelector(".modal__box");
  let lastFocus = null;

  function focusables(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')].filter(
      (el) => !el.hasAttribute("hidden") && el.closest("[hidden]") == null
    );
  }

  function openModal(e) {
    e?.preventDefault();
    if (!modal) return;
    lastFocus = document.activeElement;
    document.querySelectorAll("header, main, footer").forEach((el) => el.setAttribute("aria-hidden", "true"));
    modal.hidden = false;
    (dialog || modal).focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.querySelectorAll("header, main, footer").forEach((el) => el.removeAttribute("aria-hidden"));
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll("[data-open-modal]").forEach((b) => b.addEventListener("click", openModal));
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== "Tab" || !dialog) return;
    const items = focusables(dialog);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  const form = document.getElementById("form");
  if (!form) return;

  let score = 0;
  const root = form.querySelector("[data-stars]");
  const btns = root ? [...root.querySelectorAll("[data-i]")] : [];
  const rating = document.getElementById("rating");
  const preview = document.getElementById("score-preview");
  const status = document.getElementById("form-status");

  const SENTIMENT = {
    1: "Zeer onvoldoende",
    2: "Zeer onvoldoende",
    3: "Ruim onvoldoende",
    4: "Onvoldoende",
    5: "Matig",
    6: "Voldoende",
    7: "Ruim voldoende",
    8: "Goed",
    9: "Zeer goed",
    10: "Uitstekend",
  };

  function sentimentFor(val) {
    return SENTIMENT[val] ?? "";
  }

  function fmt(n) {
    const s = n % 1 === 0 ? String(n) : n.toFixed(1);
    return s.replace(".", ",");
  }

  function paintVisual(val) {
    const starVal = val / 2;
    btns.forEach((b) => {
      const i = +b.dataset.i;
      let fill = "empty";
      if (starVal >= i) fill = "full";
      else if (starVal >= i - 0.5) fill = "half";
      b.dataset.fill = fill;
    });
  }

  function paintA11y(val) {
    const starVal = val / 2;
    const active = val >= 1 ? Math.ceil(starVal) : 1;
    btns.forEach((b) => {
      const i = +b.dataset.i;
      const full = i * 2;
      const half = i * 2 - 1;
      const isChecked = val >= 1 && Math.ceil(starVal) === i;
      b.setAttribute("aria-checked", String(isChecked));
      b.tabIndex = i === active ? 0 : -1;
      b.setAttribute("aria-label", "Score " + fmt(isChecked && starVal < i ? half : full) + " van 10");
    });
    root?.setAttribute("aria-invalid", val < 1 && form.querySelector('[data-f="rating"]')?.classList.contains("is-invalid") ? "true" : "false");
  }

  function updatePreview(val, live) {
    if (!preview) return;
    preview.setAttribute("aria-live", live ? "polite" : "off");
    if (val >= 1) {
      preview.textContent = "Cijfer " + fmt(val) + ": " + sentimentFor(val);
      preview.hidden = false;
    } else {
      preview.textContent = "";
      preview.hidden = true;
    }
  }

  function showCommitted() {
    paintVisual(score);
    paintA11y(score);
    updatePreview(score, true);
  }

  function previewScore(val) {
    paintVisual(val);
    updatePreview(val, false);
  }

  function setScore(val) {
    score = Math.max(0, Math.min(10, val));
    if (rating) rating.value = score ? String(score) : "";
    showCommitted();
    bad("rating", false);
  }

  function scoreFromClientX(clientX) {
    for (const btn of btns) {
      const rect = btn.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right) continue;
      const i = +btn.dataset.i;
      const half = clientX - rect.left < rect.width / 2;
      return half ? i * 2 - 1 : i * 2;
    }
    const first = btns[0];
    const last = btns[btns.length - 1];
    if (first && clientX < first.getBoundingClientRect().left) return 1;
    if (last && clientX > last.getBoundingClientRect().right) return 10;
    return 0;
  }

  function scoreFromEvent(btn, e) {
    const i = +btn.dataset.i;
    const rect = btn.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const x = clientX - rect.left;
    const half = x < rect.width / 2;
    return half ? i * 2 - 1 : i * 2;
  }

  function focusStarForScore(val) {
    const i = Math.max(1, Math.ceil(val / 2));
    btns[i - 1]?.focus();
  }

  btns.forEach((b) => {
    b.addEventListener("click", (e) => setScore(scoreFromEvent(b, e)));
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        setScore(Math.min(10, (score || 0) + 1));
        focusStarForScore(score);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        setScore(Math.max(1, (score || 1) - 1));
        focusStarForScore(score);
      }
      if (e.key === "Home") {
        e.preventDefault();
        setScore(1);
        focusStarForScore(1);
      }
      if (e.key === "End") {
        e.preventDefault();
        setScore(10);
        focusStarForScore(10);
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setScore(+b.dataset.i * 2);
      }
    });
  });

  const canHover = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
  if (root) {
    root.addEventListener("mousemove", (e) => {
      if (!canHover.matches) return;
      const val = scoreFromClientX(e.clientX);
      if (val >= 1) previewScore(val);
    });
    root.addEventListener("mouseleave", () => {
      if (!canHover.matches) return;
      showCommitted();
    });
  }

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
      contact.setAttribute("aria-disabled", String(na.checked));
      if (na.checked) contact.value = "";
      bad("contact", false);
    });
  }

  const controlFor = {
    rating: () => btns.find((b) => b.tabIndex === 0) || btns[0],
    title: () => document.getElementById("description"),
    body: () => document.getElementById("body"),
    recommend: () => form.querySelector('input[name="recommend"]'),
    contact: () => (na?.checked ? na : contact),
    name: () => document.getElementById("NAME"),
    city: () => document.getElementById("CITY"),
    email: () => document.getElementById("EMAIL"),
    consent: () => document.getElementById("opt-in"),
  };

  function invalidTarget(field) {
    const wrap = form.querySelector('[data-f="' + field + '"]');
    if (!wrap) return null;
    return (
      wrap.querySelector("[data-stars]") ||
      wrap.querySelector("input:not([type=hidden]):not([tabindex='-1']), textarea, select")
    );
  }

  function bad(name, on) {
    const wrap = form.querySelector('[data-f="' + name + '"]');
    wrap?.classList.toggle("is-invalid", on);
    const el = invalidTarget(name);
    if (el) el.setAttribute("aria-invalid", on ? "true" : "false");
    if (name === "rating") root?.setAttribute("aria-invalid", on ? "true" : "false");
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
      if (status) {
        status.hidden = false;
        status.textContent =
          errs.length === 1
            ? "Er is 1 veld dat aandacht nodig heeft."
            : "Er zijn " + errs.length + " velden die aandacht nodig hebben.";
      }
      const focusEl = controlFor[errs[0]]?.();
      focusEl?.focus();
      focusEl?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
      return;
    }

    if (status) {
      status.hidden = true;
      status.textContent = "";
    }

    const params = new URLSearchParams();
    if (score) params.set("score", String(score));
    window.location.href = "thank-you.html" + (params.toString() ? "?" + params.toString() : "");
  });
})();
