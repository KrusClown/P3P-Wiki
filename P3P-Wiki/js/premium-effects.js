/* ═══════════════════════════════════════════
   P3P ARCHIVE — premium-effects.js
   1. Hover 3D Tilt + Shine
   3. Section Wipe Transition
   4. Blood Moon Background
   5. Stats Radar Chart in Modal
═══════════════════════════════════════════ */


/* ──────────────────────────────────────────
   1. HOVER 3D TILT + SHINE
   Cards physically tilt in 3D following the
   mouse, with a light reflection sweeping
   across the portrait simultaneously
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    /* Enable 3D perspective on grid */
    .char-grid {
      perspective: 1200px;
    }

    /* Card 3D transform base */
    .char-card {
      transform-style: preserve-3d;
      will-change: transform;
      transition: transform 0.12s ease, background 0.25s, box-shadow 0.25s !important;
    }
    .char-card.tilt-active {
      transition: none !important;
      box-shadow:
        0 20px 60px rgba(0,0,0,0.5),
        0 0 0 1px rgba(232,64,96,0.2);
    }
    .char-card.tilt-reset {
      transition: transform 0.55s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.55s ease,
                  background 0.25s !important;
    }

    /* Shine overlay */
    .card-shine {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 20;
      border-radius: inherit;
      background: radial-gradient(
        circle at var(--shine-x, 50%) var(--shine-y, 50%),
        rgba(255,255,255,0.12) 0%,
        rgba(255,255,255,0.04) 30%,
        transparent 65%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    }
    .char-card:hover .card-shine,
    .char-card.tilt-active .card-shine {
      opacity: 1;
    }

    /* Portrait depth layer — moves opposite to tilt for parallax */
    .char-card .portrait-img {
      transform: translateZ(0px);
      transition: transform 0.12s ease, filter 0.35s !important;
    }
    .char-card.tilt-active .portrait-img {
      transform: translateZ(18px) scale(1.04);
    }
  `;
  document.head.appendChild(style);

  const MAX_TILT  = 14; // max degrees
  const SHINE_AMT = 1.8;

  function applyTilt(card) {
    if (card._tiltBound) return;
    card._tiltBound = true;

    // Inject shine element
    if (!card.querySelector('.card-shine')) {
      const shine = document.createElement('div');
      shine.className = 'card-shine';
      card.appendChild(shine);
    }

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);

      const rotY   =  dx * MAX_TILT;
      const rotX   = -dy * MAX_TILT;

      // Shine position — inverted for specular feel
      const shineX = ((-dx * SHINE_AMT + 1) / 2 * 100).toFixed(1);
      const shineY = ((-dy * SHINE_AMT + 1) / 2 * 100).toFixed(1);

      card.classList.add('tilt-active');
      card.classList.remove('tilt-reset');
      card.style.transform = `
        perspective(1200px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        scale3d(1.03, 1.03, 1.03)
      `;

      const shine = card.querySelector('.card-shine');
      if (shine) {
        shine.style.setProperty('--shine-x', shineX + '%');
        shine.style.setProperty('--shine-y', shineY + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
      card.classList.add('tilt-reset');
      card.style.transform = '';
      setTimeout(() => card.classList.remove('tilt-reset'), 550);
    });
  }

  // Apply to existing cards + watch for new ones
  function initTilt() {
    document.querySelectorAll('.char-card').forEach(applyTilt);
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll('.char-card:not([data-tilt])').forEach(card => {
      card.dataset.tilt = '1';
      applyTilt(card);
    });
  });

  function start() {
    const grid = document.getElementById('grid');
    if (!grid) { setTimeout(start, 100); return; }
    observer.observe(grid, { childList: true });
    initTilt();
  }
  start();
})();


/* ──────────────────────────────────────────
   3. SECTION WIPE TRANSITION
   A crimson curtain sweeps across the screen
   when switching between nav sections,
   revealing the new content dramatically
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #wipe-curtain {
      position: fixed;
      inset: 0;
      z-index: 99990;
      pointer-events: none;
      display: flex;
    }

    /* Three vertical panels that sweep in sequence */
    .wipe-panel {
      flex: 1;
      background: var(--bg);
      transform: scaleY(0);
      transform-origin: bottom;
      border-right: 1px solid rgba(232,64,96,0.15);
    }
    .wipe-panel:last-child { border-right: none; }

    /* Sweep IN — panels drop from top */
    #wipe-curtain.wipe-in .wipe-panel {
      animation: wipe-in-panel 0.35s cubic-bezier(0.76,0,0.24,1) both;
    }
    #wipe-curtain.wipe-in .wipe-panel:nth-child(1) { animation-delay: 0s; }
    #wipe-curtain.wipe-in .wipe-panel:nth-child(2) { animation-delay: 0.04s; }
    #wipe-curtain.wipe-in .wipe-panel:nth-child(3) { animation-delay: 0.08s; }
    #wipe-curtain.wipe-in .wipe-panel:nth-child(4) { animation-delay: 0.12s; }
    #wipe-curtain.wipe-in .wipe-panel:nth-child(5) { animation-delay: 0.16s; }

    /* Sweep OUT — panels retract upward */
    #wipe-curtain.wipe-out .wipe-panel {
      animation: wipe-out-panel 0.35s cubic-bezier(0.76,0,0.24,1) both;
      transform-origin: top;
    }
    #wipe-curtain.wipe-out .wipe-panel:nth-child(1) { animation-delay: 0s; }
    #wipe-curtain.wipe-out .wipe-panel:nth-child(2) { animation-delay: 0.04s; }
    #wipe-curtain.wipe-out .wipe-panel:nth-child(3) { animation-delay: 0.08s; }
    #wipe-curtain.wipe-out .wipe-panel:nth-child(4) { animation-delay: 0.12s; }
    #wipe-curtain.wipe-out .wipe-panel:nth-child(5) { animation-delay: 0.16s; }

    @keyframes wipe-in-panel {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    @keyframes wipe-out-panel {
      from { transform: scaleY(1); }
      to   { transform: scaleY(0); }
    }

    /* Red accent line at top of curtain */
    #wipe-curtain::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--red), var(--red2), var(--red), transparent);
      z-index: 1;
      opacity: 0;
      transition: opacity 0.2s;
    }
    #wipe-curtain.wipe-in::before  { opacity: 1; }
    #wipe-curtain.wipe-out::before { opacity: 1; }
  `;
  document.head.appendChild(style);

  // Create curtain element
  const curtain = document.createElement('div');
  curtain.id    = 'wipe-curtain';
  curtain.innerHTML = Array(5).fill('<div class="wipe-panel"></div>').join('');
  document.body.appendChild(curtain);

  let isWiping = false;

  function doWipe(callback) {
    if (isWiping) { callback(); return; }
    isWiping = true;

    // Phase 1 — sweep IN (cover screen)
    curtain.className = 'wipe-in';
    setTimeout(() => {
      // Execute the section change while screen is covered
      callback();
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Phase 2 — sweep OUT (reveal new content)
      setTimeout(() => {
        curtain.className = 'wipe-out';
        setTimeout(() => {
          curtain.className = '';
          isWiping = false;
        }, 600);
      }, 80);
    }, 500);
  }

  // Hook into showSec
  const _orig = window.showSec;
  window.showSec = function (id, btn) {
    // Don't wipe if already on same section
    const current = document.querySelector('.nav-link.active');
    if (current && current === btn) return;

    doWipe(() => _orig(id, btn));
  };
})();


