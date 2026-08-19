# Kiyoh design language

Derived from the public review page (screenshot + live CSS, 2026 redesign).

**Source:**  
https://www.kiyoh.com/reviews/1044505/kiyoh_nl_klantbeoordelingen?lang=nl

This document describes **what that page looks like** so other surfaces (including invite / add-review) can reuse the same language without inventing a second system.

---

## 1. Brand feel

| Trait | How it shows up |
|--------|------------------|
| Trustworthy | Green checks, shield badge, verified copy |
| Calm | Cool gray page, white cards, light borders |
| Warm action | One terracotta/orange CTA per context |
| Precise | Tabular scores, NL number formatting |
| Not flashy | Soft shadows, no heavy gradients on chrome |

Logo mark: multicolor arc (red → orange → yellow → green) + check. That spectrum is reserved for **score visualization**, not general decoration.

---

## 2. Color

Values observed in production CSS on the review page.

### Core

| Role | Hex | Usage |
|------|-----|--------|
| Primary / CTA | `#DD6825` | Pill buttons, accent titles, active accents |
| Primary hover | `#CD4D02` | Button hover |
| Primary soft | `#FFFAF6` | Soft orange wash (selected / tint) |
| Ink | `#1D2530` | Headings, primary text, big numbers |
| Slate | `#627084` | Labels, secondary text |
| Muted | `#8B95A5` (approx.) | Hints, captions |
| Line | `#DAE0E7` | Card borders, dividers, control borders |
| Canvas | `#F9FAFB` | Page background |
| Surface | `#FFFFFF` | Cards, header, inputs |
| Wash | `#F3F5F7` / light gray | Nested stat tiles, input wells |

### Semantic

| Role | Hex | Usage |
|------|-----|--------|
| Success / verified | `#68B03D` | Checks, shield accent, positive list items |
| Star | `#FFB612` | Filled rating stars |
| Star empty | `#D5DBE3` / light gray | Empty stars |
| Gold / trophy | warm gold | “Top beoordeeld” icon |
| Score spectrum | red → orange → yellow → lime → green | Gauge arc only |

### Rules

- Page is **cool**; the only warm large surface is the **primary button**.
- Do not tint whole cards orange.
- Green is for trust/success, not for primary actions.
- Score rainbow is **not** a general brand gradient for backgrounds or buttons.

---

## 3. Typography

| Role | Size | Weight | Color |
|------|------|--------|--------|
| Page / card title | ~20px | 700 | Ink |
| Section title (sidebar accent) | ~16–17px | 700 | Primary (`#DD6825`) when it’s a sidebar label like “Review overzicht” |
| Section title (main, neutral) | ~16–17px | 700 | Ink |
| Stat value | ~20–22px | 700 | Ink |
| Big score (gauge center) | ~40–48px | 700 | Ink |
| Body | ~14–15px | 400 | Ink / slate |
| Label / meta | ~12.5–13px | 500 | Slate |
| Caption / hint | ~12–12.5px | 400 | Muted |

**Font:** clean geometric sans (production uses Geist; Inter is an acceptable stand-in).

**Locale (NL):**

- Decimal comma: `9,7` · `8,7`
- Thousands dot: `1.476` · `2.834.696`

Use tabular nums for scores and stats.

---

## 4. Spacing

Practical scale used on the page:

`4 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 28 · 32`

| Context | Typical |
|---------|---------|
| Page horizontal padding | 24px (16px mobile) |
| Card internal padding | 20–24px |
| Gap between cards | 16–20px |
| Main ↔ sidebar gap | ~20px |
| Stat tile grid gap | 10–12px |
| Label → control | 6–8px |

---

## 5. Radius

| Element | Radius |
|---------|--------|
| Page cards / panels | 16–20px |
| Nested stat tiles | 12px |
| Trust badges | 12–14px |
| Inputs / small controls | 10–12px |
| Primary button, chips, filter pills | Full pill (`999px`) |
| Score bubble on a review | Full circle |
| Language / header cluster | ~12–14px outer |

