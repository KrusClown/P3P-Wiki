/* ═══════════════════════════════════════════
   P3P ARCHIVE — cookies.js
   Favorites · Last Filter · Last Section · Consent Banner
═══════════════════════════════════════════ */

/* ── COOKIE UTILITIES ── */
const Cookie = {
  set(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires};path=/;SameSite=Lax`;
  },
  get(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    try { return match ? JSON.parse(decodeURIComponent(match[1])) : null; }
    catch { return null; }
  },
  delete(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
};

/* ── CONSENT GUARD — wrap Cookie.set ── */
(function () {
  const _orig = Cookie.set.bind(Cookie);
  Cookie.set = function (name, value, days) {
    if (name === 'p3p_cookie_consent') { _orig(name, value, days); return; }
    if (Cookie.get('p3p_cookie_consent') !== 'accepted') return;
    _orig(name, value, days);
  };
})();

/* ── FAVORITES ── */
const Favorites = (function () {
  let favs = Cookie.get('p3p_favorites') || [];
  function save() { Cookie.set('p3p_favorites', favs); }
  function isFav(id) { return favs.includes(id); }
  function toggle(id) {
    if (isFav(id)) favs = favs.filter(f => f !== id);
    else favs.push(id);
    save(); updateAllHearts(); updateFavFilter();
    showToast(isFav(id) ? '♥ Added to favorites' : '♡ Removed from favorites');
  }
  function updateAllHearts() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const id = parseInt(btn.dataset.id);
      btn.classList.toggle('active', isFav(id));
      btn.textContent = isFav(id) ? '♥' : '♡';
    });
  }
  function updateFavFilter() {
    const t = document.getElementById('fav-filter-tab');
    if (t) t.style.display = favs.length > 0 ? '' : 'none';
  }
  function applyToGrid() {
    document.querySelectorAll('.char-card').forEach((card, i) => {
      const c = window.CHARS[i]; if (!c || card.querySelector('.fav-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'fav-btn' + (isFav(c.id) ? ' active' : '');
      btn.dataset.id = c.id; btn.textContent = isFav(c.id) ? '♥' : '♡';
      btn.onclick = (e) => { e.stopPropagation(); toggle(c.id); };
      const portrait = card.querySelector('.card-portrait');
      if (portrait) portrait.appendChild(btn);
    });
  }
  function getFavIds() { return [...favs]; }
  return { toggle, isFav, applyToGrid, updateAllHearts, updateFavFilter, getFavIds };
})();

/* ── FILTER MEMORY ── */
const FilterMemory = (function () {
  function saveFilter(f) { Cookie.set('p3p_filter', f, 30); }
  function saveSearch(v) { Cookie.set('p3p_search', v, 30); }
  function restore() {
    const sf = Cookie.get('p3p_filter') || 'all';
    const ss = Cookie.get('p3p_search') || '';
    if (sf && sf !== 'all') {
      const btn = [...document.querySelectorAll('.ftag')].find(b => b.getAttribute('onclick')?.includes(`'${sf}'`));
      if (btn) { document.querySelectorAll('.ftag').forEach(b => b.classList.remove('on')); btn.classList.add('on'); window.currentFilter = sf; document.querySelectorAll('.char-card').forEach((card, i) => { const c = window.CHARS[i]; card.classList.toggle('hidden', c?.filter !== sf); }); }
    }
    if (ss) { const el = document.getElementById('search'); if (el) { el.value = ss; if (typeof window.liveSearch === 'function') window.liveSearch(ss); } }
    if (typeof window.updateCount === 'function') window.updateCount();
  }
  return { saveFilter, saveSearch, restore };
})();

/* ── SECTION MEMORY ── */
const SectionMemory = (function () {
  function save(id) { Cookie.set('p3p_section', id, 30); }
  function restore() {
    const saved = Cookie.get('p3p_section') || 'chars';
    if (saved && saved !== 'chars') {
      const btn = [...document.querySelectorAll('.nav-link')].find(b => b.getAttribute('onclick')?.includes(`'${saved}'`));
      if (btn && typeof window.showSec === 'function') window.showSec(saved, btn);
    }
  }
  return { save, restore };
})();

/* ── TOAST ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #p3p-toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--surface);border:1px solid var(--border2);color:var(--cream);font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:0.12em;padding:10px 24px;z-index:999990;opacity:0;pointer-events:none;transition:opacity 0.3s,transform 0.3s;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.4);}
    #p3p-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
    #p3p-toast.fav{border-color:var(--red2);color:var(--red2);}
    .fav-btn{position:absolute;bottom:12px;right:12px;width:28px;height:28px;background:rgba(10,6,8,0.78);backdrop-filter:blur(8px);border:1px solid var(--border2);color:var(--muted2);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.25s;z-index:10;line-height:1;}
    .fav-btn:hover{border-color:var(--red2);color:var(--red2);transform:scale(1.15);}
    .fav-btn.active{border-color:var(--red);color:var(--red2);background:rgba(232,64,96,0.15);box-shadow:0 0 12px rgba(232,64,96,0.3);}
    #fav-filter-tab{border-color:rgba(232,64,96,0.5)!important;color:var(--red2)!important;}
    #fav-filter-tab.on{background:rgba(232,64,96,0.12)!important;}
  `;
  document.head.appendChild(style);
})();

