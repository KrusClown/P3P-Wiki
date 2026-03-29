/* ═══════════════════════════════════════════
   P3P ARCHIVE — new-effects.js
   2. Scroll Reveal · 5. Constellation BG
   7. Neon Flicker · 14. Typing Effect (Modal)
   21. Quiz Mode · 25. URL State Sync
   32. Share Button
═══════════════════════════════════════════ */


/* ──────────────────────────────────────────
   2. SCROLL REVEAL
   Cards fade + slide up as they enter viewport
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .char-card {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1) !important;
    }
    .char-card.revealed {
      opacity: 1;
      transform: translateY(0) !important;
    }
    /* Cards that are hidden by filter stay hidden */
    .char-card.hidden { opacity: 0 !important; pointer-events: none; }
  `;
  document.head.appendChild(style);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = [...document.querySelectorAll('.char-card')].indexOf(card);
        setTimeout(() => card.classList.add('revealed'), index % 4 * 60);
        io.unobserve(card);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Observe cards after buildGrid runs
  const gridObserver = new MutationObserver(() => {
    document.querySelectorAll('.char-card:not(.revealed)').forEach(card => io.observe(card));
  });

  function initScrollReveal() {
    const grid = document.getElementById('grid');
    if (grid) {
      gridObserver.observe(grid, { childList: true });
      document.querySelectorAll('.char-card').forEach(card => io.observe(card));
    } else {
      setTimeout(initScrollReveal, 100);
    }
  }
  initScrollReveal();
})();


/* ──────────────────────────────────────────
   5. CONSTELLATION BACKGROUND
   Stars connected by lines in the hero,
   slowly drifting and connecting nearby points
────────────────────────────────────────── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas  = document.createElement('canvas');
  canvas.id     = 'constellation-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:0.45;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
  const NUM     = 80;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initStars() {
    stars = Array.from({ length: NUM }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r:  Math.random() * 1.4 + 0.4,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    if (document.hidden || window.P3P?.paused) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);

    // Update + wrap
    stars.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.pulse += 0.018;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
    });

    // Draw connections
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx   = stars[i].x - stars[j].x;
        const dy   = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(212,168,75,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw stars
    stars.forEach(s => {
      const glow  = Math.sin(s.pulse) * 0.4 + 0.6;
      const color = Math.random() > 0.85 ? '212,168,75' : '232,64,96';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * glow, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${glow * 0.9})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize(); initStars();
  window.addEventListener('resize', () => { resize(); initStars(); });
  draw();
})();


/* ──────────────────────────────────────────
   7. NEON FLICKER
   The hero subtitle flickers like a damaged
   neon sign at random intervals
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .hero-sub.neon-flicker {
      animation: neon-buzz 0.12s steps(1) forwards;
    }
    @keyframes neon-buzz {
      0%   { opacity:1;   text-shadow: 0 0 8px rgba(240,230,216,0.3); }
      15%  { opacity:0.1; text-shadow: none; }
      30%  { opacity:0.9; text-shadow: 0 0 12px rgba(232,64,96,0.5); }
      45%  { opacity:0.2; text-shadow: none; }
      60%  { opacity:1;   text-shadow: 0 0 8px rgba(240,230,216,0.3); }
      75%  { opacity:0.4; text-shadow: none; }
      100% { opacity:1;   text-shadow: 0 0 8px rgba(240,230,216,0.2); }
    }
  `;
  document.head.appendChild(style);

  function triggerFlicker() {
    const el = document.querySelector('.hero-sub');
    if (!el) return;
    el.classList.remove('neon-flicker');
    void el.offsetWidth; // reflow
    el.classList.add('neon-flicker');
    el.addEventListener('animationend', () => el.classList.remove('neon-flicker'), { once: true });
    // Schedule next flicker at random interval 4–18 seconds
    setTimeout(triggerFlicker, 4000 + Math.random() * 14000);
  }

  // Start after a delay so it doesn't compete with load animations
  setTimeout(triggerFlicker, 5000);
})();


/* ──────────────────────────────────────────
   14. TYPING EFFECT ON MODAL DESCRIPTION
   Character profile text types itself out
   letter by letter when modal opens
────────────────────────────────────────── */
(function () {
  let typingTimer = null;

  // Hook into openModal
  const _orig = window.openModal;
  window.openModal = function (c) {
    _orig(c);

    const descEl = document.getElementById('m-desc');
    if (!descEl) return;

    // Clear any running animation
    clearInterval(typingTimer);
    descEl.textContent = '';

    const text  = c.desc;
    let   index = 0;

    typingTimer = setInterval(() => {
      descEl.textContent += text[index];
      index++;
      if (index >= text.length) clearInterval(typingTimer);
    }, 14); // speed — lower = faster
  };
})();


