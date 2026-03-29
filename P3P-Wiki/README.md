# Persona 3 Portable — SEES Archive 🎴

A fan-made wiki for Persona 3 Portable with characters, class guide, quiz mode, and a full Dark Hour aesthetic.

## ✨ Features

### Content
- Full character encyclopedia with portraits (14 members)
- Unlock guide for every SEAS member
- Filter by route — Starter, Story, Event, FeMC Only, Favorites
- Live search with text highlight
- Character detail modal
- Class & Exam Guide — all school Q&A answers by month
- 🎓 Quiz Mode — interactive class quiz with score tracking

### Visual Effects
- GLSL WebGL shader background (domain warping fBm)
- Constellation background in hero (animated star map)
- Glitch title animation on load
- Neon flicker on subtitle
- Vignette pulse
- Scroll reveal on character cards
- Custom dark red cursor with light trail & ring
- Idle Dark Hour overlay after 30s inactivity
- Animated stat counters
- Typing effect on character descriptions (modal)

### UX & Technical
- Cookie consent banner (GDPR-style)
- Favorite characters with ♥ button (saved in cookies)
- Last filter, search & section restored on return
- URL state sync — share direct links to characters (?character=aigis)
- Share button on every card + inside modal
- Lazy image loading
- Visibility API pause (saves CPU when tab hidden)
- SEES-themed preloader screen

## 🗂️ Structure
```
P3P-Wiki/
├── index.html
├── css/styles.css
├── js/
│   ├── script.js          ← Character data + UI + Class guide + Quiz
│   ├── effects.js         ← GLSL shader, cursor, idle overlay
│   ├── optimizations.js   ← Preloader, lazy images, visibility API
│   ├── cookies.js         ← Cookie consent, favorites, state memory
│   └── new-effects.js     ← Scroll reveal, constellation, neon flicker,
│                             typing effect, quiz, URL sync, share button
└── assets/images/characters/  ← 14 character portraits
```

## 🚀 How to Run
Open `index.html` in any modern browser. No build tools required.

## 🌐 GitHub Pages
1. Push to GitHub repo
2. Settings → Pages → main branch / root
3. Live at `https://yourusername.github.io/P3P-Wiki`

## ⚠️ Disclaimer
Fan project — not affiliated with Atlus. Persona 3 Portable © Atlus.
