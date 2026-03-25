/* ═══════════════════════════════════════════
   P3P ARCHIVE — optimizations.js
   Visibility API · Lazy Images · Preloader
═══════════════════════════════════════════ */

/* ── 1. VISIBILITY API ── */
(function () {
  window.P3P = window.P3P || {};
  window.P3P.paused = false;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.P3P.paused = true;
      document.querySelectorAll('.orb, .vignette-pulse, .eyebrow, .scroll-line').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    } else {
      window.P3P.paused = false;
      document.querySelectorAll('.orb, .vignette-pulse, .eyebrow, .scroll-line').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }
  });
})();

/* ── 2. LAZY LOADING ── */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.lazySrc) {
        img.src = img.dataset.lazySrc;
        img.removeAttribute('data-lazy-src');
      }
      observer.unobserve(img);
    });
  }, { rootMargin: '120px', threshold: 0 });

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        const imgs = node.querySelectorAll ? node.querySelectorAll('.portrait-img') : [];
        imgs.forEach(img => {
          if (img.src && img.src !== window.location.href) {
            img.dataset.lazySrc = img.src;
            img.src = '';
            observer.observe(img);
          }
        });
      });
    });
  });

  function initLazy() {
    const grid = document.getElementById('grid');
    if (grid) { mutationObserver.observe(grid, { childList: true }); }
    else { setTimeout(initLazy, 50); }
  }
  initLazy();
})();

/* ── 3. PRELOADER ── */
(function () {
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
      <div id="pre-bar-wrap"><div id="pre-bar"></div></div>
      <div id="pre-percent">0%</div>
    </div>`;
  document.body.prepend(preloader);

  const style = document.createElement('style');
  style.textContent = `
    #preloader{position:fixed;inset:0;z-index:999999;background:#0a0608;display:flex;align-items:center;justify-content:center;transition:opacity 0.8s ease,visibility 0.8s ease;}
    #preloader.hidden{opacity:0;visibility:hidden;pointer-events:none;}
    #pre-inner{display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;}
    #pre-logo{width:80px;height:80px;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
    #pre-logo-ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(232,64,96,0.4);animation:pre-spin 2.4s linear infinite;}
    #pre-logo-ring::before{content:'';position:absolute;top:-3px;left:50%;width:6px;height:6px;background:#e84060;border-radius:50%;box-shadow:0 0 10px #e84060;transform:translateX(-50%);}
    #pre-logo-ring2{position:absolute;inset:8px;border-radius:50%;border:1px solid rgba(212,168,75,0.25);animation:pre-spin 3.6s linear infinite reverse;}
    #pre-symbol{font-size:1.8rem;color:#e84060;text-shadow:0 0 20px rgba(232,64,96,0.8);animation:pre-pulse 1.8s ease-in-out infinite;}
    @keyframes pre-spin{to{transform:rotate(360deg);}}
    @keyframes pre-pulse{0%,100%{opacity:0.6;transform:scale(1);}50%{opacity:1;transform:scale(1.15);}}
    #pre-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#f0e6d8;letter-spacing:0.08em;}
    #pre-sub{font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#7a6870;animation:pre-flicker 2.5s ease-in-out infinite;}
    @keyframes pre-flicker{0%,100%{opacity:1;}48%{opacity:1;}50%{opacity:0.2;}52%{opacity:1;}}
    #pre-bar-wrap{width:200px;height:1px;background:rgba(220,80,100,0.15);overflow:hidden;}
    #pre-bar{height:100%;width:0%;background:linear-gradient(90deg,#e84060,#f0c86e);transition:width 0.25s ease;box-shadow:0 0 8px rgba(232,64,96,0.6);}
    #pre-percent{font-family:'Playfair Display',serif;font-size:0.85rem;color:#7a6870;letter-spacing:0.15em;margin-top:-10px;}
  `;
  document.head.appendChild(style);

  const bar     = document.getElementById('pre-bar');
  const percent = document.getElementById('pre-percent');
  const sub     = document.getElementById('pre-sub');
  const messages = ['Initializing SEES Database…','Loading Persona data…','Scanning for Shadows…','Calibrating Evokers…','Entering the Dark Hour…'];
  let progress = 0, msgIndex = 0;

  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 12 + 3, 92);
    bar.style.width = progress + '%';
    percent.textContent = Math.round(progress) + '%';
    const ni = Math.floor((progress / 100) * messages.length);
    if (ni !== msgIndex && ni < messages.length) { msgIndex = ni; sub.textContent = messages[msgIndex]; }
  }, 200);

  function finish() {
    clearInterval(interval);
    bar.style.width = '100%';
    percent.textContent = '100%';
    sub.textContent = 'Ready.';
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => { preloader.remove(); style.remove(); }, 900);
    }, 400);
  }

  if (document.readyState === 'complete') { finish(); }
  else { window.addEventListener('load', finish); setTimeout(finish, 4000); }
})();