---

## 6. Border & shadow

- Default border: `1px solid #DAE0E7`
- Cards sit on canvas with a **light** shadow, e.g.  
  `0 1px 2px rgba(0,0,0,0.04)` and/or `0 2px 8px rgba(0,0,0,0.06)`  
  Not heavy drop shadows.
- Nested tiles: often **no** strong shadow; fill with wash gray instead.
- Header: white bar, `1px` bottom border, optional slight blur if sticky.

---

## 7. Layout (review page)

```
Max width ~1120–1180px, centered

┌ Header: logo left · action cluster right ─────────────┐
│                                                        │
│  MAIN (~65–70%)              SIDEBAR (~30–35%)         │
│  ┌ Hero card ──────────┐     ┌ Review overzicht ────┐  │
│  │ Gauge · title ·     │     │ Sentiment · summary  │  │
│  │ 2×2 stats · CTA     │     │ Sterke punten        │  │
│  └─────────────────────┘     └──────────────────────┘  │
│  ┌ Filters ────────────┐     [Verified] [Top]          │
│  └─────────────────────┘     ┌ Over company ────────┐  │
│  ┌ Topic chips ────────┐     └──────────────────────┘  │
│  └─────────────────────┘                               │
│  ┌ Review list… ───────┐                               │
│  └─────────────────────┘                               │
└────────────────────────────────────────────────────────┘
```

- Sidebar can be sticky under the header on desktop.
- Below ~1024px: single column; sidebar stacks (order is a product choice).

---

## 8. Components (as seen on the review page)

### 8.1 Header

- White full-width bar.
- Logo left (wordmark / mark).
- Right **cluster**: light border, rounded container holding icon buttons + language (flag + label + chevron) + small logo mark.
- Icons are quiet slate; primary color only on active accents.

### 8.2 Hero card

- One large white card.
- **Left:** score gauge (incomplete rainbow ring), large score, gold stars, caption (“N beoordelingen in de laatste 12 maanden”).
- **Right:** title + **2×2 wash tiles** (label above, bold value below): totaal score, aantal beoordelingen, beveelt aan %, keer bekeken.
- **CTA:** primary pill, bottom-right of hero — e.g. “Schrijf een review” with pencil icon, white text on `#DD6825`.

### 8.3 Score gauge

- Thick arc, spectrum red→green.
- Center: large score with NL comma.
- Only for **displaying an aggregate or known score** on overview-style views.
- Not a generic ornament.

### 8.4 Primary button

- Pill shape.
- Background `#DD6825`, text white, medium weight ~14–15px.
- Optional left icon (pencil on write CTA).
- Min height ~44px.
- One clear primary per view.

### 8.5 Stat tile

- Wash background, 12px radius, padding ~12–14px.
- Label 12.5px slate; value 20px bold ink.

### 8.6 Filter bar

- Full-width white card, horizontal.
- “Filters” + empty star controls + dropdown pills (“Datum…”, “Toon alle talen”) + circular orange reset.

### 8.7 Dropdown / pill control

- White or wash fill, 1px line border, pill or 12px radius, chevron right.
- Compact height ~36–40px.

### 8.8 Topic chips

- Section title + short helper.
- Wrap row of outline pills: label + small count badge.
- Quiet; selected state = light primary tint + stronger border (if interactive).

### 8.9 Review list card

- White card.
- Left: **green circle** with score number (e.g. `10`) in white.
- Gold stars + bold title + body + meta (date, name, city, company).
- Optional “Beveelt aan” and share.
- Optional company reply block.

### 8.10 Sidebar — Review overzicht

- Title in **primary orange**.
- “Positief sentiment” + % + horizontal spectrum bar.
- Short AI/summary paragraph in slate.
- “Sterke punten” with green checks.
- Footer meta: “Gebaseerd op N reviews”.

