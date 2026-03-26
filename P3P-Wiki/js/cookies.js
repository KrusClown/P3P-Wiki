/* ═══════════════════════════════════════════
   P3P ARCHIVE — cookies.js
   Favorites · Last Filter · Last Section
═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   COOKIE UTILITIES
────────────────────────────────────────── */
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


/* ──────────────────────────────────────────
   1. FAVORITE CHARACTERS
   Saves array of character IDs in cookie.
   Adds a heart button to every card.
────────────────────────────────────────── */
const Favorites = (function () {
  let favs = Cookie.get('p3p_favorites') || [];

  function save() {
    Cookie.set('p3p_favorites', favs);
  }

  function isFav(id) {
    return favs.includes(id);
  }

  function toggle(id) {
    if (isFav(id)) {
      favs = favs.filter(f => f !== id);
    } else {
      favs.push(id);
    }
    save();
    updateAllHearts();
    updateFavFilter();
    showToast(isFav(id) ? '♥ Added to favorites' : '♡ Removed from favorites');
  }

  function updateAllHearts() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const id = parseInt(btn.dataset.id);
      btn.classList.toggle('active', isFav(id));
      btn.title = isFav(id) ? 'Remove from favorites' : 'Add to favorites';
      btn.textContent = isFav(id) ? '♥' : '♡';
    });
  }

  function updateFavFilter() {
    // Show/hide the Favorites filter tab based on whether any favs exist
    const favTab = document.getElementById('fav-filter-tab');
    if (favTab) favTab.style.display = favs.length > 0 ? '' : 'none';
  }

  function applyToGrid() {
    // Called after buildGrid() — injects heart buttons into each card
    document.querySelectorAll('.char-card').forEach((card, i) => {
      const c   = window.CHARS[i];
      if (!c) return;

      // Avoid duplicating buttons
      if (card.querySelector('.fav-btn')) return;

      const btn = document.createElement('button');
      btn.className   = 'fav-btn' + (isFav(c.id) ? ' active' : '');
      btn.dataset.id  = c.id;
      btn.title       = isFav(c.id) ? 'Remove from favorites' : 'Add to favorites';
      btn.textContent = isFav(c.id) ? '♥' : '♡';
      btn.onclick = (e) => {
        e.stopPropagation(); // don't open modal
        toggle(c.id);
      };

      // Insert inside portrait area top-right (below route badge)
      const portrait = card.querySelector('.card-portrait');
      if (portrait) portrait.appendChild(btn);
    });
  }

  function getFavIds() { return [...favs]; }

  return { toggle, isFav, applyToGrid, updateAllHearts, updateFavFilter, getFavIds };
})();


/* ──────────────────────────────────────────
   2. LAST ACTIVE FILTER & SEARCH
   Restores filter tab and search term on load.
────────────────────────────────────────── */
const FilterMemory = (function () {
  const FILTER_KEY = 'p3p_filter';
  const SEARCH_KEY = 'p3p_search';

  function saveFilter(f) { Cookie.set(FILTER_KEY, f, 30); }
  function saveSearch(v) { Cookie.set(SEARCH_KEY, v, 30); }

  function restore() {
    const savedFilter = Cookie.get(FILTER_KEY) || 'all';
    const savedSearch = Cookie.get(SEARCH_KEY) || '';

    // Restore filter tab
    if (savedFilter && savedFilter !== 'all') {
      // Find matching filter button and click it
      const btn = [...document.querySelectorAll('.ftag')]
        .find(b => b.getAttribute('onclick')?.includes(`'${savedFilter}'`));
      if (btn) {
        document.querySelectorAll('.ftag').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        window.currentFilter = savedFilter;

        // Apply filter to cards
        document.querySelectorAll('.char-card').forEach((card, i) => {
          const c    = window.CHARS[i];
          const show = savedFilter === 'all' || c?.filter === savedFilter;
          card.classList.toggle('hidden', !show);
        });
      }
    }

    // Restore search
    if (savedSearch) {
      const searchEl = document.getElementById('search');
      if (searchEl) {
        searchEl.value = savedSearch;
        if (typeof window.liveSearch === 'function') {
          window.liveSearch(savedSearch);
        }
      }
    }

    if (typeof window.updateCount === 'function') window.updateCount();
  }

  return { saveFilter, saveSearch, restore };
})();


