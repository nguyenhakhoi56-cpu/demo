---
trigger: always_on
---

You are coding for a Korean client’s CMS using ONLY HTML, CSS, and JavaScript.

You MUST follow ALL rules strictly. No exceptions.

==================================================
[1] CORE PRIORITY: PIXEL-PERFECT IMPLEMENTATION
==================================================

- If a design (image/screenshot) is provided:
  → Reproduce it 100% visually identical

This includes:
- Spacing, alignment, proportions
- Typography hierarchy
- Image placement
- Borders, backgrounds
- Overall visual balance

DO NOT:
- Redesign
- Simplify
- Approximate

If unclear:
→ Infer the most visually accurate result from the design

==================================================
[2] HTML STRUCTURE (HIGHEST PRIORITY)
==================================================

- ALWAYS follow: templates/structure-template.html
- This is the SINGLE SOURCE OF TRUTH for:
  - Layout structure
  - Container usage
  - Heading hierarchy

Rules:
- NEVER invent your own structure
- NEVER misuse heading tags
- NEVER skip required wrappers

- DO NOT use <section>
- Default container = <div>

==================================================
[3] TYPOGRAPHY RULES
==================================================

ALWAYS reuse classes from @guide.css

Default:
- Section title → <h4 class="h4-tit01">
- Body text → <p class="con-p">

STRICT RULES:
- Match correct tag + correct class (no mixing)
- DO NOT use heading styles for non-heading content
- DO NOT fake headings using <div> or <p>

==================================================
[4] IMAGE RULES
==================================================

ALL images MUST follow:

<div class="img-box">
  <img src="" alt="...">
</div>

Rules:
- NEVER place <img> outside .img-box
- DO NOT remove existing src
- If missing → leave src=""

ALT rules:
- MUST be meaningful
- Use Korean if UI is Korean
- NEVER leave alt empty (unless decorative)

==================================================
[5] RESPONSIVE RULES
==================================================

Breakpoints:
- Tablet: max-width 1024px
- Mobile: max-width 768px

Rules:
- Desktop = pixel-perfect
- Tablet/Mobile:
  - Reduce spacing proportionally
  - Stack layouts vertically
  - NO horizontal scroll (unless required)

==================================================
[6] LIST RULES (STRICT)
==================================================

- NEVER fake lists using div/p/br

Use ONLY:

Unordered:
<ul class="ul-type-dot">

Ordered:
<ol class="ol-type01">

Rules:
- MUST reuse @guide.css classes
- DO NOT create custom list styles

==================================================
[7] TABLE RULES (STRICT)
==================================================

- MUST follow: templates/table-template.html
- DO NOT modify structure
- DO NOT create custom table CSS

==================================================
[8] LINK RULES
==================================================

Phone:
<a href="tel:010-1234-5678" title="전화걸기">

Email:
<a href="mailto:test@email.com" title="메일 보내기">

Rules:
- NEVER plain text
- title is REQUIRED

==================================================
[9] DIVIDER RULE
==================================================

❌ NEVER:
<div class="line"></div>

✅ USE:
border-top / border-bottom on existing elements

==================================================
[10] CSS RULES
==================================================

- Write CSS in style.css ONLY
- NO inline styles
- NO global override unless necessary

Units:
- Prefer flexible: %, flex, grid
- Avoid fixed width

==================================================
[11] CSS BEST PRACTICES (VERY IMPORTANT)
==================================================

❌ NEVER USE:
- !important

If broken:
→ Fix specificity or structure

------------------------------------------

⚠️ MINIMIZE NEW CLASSES

- DO NOT create unnecessary classes
- USE parent-based styling

GOOD:
.card-box p{}

BAD:
.card-text{}

------------------------------------------

✅ USE STRUCTURE FIRST
- Use tag selectors where possible
- Only add class if truly needed

==================================================
[12] CSS FORMAT (STRICT)
==================================================

ALL CSS MUST BE ONE LINE PER SELECTOR

✅ CORRECT:
.card{padding:20px;margin:10px;}

❌ WRONG:
.card{
  padding:20px;
}

==================================================
[13] CLEAN DOM & ACCESSIBILITY
==================================================

- NO unnecessary elements
- ALL <a> must have title
- Semantic HTML only

==================================================
[14] JAVASCRIPT RULES
==================================================

- Use vanilla JS only (no libraries)
- Keep logic simple and scoped
- DO NOT manipulate DOM unnecessarily
- DO NOT break HTML structure

==================================================
FINAL RULE
==================================================

If ANY rule conflicts:
→ PRIORITY ORDER:

1. structure-template.html
2. Pixel-perfect design
3. guide.css
4. All other rules

You must follow this priority strictly.