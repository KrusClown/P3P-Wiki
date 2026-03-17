/* ═══════════════════════════════════════════
   P3P ARCHIVE — optimizations.js
   Visibility API · Lazy Images · Preloader
═══════════════════════════════════════════ */


/* ──────────────────────────────────────────
   1. VISIBILITY API — pause all animations
      when user switches tab, resume on return
────────────────────────────────────────── */
(function () {
  // Collect every animated element on the page
  const animatedSelectors = [
    '.orb', '.vignette-pulse', '.glitch-wrap::before',
    '.glitch-wrap::after', '.hero-title', '#idle-eyebrow'
  ];

  // Track WebGL pause state — read by effects.js render loop
  window.P3P = window.P3P || {};
  window.P3P.paused = false;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden — pause CSS animations and flag WebGL
      window.P3P.paused = true;

      document.querySelectorAll(
        '.orb, .vignette-pulse, .eyebrow, .scroll-line'
      ).forEach(el => {
        el.style.animationPlayState = 'paused';
      });

      console.log('[P3P] Tab hidden — animations paused');
    } else {
      // Page is visible again — resume everything
      window.P3P.paused = false;

      document.querySelectorAll(
        '.orb, .vignette-pulse, .eyebrow, .scroll-line'
      ).forEach(el => {
        el.style.animationPlayState = 'running';
      });

      console.log('[P3P] Tab visible — animations resumed');
    }
  });
})();


/* ──────────────────────────────────────────
   2. LAZY LOADING IMAGES
      Images only load when they are about
      to enter the viewport — saves bandwidth
      and speeds up initial page load
────────────────────────────────────────── */
(function () {
  // Store original src in data-src, clear src until visible
  // This runs BEFORE buildGrid() populates the grid,
  // so we hook into the card rendering via MutationObserver

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;

      // Swap data-src → src to trigger the real load
      if (img.dataset.lazySrc) {
        img.src = img.dataset.lazySrc;
        img.removeAttribute('data-lazy-src');
      }

      // Stop observing once loaded
      observer.unobserve(img);
    });
  }, {
    rootMargin: '120px', // start loading 120px before entering view
    threshold: 0
  });

  // Watch the grid for new cards being added by buildGrid()
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return; // only elements

        // Find all portrait images inside the new card
        const imgs = node.querySelectorAll ? node.querySelectorAll('.portrait-img') : [];
        imgs.forEach(img => {
          if (img.src && img.src !== window.location.href) {
            // Move real src to data attribute
            img.dataset.lazySrc = img.src;
            img.src = ''; // clear until visible
            observer.observe(img);
          }
        });
      });
    });
  });

  // Start watching the grid container
  // Wait for DOM to be ready
  function initLazy() {
    const grid = document.getElementById('grid');
    if (grid) {
      mutationObserver.observe(grid, { childList: true });
    } else {
      // Grid not ready yet, try again shortly
      setTimeout(initLazy, 50);
    }
  }

  // Also lazily load modal image when opened
  const origOpen = window.openModal;
  if (typeof origOpen === 'function') {
    window.openModal = function (c) {
      origOpen(c);
      // Modal image loads normally — it's intentional (user clicked)
    };
  }

  initLazy();

  console.log('[P3P] Lazy loading initialized');
})();