/* ──────────────────────────────────────────
   21. QUIZ MODE
   Turns the Class Guide Q&A into an
   interactive quiz with score tracking
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #quiz-toggle-btn {
      padding: 8px 20px; font-size: 10px; letter-spacing: 0.2em;
      text-transform: uppercase; background: transparent;
      border: 1px solid var(--border2); color: var(--red2);
      font-family: 'DM Sans', sans-serif; cursor: pointer;
      transition: all 0.25s; margin-left: auto;
    }
    #quiz-toggle-btn:hover { background: rgba(232,64,96,0.08); border-color: var(--red); }
    #quiz-toggle-btn.active { background: rgba(232,64,96,0.15); border-color: var(--red); }

    #quiz-panel {
      margin: 0 64px 32px;
      border: 1px solid var(--border2);
      background: var(--card-bg);
      display: none;
    }
    #quiz-panel.open { display: block; }

    #quiz-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    #quiz-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem; font-weight: 700; color: var(--cream);
    }
    #quiz-score {
      font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--gold2);
    }

    #quiz-body { padding: 24px; }

    #quiz-question {
      font-size: 15px; color: var(--cream); margin-bottom: 20px;
      line-height: 1.6; font-family: 'Playfair Display', serif;
    }
    #quiz-subject {
      font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
      color: var(--red2); margin-bottom: 12px;
    }

    .quiz-options { display: flex; flex-direction: column; gap: 8px; }
    .quiz-opt {
      padding: 12px 18px; background: var(--surface);
      border: 1px solid var(--border); color: var(--text);
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      cursor: pointer; transition: all 0.22s; text-align: left;
    }
    .quiz-opt:hover:not(:disabled) { border-color: var(--red2); color: var(--cream); background: rgba(232,64,96,0.06); }
    .quiz-opt.correct  { border-color: #50c8a0; color: #50c8a0; background: rgba(80,200,160,0.08); }
    .quiz-opt.wrong    { border-color: var(--red); color: var(--red2); background: rgba(232,64,96,0.08); }
    .quiz-opt:disabled { cursor: default; }

    #quiz-feedback {
      margin-top: 16px; padding: 12px 16px;
      font-size: 13px; line-height: 1.6;
      border-left: 2px solid var(--red);
      background: rgba(232,64,96,0.04);
      display: none;
    }
    #quiz-feedback.show { display: block; }
    #quiz-feedback.ok   { border-color: #50c8a0; background: rgba(80,200,160,0.05); color: #50c8a0; }
    #quiz-feedback.bad  { border-color: var(--red); color: var(--red2); }

    #quiz-next {
      margin-top: 16px; padding: 10px 28px;
      background: var(--red); color: #fff;
      font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
      border: none; font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: all 0.25s; display: none;
    }
    #quiz-next:hover { background: var(--red2); }
    #quiz-next.show  { display: inline-block; }

    #quiz-result {
      text-align: center; padding: 32px;
      display: none;
    }
    #quiz-result.show { display: block; }
    #quiz-result-score {
      font-family: 'Playfair Display', serif;
      font-size: 3rem; font-weight: 700; color: var(--red2);
      margin-bottom: 8px;
    }
    #quiz-result-msg { font-size: 14px; color: var(--muted2); margin-bottom: 20px; }
    #quiz-restart {
      padding: 11px 32px; background: transparent;
      border: 1px solid var(--border2); color: var(--cream);
      font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.25s;
    }
    #quiz-restart:hover { border-color: var(--red); color: var(--red2); }

    @media(max-width:900px) { #quiz-panel { margin: 0 20px 24px; } }
  `;
  document.head.appendChild(style);

  // Build quiz question pool from CLASS_DATA
  function buildPool() {
    const pool = [];
    if (typeof CLASS_DATA === 'undefined') return pool;
    Object.values(CLASS_DATA).forEach(month => {
      month.entries.forEach(e => {
        if (e.question && e.answer && e.type === 'class') {
          pool.push({ subject: e.subject, q: e.question, a: e.answer });
        }
        if (e.isExam && e.examQA) {
          e.examQA.forEach(qa => pool.push({ subject: e.subject, q: qa.q, a: qa.a }));
        }
      });
    });
    return pool;
  }

  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

  function generateOptions(correct, pool) {
    const wrong = shuffle(pool.filter(q => q.a !== correct)).slice(0, 3).map(q => q.a);
    return shuffle([correct, ...wrong]);
  }

  let pool = [], current = 0, score = 0, total = 0, answered = false;

  function initQuiz() {
    pool    = shuffle(buildPool());
    current = 0; score = 0; total = pool.length; answered = false;
    renderQuestion();
    document.getElementById('quiz-result').classList.remove('show');
    document.getElementById('quiz-body').style.display = 'block';
  }

  function renderQuestion() {
    if (current >= Math.min(total, 10)) { showResult(); return; }
    const q = pool[current];
    const opts = generateOptions(q.a, pool);

    document.getElementById('quiz-score').textContent    = `Score: ${score} / ${current}`;
    document.getElementById('quiz-subject').textContent  = q.subject;
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-feedback').className   = '';
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next').className       = '';
    answered = false;

    const optContainer = document.querySelector('.quiz-options');
    optContainer.innerHTML = opts.map((o, i) => `<button class="quiz-opt" data-answer="${o}" onclick="quizAnswer(this)">${o}</button>`).join('');
  }

  window.quizAnswer = function (btn) {
    if (answered) return;
    answered = true;
    const q       = pool[current];
    const correct = btn.dataset.answer === q.a;
    if (correct) score++;

    btn.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      document.querySelectorAll('.quiz-opt').forEach(b => {
        if (b.dataset.answer === q.a) b.classList.add('correct');
      });
    }
    document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);

    const fb = document.getElementById('quiz-feedback');
    fb.textContent = correct ? '✓ Correct!' : `✗ The correct answer was: ${q.a}`;
    fb.className   = 'show ' + (correct ? 'ok' : 'bad');
    document.getElementById('quiz-next').className = 'show';
  };

  window.quizNext = function () {
    current++;
    renderQuestion();
  };

  function showResult() {
    document.getElementById('quiz-body').style.display  = 'none';
    document.getElementById('quiz-result').className    = 'show';
    const pct = Math.round((score / Math.min(total, 10)) * 100);
    document.getElementById('quiz-result-score').textContent = `${score} / ${Math.min(total, 10)}`;
    const msgs = ['Keep studying, Persona-user! 📚', 'Not bad — the Dark Hour demands more! 🌑', 'Solid knowledge of Gekkoukan! ✦', 'Top of the class! SEES approves! 🎴'];
    document.getElementById('quiz-result-msg').textContent = pct < 40 ? msgs[0] : pct < 70 ? msgs[1] : pct < 90 ? msgs[2] : msgs[3];
  }

  // Inject quiz UI after class section is available
  function injectQuiz() {
    const classSection = document.getElementById('classes-content');
    if (!classSection) { setTimeout(injectQuiz, 300); return; }

    // Add toggle button to month tabs row
    const tabsRow = document.getElementById('month-tabs');
    if (tabsRow && !document.getElementById('quiz-toggle-btn')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id        = 'quiz-toggle-btn';
      toggleBtn.textContent = '🎓 Quiz Mode';
      toggleBtn.onclick = () => {
        const panel = document.getElementById('quiz-panel');
        const isOpen = panel.classList.toggle('open');
        toggleBtn.classList.toggle('active', isOpen);
        if (isOpen && current === 0) initQuiz();
      };
      tabsRow.appendChild(toggleBtn);
    }

    // Inject quiz panel
    if (!document.getElementById('quiz-panel')) {
      const panel = document.createElement('div');
      panel.id = 'quiz-panel';
      panel.innerHTML = `
        <div id="quiz-header">
          <span id="quiz-title">Gekkoukan Class Quiz</span>
          <span id="quiz-score">Score: 0 / 0</span>
        </div>
        <div id="quiz-body">
          <div id="quiz-subject"></div>
          <div id="quiz-question"></div>
          <div class="quiz-options"></div>
          <div id="quiz-feedback"></div>
          <button id="quiz-next" onclick="quizNext()">Next Question →</button>
        </div>
        <div id="quiz-result">
          <div id="quiz-result-score"></div>
          <div id="quiz-result-msg"></div>
          <button id="quiz-restart" onclick="initQuiz()">Try Again</button>
        </div>`;

      const monthContent = document.getElementById('month-content');
      if (monthContent) monthContent.before(panel);
    }
  }

  setTimeout(injectQuiz, 400);
})();


/* ──────────────────────────────────────────
   25. URL STATE SYNC
   URL updates to ?character=aigis when modal
   opens — allows sharing direct character links
────────────────────────────────────────── */
(function () {
  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Hook openModal
  const _origOpen = window.openModal;
  window.openModal = function (c) {
    _origOpen(c);
    const slug = slugify(c.name);
    history.replaceState({ character: slug }, '', `?character=${slug}`);
  };

  // Hook closeModal
  const _origClose = window.closeModal;
  window.closeModal = function () {
    _origClose();
    history.replaceState({}, '', window.location.pathname);
  };

  // On page load — check URL for character param and open modal
  window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const charParam = params.get('character');
    if (!charParam || typeof CHARS === 'undefined') return;

    // Find matching character
    const match = CHARS.find(c => slugify(c.name) === charParam);
    if (match) {
      setTimeout(() => {
        if (typeof window.openModal === 'function') window.openModal(match);
      }, 800); // wait for page to settle
    }
  });
})();