/* ──────────────────────────────────────────
   3. LAST ACTIVE SECTION
   Remembers which tab was open (chars/about/classes).
────────────────────────────────────────── */
const SectionMemory = (function () {
  const KEY = 'p3p_section';

  function save(id) { Cookie.set(KEY, id, 30); }

  function restore() {
    const saved = Cookie.get(KEY) || 'chars';
    if (saved && saved !== 'chars') {
      // Find the matching nav button
      const btn = [...document.querySelectorAll('.nav-link')]
        .find(b => b.getAttribute('onclick')?.includes(`'${saved}'`));
      if (btn && typeof window.showSec === 'function') {
        window.showSec(saved, btn);
      }
    }
  }

  return { save, restore };
})();


/* ──────────────────────────────────────────
   TOAST NOTIFICATION
   Small popup feedback for user actions
────────────────────────────────────────── */
(function injectToastStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #p3p-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--surface);
      border: 1px solid var(--border2);
      color: var(--cream);
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      letter-spacing: 0.12em;
      padding: 10px 24px;
      z-index: 999990;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      white-space: nowrap;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    #p3p-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    #p3p-toast.fav {
      border-color: var(--red2);
      color: var(--red2);
    }

    /* ── FAV BUTTON on card ── */
    .fav-btn {
      position: absolute;
      bottom: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      background: rgba(10,6,8,0.78);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border2);
      color: var(--muted2);
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s;
      z-index: 10;
      line-height: 1;
    }
    .fav-btn:hover {
      border-color: var(--red2);
      color: var(--red2);
      transform: scale(1.15);
    }
    .fav-btn.active {
      border-color: var(--red);
      color: var(--red2);
      background: rgba(232,64,96,0.15);
      box-shadow: 0 0 12px rgba(232,64,96,0.3);
    }

    /* ── FAV FILTER TAG ── */
    #fav-filter-tab {
      border-color: rgba(232,64,96,0.5) !important;
      color: var(--red2) !important;
    }
    #fav-filter-tab.on {
      background: rgba(232,64,96,0.12) !important;
    }
  `;
  document.head.appendChild(style);
})();

let toastTimer = null;
function showToast(msg, type = 'fav') {
  let toast = document.getElementById('p3p-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'p3p-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className   = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 2200);
}


/* ──────────────────────────────────────────
   FAVORITES FILTER TAB
   Adds a "Favorites" button to the filter row
────────────────────────────────────────── */
function injectFavTab() {
  const filterGroup = document.querySelector('.filter-group');
  if (!filterGroup || document.getElementById('fav-filter-tab')) return;

  const btn = document.createElement('button');
  btn.id        = 'fav-filter-tab';
  btn.className = 'ftag';
  btn.textContent = '♥ Favorites';
  btn.style.display = Favorites.getFavIds().length > 0 ? '' : 'none';

  btn.onclick = () => {
    const favIds = Favorites.getFavIds();
    document.querySelectorAll('.ftag').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    window.currentFilter = 'favorites';

    document.querySelectorAll('.char-card').forEach((card, i) => {
      const c = window.CHARS[i];
      card.classList.toggle('hidden', !favIds.includes(c?.id));
    });

    if (typeof window.updateCount === 'function') window.updateCount();
    FilterMemory.saveFilter('favorites');
  };

  filterGroup.appendChild(btn);
}


/* ──────────────────────────────────────────
   HOOK INTO EXISTING FUNCTIONS
   Intercept filter, search, and section changes
   to save state automatically
────────────────────────────────────────── */
function hookIntoExisting() {

  // ── Hook setF (filter changes) ──
  const _origSetF = window.setF;
  window.setF = function (f, btn) {
    _origSetF(f, btn);
    FilterMemory.saveFilter(f);
  };

  // ── Hook liveSearch ──
  const _origSearch = window.liveSearch;
  window.liveSearch = function (v) {
    _origSearch(v);
    FilterMemory.saveSearch(v);
  };

  // ── Hook showSec (section changes) ──
  const _origShowSec = window.showSec;
  window.showSec = function (id, btn) {
    _origShowSec(id, btn);
    SectionMemory.save(id);
  };

  // ── Hook buildGrid to inject fav buttons after render ──
  const _origBuildGrid = window.buildGrid;
  window.buildGrid = function () {
    _origBuildGrid();
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      Favorites.applyToGrid();
      injectFavTab();
    }, 50);
  };
}


/* ──────────────────────────────────────────
   INIT — runs after page is ready
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  hookIntoExisting();

  // Restore saved state
  setTimeout(() => {
    SectionMemory.restore();
    FilterMemory.restore();
    Favorites.applyToGrid();
    injectFavTab();
  }, 100);
});

/* ──────────────────────────────────────────
   COOKIE CONSENT BANNER
   Shows on first visit, remembers choice
────────────────────────────────────────── */
(function () {
  const CONSENT_KEY = 'p3p_cookie_consent';

  // Check if user already made a choice
  const existing = Cookie.get(CONSENT_KEY);
  if (existing === 'accepted' || existing === 'declined') return;

  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  const decline= document.getElementById('cookie-decline');
  const more   = document.getElementById('cookie-more');

  if (!banner) return;

  // Cookie detail items — what each cookie stores
  const details = [
    { name: 'p3p_favorites',  desc: 'Stores your favorited characters so they persist across visits.', exp: 'Expires in 365 days' },
    { name: 'p3p_filter',     desc: 'Remembers which filter tab was last active (All, Story, FeMC…).', exp: 'Expires in 30 days' },
    { name: 'p3p_search',     desc: 'Saves your last search term so results are restored on return.', exp: 'Expires in 30 days' },
    { name: 'p3p_section',    desc: 'Remembers which section was open — Characters, About or Class Guide.', exp: 'Expires in 30 days' },
    { name: 'p3p_cookie_consent', desc: 'Saves whether you accepted or declined cookies on this visit.', exp: 'Expires in 365 days' },
  ];

  // Inject detail panel after banner
  const detailPanel = document.createElement('div');
  detailPanel.id = 'cookie-detail';
  detailPanel.innerHTML = `
    <div class="cookie-detail-inner">
      ${details.map(d => `
        <div class="cookie-item">
          <span class="cookie-item-name">${d.name}</span>
          <span class="cookie-item-desc">${d.desc}</span>
          <span class="cookie-item-exp">${d.exp}</span>
        </div>`).join('')}
    </div>`;
  banner.after(detailPanel);

  // Show banner with slight delay after preloader
  setTimeout(() => {
    banner.classList.add('visible');
  }, 1200);

  // ── Learn more toggle ──
  let detailOpen = false;
  more.addEventListener('click', () => {
    detailOpen = !detailOpen;
    detailPanel.classList.toggle('open', detailOpen);
    more.textContent = detailOpen ? 'Show less' : 'Learn more';
  });

  // ── Accept ──
  accept.addEventListener('click', () => {
    Cookie.set(CONSENT_KEY, 'accepted', 365);
    hideBanner();
    showToast('✓ Cookies accepted — preferences will be saved');

    // Enable all cookie features
    window.cookiesEnabled = true;
    console.log('[P3P] Cookies accepted');
  });

  // ── Decline ──
  decline.addEventListener('click', () => {
    Cookie.set(CONSENT_KEY, 'declined', 365);
    hideBanner();
    showToast('Cookies declined — preferences won\'t be saved');

    // Disable cookie saving — clear any existing
    window.cookiesEnabled = false;
    Cookie.delete('p3p_favorites');
    Cookie.delete('p3p_filter');
    Cookie.delete('p3p_search');
    Cookie.delete('p3p_section');
    console.log('[P3P] Cookies declined — data cleared');
  });

  function hideBanner() {
    banner.style.transform = 'translateY(100%)';
    detailPanel.classList.remove('open');
    setTimeout(() => {
      banner.remove();
      detailPanel.remove();
    }, 600);
  }
})();


/* ──────────────────────────────────────────
   GUARD — only save cookies if accepted
   Wraps Cookie.set to respect user choice
────────────────────────────────────────── */
(function () {
  const _origSet = Cookie.set.bind(Cookie);
  Cookie.set = function (name, value, days) {
    // Always allow consent cookie itself
    if (name === 'p3p_cookie_consent') {
      _origSet(name, value, days);
      return;
    }
    // Block all others if declined or not yet decided
    const consent = Cookie.get('p3p_cookie_consent');
    if (consent !== 'accepted') return;
    _origSet(name, value, days);
  };
})();