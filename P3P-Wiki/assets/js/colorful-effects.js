/* ═══════════════════════════════════════════
   P3P ARCHIVE — js/colorful-effects.js
   Rainbow Particles · Ripple · Magnetic
   Card Shine · Scroll Counter · Color Cursor
═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. RAINBOW FLOATING PARTICLES
   Colorful embers float upward in the hero
────────────────────────────────────────── */
(function () {
  const hero   = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id    = 'particles-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;';
  hero.appendChild(canvas);

  const ctx  = canvas.getContext('2d');
  let   W, H, particles = [];

  const COLORS = [
    '#ff6b85','#ff9a3c','#ffdb6b','#6bffb8',
    '#6bb5ff','#c56bff','#ff6bb5','#6bfff0',
    '#ffb86b','#b8ff6b'
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawnParticle() {
    return {
      x:     Math.random() * W,
      y:     H + 10,
      size:  Math.random() * 3 + 1,
      speedY: Math.random() * 1.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
      life:  0,
      maxLife: Math.random() * 180 + 80,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  // Initialise pool
  for (let i = 0; i < 60; i++) {
    const p = spawnParticle();
    p.y     = Math.random() * H;  // scatter on start
    p.life  = Math.random() * p.maxLife;
    particles.push(p);
  }

  function draw() {
    if (document.hidden || window.P3P?.paused) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);

    // Spawn new
    if (particles.length < 80 && Math.random() < 0.4) {
      particles.push(spawnParticle());
    }

    particles = particles.filter(p => p.life < p.maxLife);

    particles.forEach(p => {
      p.life++;
      p.x    += p.speedX + Math.sin(p.life * 0.03 + p.pulse) * 0.3;
      p.y    -= p.speedY;
      p.pulse += 0.02;

      const progress = p.life / p.maxLife;
      const alpha    = p.alpha * (progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.8) / 0.2);

      // Glow
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      grd.addColorStop(0, p.color + 'cc');
      grd.addColorStop(1, p.color + '00');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.globalAlpha = Math.max(0, alpha * 0.5);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();


/* ──────────────────────────────────────────
   2. RIPPLE ON CLICK
   Rainbow circle expands from click point
────────────────────────────────────────── */
(function () {
  const COLORS = [
    'rgba(255,107,133',
    'rgba(255,154,60',
    'rgba(255,219,107',
    'rgba(107,255,184',
    'rgba(107,181,255',
    'rgba(197,107,255',
  ];
  let colorIdx = 0;

  document.addEventListener('click', (e) => {
    // Don't ripple on modals, nav, buttons that do things
    if (e.target.closest('.modal, #cookie-banner, #idle-overlay')) return;

    const color = COLORS[colorIdx % COLORS.length];
    colorIdx++;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top:  ${e.clientY}px;
      width:  0;
      height: 0;
      border-radius: 50%;
      border: 2px solid ${color},0.8);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 99990;
      animation: rippleExpand 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 850);
  });

  // Inject ripple keyframe
  const s = document.createElement('style');
  s.textContent = `
    @keyframes rippleExpand {
      from { width:0; height:0; opacity:0.9; }
      to   { width:200px; height:200px; opacity:0; }
    }
  `;
  document.head.appendChild(s);
})();


/* ──────────────────────────────────────────
   3. MAGNETIC BUTTONS
   Hero CTA buttons attract toward cursor
────────────────────────────────────────── */
(function () {
  const STRENGTH = 0.35;

  function initMagnetic(btn) {
    btn.addEventListener('mousemove', (e) => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * STRENGTH;
      const dy = (e.clientY - cy) * STRENGTH;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  }

  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(initMagnetic);
})();


/* ──────────────────────────────────────────
   4. CARD SHINE SWEEP
   Diagonal light sweeps across card on hover
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .char-card .shine-layer {
      position: absolute;
      inset: 0;
      z-index: 18;
      pointer-events: none;
      overflow: hidden;
      border-radius: inherit;
    }
    .char-card .shine-layer::after {
      content: '';
      position: absolute;
      top: -60%; left: -60%;
      width: 40%; height: 220%;
      background: linear-gradient(
        105deg,
        transparent 30%,
        rgba(255,255,255,0.08) 50%,
        rgba(255,255,255,0.18) 55%,
        rgba(255,255,255,0.08) 60%,
        transparent 70%
      );
      transform: translateX(-200%) skewX(-15deg);
      transition: none;
    }
    .char-card:hover .shine-layer::after {
      transform: translateX(400%) skewX(-15deg);
      transition: transform 0.65s cubic-bezier(0.16,1,0.3,1);
    }
  `;
  document.head.appendChild(style);

  function addShine(card) {
    if (card.querySelector('.shine-layer')) return;
    const shine = document.createElement('div');
    shine.className = 'shine-layer';
    card.appendChild(shine);
  }

  // Watch for new cards
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.char-card:not([data-shine])').forEach(card => {
      card.dataset.shine = '1';
      addShine(card);
    });
  });

  function init() {
    const grid = document.getElementById('grid');
    if (!grid) { setTimeout(init, 100); return; }
    observer.observe(grid, { childList: true });
    document.querySelectorAll('.char-card').forEach(card => {
      card.dataset.shine = '1';
      addShine(card);
    });
  }
  init();
})();


/* ──────────────────────────────────────────
   5. RAINBOW CURSOR TRAIL
   Override cursor trail with rainbow colors
────────────────────────────────────────── */
(function () {
  const TRAIL_COLORS = [
    '#ff6b85','#ff9a3c','#ffdb6b',
    '#6bffb8','#6bb5ff','#c56bff'
  ];

  // Override the cursor dot to cycle colors
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let hue = 0;
  setInterval(() => {
    hue = (hue + 2) % 360;
    const color = `hsl(${hue},100%,70%)`;
    dot.style.background  = color;
    dot.style.boxShadow   = `0 0 8px ${color}, 0 0 20px ${color}55`;
    ring.style.borderColor = `${color}88`;
  }, 30);
})();


/* ──────────────────────────────────────────
   6. SMOOTH ODOMETER COUNTER
   Result count animates when filter changes
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .rcount {
      transition: color 0.3s ease;
    }
    .rcount.flash {
      color: #c56bff !important;
      text-shadow: 0 0 12px rgba(197,107,255,0.6);
    }
  `;
  document.head.appendChild(style);

  const _origUpdate = window.updateCount;
  if (typeof _origUpdate !== 'function') return;

  window.updateCount = function () {
    _origUpdate();
    const el = document.getElementById('rcount');
    if (!el) return;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 600);
  };
})();


/* ──────────────────────────────────────────
   7. COLORFUL TYPING EFFECT
   Character descriptions type in color
────────────────────────────────────────── */
(function () {
  const CHAR_COLORS = [
    '#ff6b85','#ff9a3c','#ffdb6b','#6bffb8',
    '#6bb5ff','#c56bff','#ff6bb5','#ffffff'
  ];

  // Re-hook openModal with colored typing
  const _orig = window.openModal;
  if (typeof _orig !== 'function') return;

  window.openModal = function (c) {
    _orig(c);

    const descEl = document.getElementById('m-desc');
    if (!descEl) return;

    // Retype with colored chars
    clearInterval(window._typingTimer);
    descEl.textContent = '';

    const text  = c.desc || '';
    let   index = 0;
    let   colorI = 0;

    window._typingTimer = setInterval(() => {
      const char  = text[index];
      const span  = document.createElement('span');
      span.textContent = char;

      // Color every word differently, spaces plain
      if (char && char.trim()) {
        const col = CHAR_COLORS[colorI % CHAR_COLORS.length];
        span.style.color = col;
        span.style.textShadow = `0 0 6px ${col}44`;
        if (char === '.') colorI++;
      }
      descEl.appendChild(span);
      index++;

      if (index >= text.length) clearInterval(window._typingTimer);
    }, 12);
  };
})();


/* ──────────────────────────────────────────
   8. RAINBOW BORDER ANIMATION ON CARDS
   Cards get animated rainbow border on hover
   via JS (complements CSS)
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes borderRainbow {
      0%   { border-color: #ff6b85; }
      16%  { border-color: #ff9a3c; }
      33%  { border-color: #ffdb6b; }
      50%  { border-color: #6bffb8; }
      66%  { border-color: #6bb5ff; }
      83%  { border-color: #c56bff; }
      100% { border-color: #ff6b85; }
    }
    .char-card:hover {
      animation: borderRainbow 2s linear infinite !important;
      border-top-width: 2px !important;
      border-top-style: solid !important;
    }
  `;
  document.head.appendChild(style);
})();


/* ──────────────────────────────────────────
   9. COLORFUL PRELOADER OVERRIDE
   Make the preloader spinner rainbow
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #pre-logo-ring::before {
      background: linear-gradient(135deg, #ff6b85, #c56bff) !important;
      box-shadow: 0 0 12px #c56bff, 0 0 24px #ff6b85 !important;
    }
    #pre-bar {
      background: linear-gradient(90deg,
        #ff6b85, #ff9a3c, #ffdb6b, #6bffb8, #6bb5ff, #c56bff
      ) !important;
      background-size: 200% 100% !important;
      animation: gradientFlow 1s linear infinite !important;
      box-shadow: 0 0 16px rgba(197,107,255,0.6) !important;
    }
    #pre-symbol {
      background: linear-gradient(135deg, #ff6b85, #ff9a3c, #c56bff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 16px rgba(197,107,255,0.8)) !important;
    }
    #pre-title {
      background: linear-gradient(135deg, #ff6b85, #ffdb6b, #6bb5ff, #c56bff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      background-size: 300% 300%;
      animation: gradientFlow 3s ease infinite !important;
    }
    @keyframes gradientFlow {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;
  document.head.appendChild(style);
})();


/* ──────────────────────────────────────────
   10. COLORFUL PAGE WIPE TRANSITION
   Override section wipe with rainbow panels
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #wipe-curtain .wipe-panel:nth-child(1) { background: rgba(255,107,133,0.96); }
    #wipe-curtain .wipe-panel:nth-child(2) { background: rgba(255,154,60,0.96); }
    #wipe-curtain .wipe-panel:nth-child(3) { background: rgba(255,219,107,0.96); }
    #wipe-curtain .wipe-panel:nth-child(4) { background: rgba(107,181,255,0.96); }
    #wipe-curtain .wipe-panel:nth-child(5) { background: rgba(197,107,255,0.96); }
  `;
  document.head.appendChild(style);
})();