/* ──────────────────────────────────────────
   32. SHARE BUTTON
   Each card gets a share button that copies
   a direct link to that character to clipboard
────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .share-btn {
      position: absolute; bottom: 12px; left: 12px;
      width: 28px; height: 28px;
      background: rgba(10,6,8,0.78); backdrop-filter: blur(8px);
      border: 1px solid var(--border2); color: var(--muted2);
      font-size: 12px; display: flex; align-items: center; justify-content: center;
      transition: all 0.25s; z-index: 10;
    }
    .share-btn:hover { border-color: var(--gold2); color: var(--gold2); transform: scale(1.15); }
    .share-btn.copied { border-color: #50c8a0; color: #50c8a0; }

    /* Share button inside modal */
    #modal-share-btn {
      padding: 8px 18px; background: transparent;
      border: 1px solid var(--border); color: var(--muted2);
      font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.25s;
      display: flex; align-items: center; gap: 6px;
    }
    #modal-share-btn:hover { border-color: var(--gold2); color: var(--gold2); }
    #modal-share-btn.copied { border-color: #50c8a0; color: #50c8a0; }
  `;
  document.head.appendChild(style);

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function copyLink(name, btn) {
    const slug = slugify(name);
    const url  = `${location.origin}${location.pathname}?character=${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      btn.classList.add('copied');
      if (typeof showToast === 'function') showToast(`🔗 Link copied — ${name}`);
      setTimeout(() => btn.classList.remove('copied'), 1800);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      if (typeof showToast === 'function') showToast(`🔗 Link copied — ${name}`);
    });
  }

  // Inject share buttons into cards after grid builds
  function injectShareButtons() {
    document.querySelectorAll('.char-card').forEach((card, i) => {
      const c = window.CHARS?.[i];
      if (!c || card.querySelector('.share-btn')) return;

      const btn = document.createElement('button');
      btn.className   = 'share-btn';
      btn.title       = `Share ${c.name}`;
      btn.textContent = '🔗';
      btn.onclick     = (e) => { e.stopPropagation(); copyLink(c.name, btn); };

      const portrait = card.querySelector('.card-portrait');
      if (portrait) portrait.appendChild(btn);
    });
  }

  // Inject share button inside modal
  function injectModalShare() {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent || document.getElementById('modal-share-btn')) return;

    const btn  = document.createElement('button');
    btn.id     = 'modal-share-btn';
    btn.innerHTML = '🔗 Copy Link';

    // Place at bottom of modal content
    modalContent.appendChild(btn);

    btn.onclick = () => {
      const name = document.getElementById('m-name')?.textContent;
      if (name) copyLink(name, btn);
    };
  }

  // Watch grid for new cards
  const gridObserver = new MutationObserver(() => { injectShareButtons(); });
  function initShare() {
    const grid = document.getElementById('grid');
    if (grid) {
      gridObserver.observe(grid, { childList: true });
      injectShareButtons();
      injectModalShare();
    } else {
      setTimeout(initShare, 100);
    }
  }
  initShare();

  // Re-inject after modal opens (in case DOM updated)
  const _origOpen = window.openModal;
  window.openModal = function (c) {
    _origOpen(c);
    setTimeout(injectModalShare, 50);
  };
})();