let toastTimer = null;
function showToast(msg, type = 'fav') {
  let toast = document.getElementById('p3p-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'p3p-toast'; document.body.appendChild(toast); }
  toast.textContent = msg; toast.className = `show ${type}`;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.className = ''; }, 2200);
}

/* ── FAV FILTER TAB ── */
function injectFavTab() {
  const fg = document.querySelector('.filter-group');
  if (!fg || document.getElementById('fav-filter-tab')) return;
  const btn = document.createElement('button');
  btn.id = 'fav-filter-tab'; btn.className = 'ftag';
  btn.textContent = '♥ Favorites';
  btn.style.display = Favorites.getFavIds().length > 0 ? '' : 'none';
  btn.onclick = () => {
    const favIds = Favorites.getFavIds();
    document.querySelectorAll('.ftag').forEach(b => b.classList.remove('on')); btn.classList.add('on');
    window.currentFilter = 'favorites';
    document.querySelectorAll('.char-card').forEach((card, i) => { card.classList.toggle('hidden', !favIds.includes(window.CHARS[i]?.id)); });
    if (typeof window.updateCount === 'function') window.updateCount();
    FilterMemory.saveFilter('favorites');
  };
  fg.appendChild(btn);
}

/* ── HOOKS ── */
function hookIntoExisting() {
  const _setF = window.setF;
  window.setF = function (f, btn) { _setF(f, btn); FilterMemory.saveFilter(f); };
  const _search = window.liveSearch;
  window.liveSearch = function (v) { _search(v); FilterMemory.saveSearch(v); };
  // showSec is NOT hooked here — script.js already calls SectionMemory.save internally
  const _buildGrid = window.buildGrid;
  window.buildGrid = function () { _buildGrid(); setTimeout(() => { Favorites.applyToGrid(); injectFavTab(); }, 50); };
}

