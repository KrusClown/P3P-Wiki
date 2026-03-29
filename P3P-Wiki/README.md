# Persona 3 Portable — SEES Archive 🎴

Fan-made wiki for P3P — characters, class guide, quiz mode, and full Dark Hour aesthetic.

## ✨ All Effects & Features

### Visual Effects
- GLSL WebGL shader background (domain warping fBm)
- Blood Moon — atmospheric parallax moon in hero
- Constellation background — animated star map
- Hover 3D tilt + shine on character cards
- Section wipe transition between nav tabs
- Glitch title animation on load
- Neon flicker on subtitle
- Vignette pulse
- Scroll reveal on cards
- Custom dark red cursor with trail & ring
- Idle Dark Hour overlay (30s inactivity)
- Animated stat counters

### Modal
- Stats radar chart (animated SVG hexagon)
- Stat bars with color gradients
- Typing effect on character descriptions
- Share button with URL copy

### Content
- 14 character profiles with portraits
- Unlock guide for every member
- Filter by route + Favorites
- Live search with highlight
- Class & Exam Guide (10 months)
- Interactive Quiz Mode with scoring

### UX & Technical
- Cookie consent banner
- Favorites saved in cookies
- Last filter/search/section restored
- URL state sync (?character=aigis)
- Share button on cards + modal
- Lazy image loading
- Visibility API pause
- SEES preloader screen

## 🗂️ File Structure
```
P3P-Wiki/
├── index.html
├── css/styles.css
├── js/
│   ├── script.js           ← Data + UI + Class guide + Quiz
│   ├── effects.js          ← GLSL, cursor, idle overlay
│   ├── optimizations.js    ← Preloader, lazy load, visibility
│   ├── cookies.js          ← Consent, favorites, state memory
│   ├── new-effects.js      ← Scroll reveal, constellation, neon,
│   │                          typing, quiz, URL sync, share
│   └── premium-effects.js  ← 3D tilt+shine, wipe transition,
│                              blood moon, stats radar
└── assets/images/characters/
```

## 🚀 Run
Open `index.html` — no build tools needed.

## ⚠️ Disclaimer
Fan project. Persona 3 Portable © Atlus.