/* ──────────────────────────────────────────
   4. BLOOD MOON BACKGROUND
   A large atmospheric red moon in the hero
   that slowly drifts with subtle parallax
   on mouse movement
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #blood-moon {
      position: absolute;
      width: 420px;
      height: 420px;
      border-radius: 50%;
      top: -60px;
      right: -80px;
      pointer-events: none;
      z-index: 1;
      transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);

      /* Layered gradients for atmospheric moon look */
      background:
        radial-gradient(circle at 38% 35%,
          rgba(200,40,40,0.0)  0%,
          rgba(180,30,30,0.08) 25%,
          rgba(140,20,20,0.18) 50%,
          rgba(100,10,10,0.28) 70%,
          rgba(60,5,5,0.15)    85%,
          transparent          100%
        ),
        radial-gradient(circle at 50% 50%,
          rgba(232,64,50,0.06) 0%,
          rgba(180,30,20,0.12) 40%,
          rgba(120,15,10,0.2)  65%,
          transparent          85%
        );

      box-shadow:
        inset -30px -20px 80px rgba(180,20,20,0.25),
        inset  20px  15px 60px rgba(240,80,40,0.08),
        0 0 120px rgba(180,20,20,0.12),
        0 0 200px rgba(140,10,10,0.08);

      animation: moon-breathe 8s ease-in-out infinite;
    }

    /* Crater details */
    #blood-moon::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background:
        radial-gradient(circle at 30% 25%, rgba(0,0,0,0.08) 0%, transparent 15%),
        radial-gradient(circle at 65% 40%, rgba(0,0,0,0.06) 0%, transparent 12%),
        radial-gradient(circle at 45% 65%, rgba(0,0,0,0.05) 0%, transparent 18%),
        radial-gradient(circle at 75% 70%, rgba(0,0,0,0.07) 0%, transparent 10%),
        radial-gradient(circle at 20% 60%, rgba(0,0,0,0.04) 0%, transparent 14%);
    }

    /* Edge glow rim */
    #blood-moon::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: transparent;
      box-shadow: inset 0 0 40px rgba(232,64,96,0.08);
      border: 1px solid rgba(200,40,40,0.12);
    }

    @keyframes moon-breathe {
      0%,100% { opacity: 0.75; transform: scale(1)    translateY(0px); }
      50%      { opacity: 0.90; transform: scale(1.02) translateY(-8px); }
    }

    /* Moon atmosphere halo */
    #moon-halo {
      position: absolute;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      top: -110px;
      right: -130px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(180,20,20,0.06) 0%,
        rgba(140,10,10,0.04) 45%,
        transparent 70%
      );
      animation: moon-breathe 8s ease-in-out infinite;
      animation-delay: -2s;
    }
  `;
  document.head.appendChild(style);

  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Create moon + halo
  const halo = document.createElement('div');
  halo.id    = 'moon-halo';
  hero.appendChild(halo);

  const moon = document.createElement('div');
  moon.id    = 'blood-moon';
  hero.appendChild(moon);

  // Parallax on mouse move
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    if (window.P3P?.paused) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    // Subtle movement — moon only shifts slightly
    targetX = (e.clientX - cx) / cx * -18;
    targetY = (e.clientY - cy) / cy * -12;
  });

  function animateMoon() {
    if (!document.hidden) {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      moon.style.transform = `translate(${currentX}px, ${currentY}px)`;
      halo.style.transform = `translate(${currentX * 0.5}px, ${currentY * 0.5}px)`;
    }
    requestAnimationFrame(animateMoon);
  }
  animateMoon();
})();


/* ──────────────────────────────────────────
   5. STATS RADAR CHART IN MODAL
   Animated SVG hexagon showing character
   stats (STR/MAG/END/AGI/LUK/SKL) that
   draws itself when the modal opens
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #radar-wrap {
      margin-top: 4px;
    }
    #radar-section-label {
      font-size: 9px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--red2);
      margin-bottom: 14px;
    }
    #radar-container {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    #radar-svg-wrap {
      flex-shrink: 0;
    }
    #radar-svg {
      width: 160px;
      height: 160px;
      overflow: visible;
    }
    .radar-grid-line {
      fill: none;
      stroke: rgba(220,80,100,0.12);
      stroke-width: 0.8;
    }
    .radar-axis {
      stroke: rgba(220,80,100,0.15);
      stroke-width: 0.8;
    }
    .radar-area {
      fill: rgba(232,64,96,0.15);
      stroke: var(--red2);
      stroke-width: 1.5;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 6px rgba(232,64,96,0.4));
      transition: d 0.8s cubic-bezier(0.16,1,0.3,1);
    }
    .radar-dot {
      fill: var(--red2);
      r: 3;
      filter: drop-shadow(0 0 4px rgba(232,64,96,0.8));
    }
    .radar-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 8px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      fill: var(--muted2);
      text-anchor: middle;
      dominant-baseline: middle;
    }

    /* Stat bars list */
    .radar-stats-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 140px;
    }
    .radar-stat-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .radar-stat-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .radar-stat-name {
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted2);
    }
    .radar-stat-val {
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--cream);
    }
    .radar-stat-bar {
      height: 2px;
      background: var(--border);
      position: relative;
      overflow: hidden;
    }
    .radar-stat-fill {
      position: absolute;
      top: 0; left: 0; height: 100%;
      background: linear-gradient(90deg, var(--red), var(--red2));
      width: 0%;
      transition: width 0.9s cubic-bezier(0.16,1,0.3,1);
      box-shadow: 0 0 6px rgba(232,64,96,0.5);
    }
  `;
  document.head.appendChild(style);

  // Stat definitions per character — balanced for game accuracy
  const CHAR_STATS = {
    1:  { STR:72, MAG:70, END:68, AGI:74, LUK:70, SKL:72 }, // Male Protagonist
    2:  { STR:68, MAG:72, END:66, AGI:78, LUK:72, SKL:70 }, // Female Protagonist
    3:  { STR:55, MAG:78, END:62, AGI:80, LUK:68, SKL:65 }, // Yukari
    4:  { STR:82, MAG:68, END:72, AGI:65, LUK:58, SKL:75 }, // Junpei
    5:  { STR:85, MAG:62, END:80, AGI:70, LUK:60, SKL:78 }, // Akihiko
    6:  { STR:58, MAG:90, END:65, AGI:72, LUK:65, SKL:70 }, // Mitsuru
    7:  { STR:10, MAG:90, END:40, AGI:55, LUK:80, SKL:85 }, // Fuuka (navigator)
    8:  { STR:68, MAG:80, END:60, AGI:72, LUK:65, SKL:70 }, // Ken
    9:  { STR:75, MAG:75, END:65, AGI:90, LUK:70, SKL:80 }, // Koromaru
    10: { STR:95, MAG:45, END:85, AGI:60, LUK:55, SKL:82 }, // Shinjiro
    11: { STR:80, MAG:78, END:75, AGI:72, LUK:68, SKL:80 }, // Aigis
    12: { STR:20, MAG:20, END:20, AGI:20, LUK:20, SKL:20 }, // Ryoji (non-playable)
    13: { STR:78, MAG:72, END:70, AGI:75, LUK:65, SKL:75 }, // Metis (FES)
    14: { STR:10, MAG:10, END:10, AGI:10, LUK:10, SKL:10 }, // Takeharu (NPC)
    // Strega
    15: { STR:65, MAG:80, END:60, AGI:75, LUK:60, SKL:70 }, // Takaya
    16: { STR:60, MAG:75, END:65, AGI:70, LUK:55, SKL:72 }, // Jin
    17: { STR:50, MAG:88, END:55, AGI:68, LUK:65, SKL:65 }, // Chidori
    // NPCs
    18: { STR:95, MAG:95, END:95, AGI:95, LUK:95, SKL:95 }, // Elizabeth
    19: { STR:95, MAG:95, END:95, AGI:95, LUK:95, SKL:95 }, // Theodore
    20: { STR:10, MAG:10, END:10, AGI:10, LUK:10, SKL:10 }, // Igor
    21: { STR:10, MAG:10, END:10, AGI:10, LUK:10, SKL:10 }, // Pharos
    22: { STR:99, MAG:99, END:99, AGI:99, LUK:99, SKL:99 }, // Nyx Avatar
    23: { STR:10, MAG:10, END:10, AGI:10, LUK:10, SKL:10 }, // Kenji
    24: { STR:10, MAG:10, END:10, AGI:10, LUK:10, SKL:10 }, // Hidetoshi
    25: { STR:10, MAG:10, END:10, AGI:10, LUK:10, SKL:10 }, // Maiko
  };

  const STAT_KEYS   = ['STR','MAG','END','AGI','LUK','SKL'];
  const STAT_COLORS = ['#e84060','#ff6b85','#d4a84b','#f0c86e','#7ab8e8','#50c8a0'];
  const CENTER = 80;
  const RADIUS = 64;

  function hexPoint(index, total, value, maxVal = 100) {
    const angle = (Math.PI * 2 * index / total) - Math.PI / 2;
    const r     = (value / maxVal) * RADIUS;
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    };
  }

  function buildRadar(charId) {
    const stats = CHAR_STATS[charId];
    if (!stats) return '';

    const n    = STAT_KEYS.length;
    const keys = STAT_KEYS;

    // Grid polygons (20%, 40%, 60%, 80%, 100%)
    let gridPolygons = '';
    [20, 40, 60, 80, 100].forEach(pct => {
      const pts = keys.map((_, i) => {
        const p = hexPoint(i, n, pct);
        return `${p.x},${p.y}`;
      }).join(' ');
      gridPolygons += `<polygon class="radar-grid-line" points="${pts}"/>`;
    });

    // Axis lines
    let axes = '';
    keys.forEach((_, i) => {
      const outer = hexPoint(i, n, 100);
      axes += `<line class="radar-axis" x1="${CENTER}" y1="${CENTER}" x2="${outer.x}" y2="${outer.y}"/>`;
    });

    // Data polygon
    const dataPoints = keys.map((k, i) => hexPoint(i, n, stats[k]));
    const dataPath   = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

    // Dots
    let dots = '';
    dataPoints.forEach(p => {
      dots += `<circle class="radar-dot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}"/>`;
    });

    // Labels
    let labels = '';
    keys.forEach((k, i) => {
      const lp = hexPoint(i, n, 118);
      labels += `<text class="radar-label" x="${lp.x.toFixed(1)}" y="${lp.y.toFixed(1)}">${k}</text>`;
    });

    return `
      <svg id="radar-svg" viewBox="0 0 160 160">
        ${gridPolygons}
        ${axes}
        <path class="radar-area" d="${dataPath}"/>
        ${dots}
        ${labels}
      </svg>`;
  }

  function buildStatBars(charId) {
    const stats = CHAR_STATS[charId];
    if (!stats) return '<p style="font-size:12px;color:var(--muted2)">No stats available.</p>';

    return `<div class="radar-stats-list">
      ${STAT_KEYS.map((k, i) => `
        <div class="radar-stat-row">
          <div class="radar-stat-header">
            <span class="radar-stat-name">${k}</span>
            <span class="radar-stat-val">${stats[k]}</span>
          </div>
          <div class="radar-stat-bar">
            <div class="radar-stat-fill" data-width="${stats[k]}" style="background:linear-gradient(90deg,${STAT_COLORS[i]},${STAT_COLORS[(i+1)%STAT_COLORS.length]})"></div>
          </div>
        </div>`).join('')}
    </div>`;
  }

  function injectRadar(charId) {
    // Remove existing radar
    const existing = document.getElementById('radar-wrap');
    if (existing) existing.remove();

    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;

    const wrap  = document.createElement('div');
    wrap.id     = 'radar-wrap';
    wrap.innerHTML = `
      <div id="radar-section-label">Character Stats</div>
      <div id="radar-container">
        <div id="radar-svg-wrap">${buildRadar(charId)}</div>
        ${buildStatBars(charId)}
      </div>`;

    // Insert before the skills section (last child)
    const skillsDiv = [...modalContent.children].find(el => el.querySelector('.skills'));
    if (skillsDiv) modalContent.insertBefore(wrap, skillsDiv);
    else modalContent.appendChild(wrap);

    // Animate stat bars after a short delay
    setTimeout(() => {
      document.querySelectorAll('.radar-stat-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 120);
  }

  // Hook into openModal
  const _orig = window.openModal;
  window.openModal = function (c) {
    _orig(c);
    setTimeout(() => injectRadar(c.id), 60);
  };
})();