/* ── COOKIE CONSENT BANNER ── */
(function () {
  const CONSENT_KEY = 'p3p_cookie_consent';
  const existing = Cookie.get(CONSENT_KEY);
  if (existing === 'accepted' || existing === 'declined') return;

  const bannerStyle = document.createElement('style');
  bannerStyle.textContent = `
    #cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:999995;background:var(--surface);border-top:1px solid var(--border2);padding:24px 48px;transform:translateY(100%);transition:transform 0.5s cubic-bezier(0.16,1,0.3,1);box-shadow:0 -8px 48px rgba(0,0,0,0.5);}
    #cookie-banner.visible{transform:translateY(0);}
    #cookie-banner::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--red),transparent);}
    #cookie-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
    #cookie-icon{font-size:2rem;flex-shrink:0;filter:drop-shadow(0 0 8px rgba(232,64,96,0.4));animation:pulse 3s ease-in-out infinite;}
    #cookie-text{flex:1;min-width:260px;display:flex;flex-direction:column;gap:6px;}
    #cookie-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--cream);}
    #cookie-desc{font-size:12px;line-height:1.75;color:var(--muted2);max-width:600px;}
    #cookie-actions{display:flex;align-items:center;gap:12px;flex-shrink:0;flex-wrap:wrap;}
    #cookie-accept{padding:11px 32px;background:var(--red);color:#fff;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;border:none;font-family:'DM Sans',sans-serif;font-weight:500;transition:all 0.28s;}
    #cookie-accept:hover{background:var(--red2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,64,96,0.4);}
    #cookie-decline{padding:11px 28px;background:transparent;color:var(--muted2);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;border:1px solid var(--border);font-family:'DM Sans',sans-serif;font-weight:300;transition:all 0.28s;}
    #cookie-decline:hover{border-color:var(--muted2);color:var(--cream);}
    #cookie-more{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);text-decoration:none;transition:color 0.25s;border-bottom:1px solid transparent;}
    #cookie-more:hover{color:var(--cream);border-bottom-color:var(--muted);}
    #cookie-detail{display:none;background:var(--card-bg);border-top:1px solid var(--border);padding:20px 48px;}
    #cookie-detail.open{display:block;}
    .cookie-detail-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;}
    .cookie-item{padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-left:2px solid var(--red);}
    .cookie-item-name{display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:var(--red2);margin-bottom:4px;}
    .cookie-item-desc{display:block;font-size:11px;line-height:1.6;color:var(--muted2);}
    .cookie-item-exp{display:block;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(--muted);margin-top:4px;}
    @media(max-width:768px){#cookie-banner,#cookie-detail{padding:20px 24px;}#cookie-actions{width:100%;}}
  `;
  document.head.appendChild(bannerStyle);

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div id="cookie-inner">
      <div id="cookie-icon">🎴</div>
      <div id="cookie-text">
        <div id="cookie-title">The Dark Hour uses Cookies</div>
        <p id="cookie-desc">This archive saves your favorite characters, last visited section, and active filters — so everything is exactly as you left it. No tracking, no ads, no third parties.</p>
      </div>
      <div id="cookie-actions">
        <button id="cookie-accept">Accept All</button>
        <button id="cookie-decline">Decline</button>
        <a id="cookie-more" href="#">Learn more</a>
      </div>
    </div>`;
  document.body.appendChild(banner);

  const details = [
    { name:'p3p_favorites',     desc:'Stores your favorited characters.',             exp:'365 days' },
    { name:'p3p_filter',        desc:'Remembers last active filter tab.',             exp:'30 days' },
    { name:'p3p_search',        desc:'Saves your last search term.',                  exp:'30 days' },
    { name:'p3p_section',       desc:'Remembers last open section.',                  exp:'30 days' },
    { name:'p3p_cookie_consent',desc:'Saves your cookie preference.',                 exp:'365 days' },
  ];
  const detailPanel = document.createElement('div');
  detailPanel.id = 'cookie-detail';
  detailPanel.innerHTML = `<div class="cookie-detail-inner">${details.map(d=>`<div class="cookie-item"><span class="cookie-item-name">${d.name}</span><span class="cookie-item-desc">${d.desc}</span><span class="cookie-item-exp">Expires: ${d.exp}</span></div>`).join('')}</div>`;
  banner.after(detailPanel);

  setTimeout(() => banner.classList.add('visible'), 1200);

  let detailOpen = false;
  document.getElementById('cookie-more').addEventListener('click', (e) => {
    e.preventDefault(); detailOpen = !detailOpen;
    detailPanel.classList.toggle('open', detailOpen);
    document.getElementById('cookie-more').textContent = detailOpen ? 'Show less' : 'Learn more';
  });

  function hideBanner() {
    banner.style.transform = 'translateY(100%)';
    detailPanel.classList.remove('open');
    setTimeout(() => { banner.remove(); detailPanel.remove(); bannerStyle.remove(); }, 600);
  }

  document.getElementById('cookie-accept').addEventListener('click', () => {
    Cookie.set(CONSENT_KEY, 'accepted', 365);
    window.cookiesEnabled = true;
    hideBanner(); showToast('✓ Cookies accepted — preferences will be saved');
  });

  document.getElementById('cookie-decline').addEventListener('click', () => {
    Cookie.set(CONSENT_KEY, 'declined', 365);
    window.cookiesEnabled = false;
    ['p3p_favorites','p3p_filter','p3p_search','p3p_section'].forEach(k => Cookie.delete(k));
    hideBanner(); showToast("Cookies declined — preferences won't be saved");
  });
})();

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  hookIntoExisting();
  setTimeout(() => {
    SectionMemory.restore();
    FilterMemory.restore();
    Favorites.applyToGrid();
    injectFavTab();
  }, 150);
});