### 8.11 Trust badges

- Compact white pills/cards, 1px border, light shadow.
- Green shield + “Geverifieerde reviews”.
- Gold trophy + “Top beoordeeld”.
- Icon + 13–14px semibold label.

### 8.12 About card

- Info icon + bold title “Over {company}”.
- Multi-paragraph slate body.

---

## 9. Iconography

Style: simple, slightly rounded, 1.5–2px stroke or flat brand icons.

Recurring on the review page:

- Share, pencil, chevron down, stars  
- Shield (verified), trophy (top rated)  
- Check, trend/up for strong points  
- Info for about  

Prefer **production assets** from the Kiyoh app bundle over generic redraws when implementing for real.

---

## 10. Interaction

| Pattern | Behaviour |
|---------|-----------|
| Primary button | Hover darkens toward `#CD4D02` |
| Stars | Gold when filled; used for display and as filters |
| Chips / filters | Toggle; clear selected styling |
| Cards | Mostly static; hover lift is optional and subtle |
| Focus | Visible ring using primary at low alpha |

Touch targets for interactive stars/buttons ≥ ~40–44px.

---

## 11. Principles

1. **Card on cool gray** — content lives in white rounded panels.
2. **One warm CTA** — orange is for action, not chrome.
3. **Score is sacred** — big gauge + rainbow only where a score is the subject (overview).
4. **Nested wash, not nested cards-in-cards with heavy shadow.**
5. **Density with air** — lots of data, consistent 12–16px internal rhythm.
6. **Trust cues are small and repeated** — badges, checks, verified language.
7. **NL product polish** — copy, number format, language switcher.

---

## 12. Using this language on other pages

Reuse:

- Canvas / surface / line / ink / slate / primary  
- Card radius, border, light shadow  
- Pill primary button  
- Label + control spacing  
- Header cluster pattern if the page is public Kiyoh chrome  
- Trust badge styling if verification is relevant  

Do **not** automatically copy listing-only blocks:

| Listing-only | Why |
|--------------|-----|
| Large score gauge + aggregate stats | Belongs on review **overview**, not on every form |
| Sentiment bar / “Sterke punten” AI block | Overview insight |
| Review list + topic filters | Browse context |
| “Schrijf een review” as a second hero CTA | On a page that *is* the write flow, the submit control is enough |

### Invite / add-review (guidance only)

Keep it simple:

- Same header chrome if it’s a public Kiyoh URL.  
- Simple page title: e.g. “Beoordeel {bedrijf}”.  
- One (or few) white form cards with clear labels, inputs, stars for **this user’s** rating, recommend, personal fields, consent, primary **Verstuur**.  
- Optional slim sidebar: short about text and/or trust badges — **not** the company’s live gauge and traffic stats.  
- No fake wizard theatrics unless product explicitly wants steps.

The design language is the **tokens + card + type + button + badge** system.  
The review hero is a **page pattern**, not a mandatory frame for every screen.

---

## 13. Token cheat sheet

```text
--color-primary:        #DD6825
--color-primary-hover:  #CD4D02
--color-primary-soft:   #FFFAF6
--color-ink:            #1D2530
--color-slate:          #627084
--color-line:           #DAE0E7
--color-canvas:         #F9FAFB
--color-surface:        #FFFFFF
--color-wash:           #F3F5F7
--color-success:        #68B03D
--color-star:           #FFB612

--radius-card:          18px
--radius-tile:          12px
--radius-pill:          999px

--shadow-card:          0 1px 2px #0000000A, 0 2px 8px #0000000A
--font:                 Geist, Inter, system-ui, sans-serif
--max-width:            1180px
```

---

## 14. Out of scope for this file

- Pixel-perfect HTML/CSS implementation  
- Invite page mockups  
- Backend/form field contracts  

When building a screen: match **this** language; only reuse listing modules when the screen’s job is the same as the listing page.
