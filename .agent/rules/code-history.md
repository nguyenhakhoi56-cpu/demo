---
trigger: manual
---

# History (연혁) Component Rules

This document defines the strict implementation rules for the History/Timeline component.

==================================================
[1] HTML STRUCTURE (STRICT)
==================================================
- MUST follow: templates/history-template.html
- Primary Wrapper: `.history-container`
- Two Columns:
    - `.history-left`: Sticky content (usually an image).
    - `.history-right`: The timeline area (must have `id="timeline-container"`).

Timeline Line Structure:
```html
<div class="history-line-bg"></div>
<div class="history-line-active" id="active-line"></div>
```

History Item Structure:
- Year is placed once per `.history-box`.
- Dots are generated via CSS `:before` on `.history-item`.
- DO NOT use `span.dot`.

==================================================
[2] CSS RULES
==================================================
- External File: `styles/history.css`
- Line Alignment:
    - Base Line (`.history-line-bg`) and Active Line (`.history-line-active`) must share the same `left` position.
    - Active line `top` and background line `top` must match.
- Dot Alignment:
    - `.history-item:before` must be horizontally centered on the line.
    - Dot activation color is `#f18d00` (class `.active`).

==================================================
[3] JAVASCRIPT RULES (JQUERY)
==================================================
- External File: `js/history.js`
- Library: jQuery (CDN or local).
- Scroll Trigger: **35% of viewport height**.
- Calculation:
    `let scrollDistance = (scrollY + (window.innerHeight * 0.35)) - containerOffset - lineStartOffset;`
- Edge Case: Force 100% height when reaching the bottom of the page.

==================================================
[4] RESPONSIVE BEHAVIOR
==================================================
- Breakpoint 1024px: Switch to vertical stack (column).
- Breakpoint 768px: Reduce spacing and font sizes proportionally.
- The active line MUST continue to function correctly in the vertical layout.
