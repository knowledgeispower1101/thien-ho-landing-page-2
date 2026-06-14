# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing page for **THIEN HO TECHNOLOGY** — an industrial automation and power transmission company in Vietnam. The full design specification lives in `claude/CLAUDE.md`. The frontend design skill lives in `claude/skills/frontend-design/SKILL.md` and should be consulted when making aesthetic decisions.

## Deliverables

Three files at the project root:

- `index.html`
- `style.css`
- `script.js`

## Technology Constraints

**Allowed only:**
- HTML5, CSS3, Vanilla JavaScript
- AOS (Animate On Scroll) via CDN — for section entrance animations
- SwiperJS via CDN — for testimonials, featured projects, product showcase sliders
- Font Awesome via CDN — for icons

**Forbidden:** React, Next.js, Vue, Angular, TypeScript, Tailwind CSS, Bootstrap, jQuery, or any other library not listed above.

## Color Palette

| Role       | Hex       |
|------------|-----------|
| Primary    | `#0F172A` |
| Secondary  | `#2563EB` |
| Accent     | `#F97316` |
| Background | `#FFFFFF` |
| Text       | `#1E293B` |

## Available Static Assets

```
static/logo/image.png                   — company logo
static/Inverter/AU2-0-0R7G1.png
static/Inverter/AV20-0-1R5G1.png
static/Inverter/AV23-0-0R7G1.png
static/Inverter/AV68-0-4R0G1.png
static/motor/3IK15RGN-C.png
static/motor/4IK30GN-CT.png
static/motor/F-SERIES.png
static/motor/GV22-0.2KW-5.png
static/motor/GYE3-80M1-2.png
static/motor/R-SERIES.png
```

Use these real images in product cards rather than placeholder URLs.

## CSS Architecture

- Mobile-first with breakpoints: `<768px` (mobile), `768–1024px` (tablet), `>1024px` (desktop)
- Use Flexbox and CSS Grid; avoid div-only layouts — prefer semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Watch for selector specificity conflicts between section-level classes and element-level classes (especially padding/margin overrides)

## JavaScript Features Required

Sticky navbar, mobile hamburger menu, smooth scrolling, animated counters (pure JS, triggered on scroll), scroll reveal via AOS, contact form validation (no external library), back-to-top button.

## SEO & Structured Data

Every page needs: full meta tags, Open Graph tags, Twitter Card tags, and a `LocalBusiness` JSON-LD block. See spec for exact field list.

## Deployment

No build step. The output is plain HTML/CSS/JS files deployable directly to any shared hosting environment.



# Unique Design Requirements

DO NOT create a typical corporate website.

The website must feel modern, premium, and memorable.

Avoid:

* Generic hero sections
* Generic blue corporate layouts
* Typical Bootstrap-like designs
* Repetitive card grids

Create a unique visual identity.

---

## Advanced Visual Effects

### Multi-layer Parallax

Implement layered parallax effects:

Layer 1:
Industrial background image

Layer 2:
Floating blueprint lines

Layer 3:
Animated gears

Layer 4:
Glowing technology particles

Each layer moves at different speeds while scrolling.

---

### Industrial Blueprint Theme

Use subtle engineering-inspired graphics:

* Technical grid overlays
* Blueprint lines
* Mechanical schematics
* Circuit patterns
* Motion paths

Background elements should feel like an engineering design document.

---

### Scroll Storytelling

The website should tell a story as users scroll.

Flow:

Problem
↓
Industrial Challenges
↓
THIEN HO Solutions
↓
Products
↓
Projects
↓
Results
↓
Contact

Each section transitions smoothly into the next.

---

### Animated Machine Components

Create subtle floating animations:

* Rotating gears
* Conveyor line effects
* Energy flow lines
* Motion paths

Animations should be elegant and not distracting.

---

### Premium Hero Section

Instead of a static banner:

Create an immersive hero experience.

Include:

* Full-screen section
* Animated industrial scene
* Parallax layers
* Floating statistics
* Dynamic lighting effects

Headline appears with cinematic animation.

---

### Horizontal Scroll Section

Create one section that scrolls horizontally while the user scrolls vertically.

Use for:

* Product showcase
  or
* Industry solutions

Inspired by modern Apple product pages.

---

### Interactive Product Cards

On hover:

* 3D tilt effect
* Depth shadow
* Light reflection
* Smooth transform

Use Vanilla Tilt.js

---

### Scroll Progress Indicator

Display a thin progress line at the top showing scroll completion.

---

### Magnetic Buttons

CTA buttons should have subtle magnetic hover effects.

Cursor slightly attracts toward buttons.

---

### Mouse Parallax

Elements react slightly to mouse movement:

* Hero graphics
* Floating icons
* Background particles

---

## Animation Libraries

Allowed:

AOS
GSAP
ScrollTrigger
Vanilla Tilt

Preferred:

GSAP + ScrollTrigger

Use GSAP for:

* Parallax
* Scroll storytelling
* Section transitions
* Horizontal scrolling
* Text reveals

---

## Visual Inspiration

Combine inspiration from:

* Apple
* Tesla
* Stripe
* Linear
* Siemens
* ABB

Result:

Industrial + Technology + Premium SaaS

NOT a traditional machinery website.

---

## SEO Requirements

The design must remain:

* Fast loading
* Mobile responsive
* Semantic HTML
* Lighthouse SEO 90+
* Accessibility compliant

Animations must not negatively impact performance.
