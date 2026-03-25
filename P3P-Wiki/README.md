# Persona 3 Portable — SEES Archive 🎴

A fan-made wiki for Persona 3 Portable featuring all 14 characters, unlock guides, school class answers, and an immersive Dark Hour aesthetic.

## ✨ Features
- Full character encyclopedia with portraits
- Unlock guide for every SEES member
- Filter by route — Starter, Story, Event, FeMC Only
- Live search with text highlight
- Character detail modal
- **Class & Exam Guide** — all school Q&A answers by month, exam answers, academic tips
- GLSL WebGL shader background (domain warping fBm)
- Glitch title animation on load
- Custom dark red cursor with light trail & ring
- Idle Dark Hour overlay after 30s inactivity
- Animated stat counters
- Lazy image loading
- Visibility API pause (saves CPU when tab is hidden)
- SEES-themed preloader screen

## 🗂️ Structure
```
P3P-Wiki/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── script.js          ← Character data + UI logic + Class guide
│   ├── effects.js         ← GLSL shader, cursor, idle overlay
│   └── optimizations.js  ← Preloader, lazy images, visibility API
└── assets/
    └── images/characters/ ← 14 character portraits
```

## 🚀 How to Run
Open `index.html` in any modern browser. No build tools required.

## 🌐 GitHub Pages
1. Push to GitHub repo
2. Settings → Pages → main branch / root
3. Live at `https://yourusername.github.io/P3P-Wiki`

## ⚠️ Disclaimer
Fan project — not affiliated with Atlus. Persona 3 Portable © Atlus.