/* ──────────────────────────────────────────
   3. PRELOADER SCREEN
      Shows a SEES-themed loading screen while
      fonts and images are loading, then fades
      out smoothly revealing the full page
────────────────────────────────────────── */
(function () {
  // ── Inject preloader HTML ──
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = `
    <div id="pre-inner">
      <div id="pre-logo">
        <div id="pre-logo-ring"></div>
        <div id="pre-logo-ring2"></div>
        <div id="pre-symbol">✦</div>
      </div>
      <div id="pre-title">P3P Archive</div>
      <div id="pre-sub">Initializing SEES Database…</div>
      <div id="pre-bar-wrap">
        <div id="pre-bar"></div>
      </div>
      <div id="pre-percent">0%</div>
    </div>
  `;
  document.body.prepend(preloader);

  // ── Inject preloader CSS ──
  const style = document.createElement('style');
  style.textContent = `
    #preloader {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: #0a0608;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.8s ease, visibility 0.8s ease;
    }
    #preloader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    #pre-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      text-align: center;
    }
    #pre-logo {
      width: 80px;
      height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }
    #pre-logo-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px solid rgba(232, 64, 96, 0.4);
      animation: pre-spin 2.4s linear infinite;
    }
    #pre-logo-ring::before {
      content: '';
      position: absolute;
      top: -3px; left: 50%;
      width: 6px; height: 6px;
      background: #e84060;
      border-radius: 50%;
      box-shadow: 0 0 10px #e84060;
      transform: translateX(-50%);
    }
    #pre-logo-ring2 {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 1px solid rgba(212, 168, 75, 0.25);
      animation: pre-spin 3.6s linear infinite reverse;
    }
    #pre-symbol {
      font-size: 1.8rem;
      color: #e84060;
      text-shadow: 0 0 20px rgba(232, 64, 96, 0.8);
      animation: pre-pulse 1.8s ease-in-out infinite;
    }
    @keyframes pre-spin  { to { transform: rotate(360deg); } }
    @keyframes pre-pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.15); }
    }
    #pre-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: #f0e6d8;
      letter-spacing: 0.08em;
    }
    #pre-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: #7a6870;
      animation: pre-flicker 2.5s ease-in-out infinite;
    }
    @keyframes pre-flicker {
      0%, 100% { opacity: 1; }
      48%      { opacity: 1; }
      50%      { opacity: 0.2; }
      52%      { opacity: 1; }
    }
    #pre-bar-wrap {
      width: 200px;
      height: 1px;
      background: rgba(220, 80, 100, 0.15);
      position: relative;
      overflow: hidden;
    }
    #pre-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #e84060, #f0c86e);
      transition: width 0.25s ease;
      box-shadow: 0 0 8px rgba(232, 64, 96, 0.6);
    }
    #pre-percent {
      font-family: 'Playfair Display', serif;
      font-size: 0.85rem;
      color: #7a6870;
      letter-spacing: 0.15em;
      margin-top: -10px;
    }
  `;
  document.head.appendChild(style);

  // ── Progress simulation ──
  const bar     = document.getElementById('pre-bar');
  const percent = document.getElementById('pre-percent');
  const sub     = document.getElementById('pre-sub');

  const messages = [
    'Initializing SEES Database…',
    'Loading Persona data…',
    'Scanning for Shadows…',
    'Calibrating Evokers…',
    'Entering the Dark Hour…',
  ];

  let progress  = 0;
  let msgIndex  = 0;

  // Smoothly animate progress bar
  const progressInterval = setInterval(() => {
    // Random increments for realistic feel
    const increment = Math.random() * 12 + 3;
    progress = Math.min(progress + increment, 92); // stop at 92 — real load finishes it
    bar.style.width   = progress + '%';
    percent.textContent = Math.round(progress) + '%';

    // Cycle through messages
    const newIndex = Math.floor((progress / 100) * messages.length);
    if (newIndex !== msgIndex && newIndex < messages.length) {
      msgIndex = newIndex;
      sub.textContent = messages[msgIndex];
    }
  }, 200);

  // ── Finish when page fully loaded ──
  function finish() {
    clearInterval(progressInterval);

    // Snap to 100%
    bar.style.width     = '100%';
    percent.textContent = '100%';
    sub.textContent     = 'Ready.';

    // Short pause then fade out
    setTimeout(() => {
      preloader.classList.add('hidden');

      // Remove from DOM after fade
      setTimeout(() => {
        preloader.remove();
        style.remove();
        console.log('[P3P] Preloader dismissed');
      }, 900);
    }, 400);
  }

  // Trigger on window load or 4s max timeout
  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
    setTimeout(finish, 4000); // safety fallback
  }

  console.log('[P3P] Preloader initialized');
})();