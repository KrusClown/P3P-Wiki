/* ═══════════════════════════════════════════
   P3P ARCHIVE — js/api.js
   Frontend connector to the FastAPI backend.
   Handles photo uploads + loading saved photos.
   Falls back to sessionStorage if API is offline.
═══════════════════════════════════════════ */

const API = (function () {
  const BASE    = 'http://localhost:8000';
  let _online   = null;

  /* ── Check if backend is alive ── */
  async function isOnline() {
    if (_online !== null) return _online;
    try {
      const res = await fetch(`${BASE}/`, {
        signal: AbortSignal.timeout(1500)
      });
      _online = res.ok;
    } catch {
      _online = false;
    }
    if (!_online) {
      console.warn('[API] Backend offline — using sessionStorage fallback');
    }
    return _online;
  }

  /* ── Upload photo — API first, session fallback ── */
  async function uploadPhoto(charId, file) {
    if (!(await isOnline())) return _sessionUpload(charId, file);

    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch(`${BASE}/api/characters/${charId}/photo`, {
        method: 'POST', body: form
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      return { ok: true, url: `${BASE}${data.url}`, source: 'api' };
    } catch (err) {
      console.warn('[API] Upload failed, using session fallback:', err.message);
      return _sessionUpload(charId, file);
    }
  }

  /* ── sessionStorage fallback ── */
  function _sessionUpload(charId, file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        try { sessionStorage.setItem(`p3p_img_${charId}`, e.target.result); } catch {}
        resolve({ ok: true, url: e.target.result, source: 'session' });
      };
      reader.readAsDataURL(file);
    });
  }

  /* ── Get photo URL for a character ── */
  async function getPhoto(charId) {
    if (!(await isOnline())) {
      return sessionStorage.getItem(`p3p_img_${charId}`) || null;
    }
    try {
      const res  = await fetch(`${BASE}/api/characters/${charId}/photo`);
      const data = await res.json();
      if (data.url && data.type === 'custom') return `${BASE}${data.url}`;
      return null;
    } catch {
      return null;
    }
  }

  /* ── Fetch all characters from DB ── */
  async function getCharacters() {
    if (!(await isOnline())) return null;
    try {
      const res = await fetch(`${BASE}/api/characters`);
      return await res.json();
    } catch {
      return null;
    }
  }

  /* ── Delete custom photo ── */
  async function deletePhoto(charId) {
    if (!(await isOnline())) {
      sessionStorage.removeItem(`p3p_img_${charId}`);
      return true;
    }
    try {
      const res = await fetch(`${BASE}/api/characters/${charId}/photo`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /* ── Show a brief status indicator ── */
  async function showStatus() {
    const online = await isOnline();
    const el     = document.createElement('div');
    el.id        = 'api-status-badge';
    el.style.cssText = `
      position:fixed; bottom:20px; right:20px; z-index:99999;
      padding:5px 14px; font-family:'DM Sans',sans-serif;
      font-size:9px; letter-spacing:0.2em; text-transform:uppercase;
      border:1px solid; backdrop-filter:blur(10px);
      background:rgba(10,6,8,0.88); pointer-events:none;
      transition:opacity 0.6s ease;
    `;
    if (online) {
      el.style.borderColor = 'rgba(80,200,160,0.5)';
      el.style.color       = '#50c8a0';
      el.textContent       = '● API Connected';
    } else {
      el.style.borderColor = 'rgba(232,64,96,0.4)';
      el.style.color       = 'var(--red2,#ff6b85)';
      el.textContent       = '○ API Offline — Session Mode';
    }
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; }, 3500);
    setTimeout(() => { el.remove(); }, 4200);
  }

  return { uploadPhoto, getPhoto, getCharacters, deletePhoto, isOnline, showStatus };
})();


/* ═══════════════════════════════════════════
   HOOK INTO EXISTING UPLOAD HANDLERS
   API-first upload with sessionStorage fallback
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await API.showStatus();

  /* ── Override handleUpload (card button) ── */
  window.handleUpload = async function (id, input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (typeof showToast !== 'undefined') showToast('Please select an image file');
      return;
    }

    if (typeof showToast !== 'undefined') showToast('Uploading...');
    const result = await API.uploadPhoto(id, file);

    if (result.ok) {
      // Update every card for this character
      document.querySelectorAll('.char-card').forEach((card, i) => {
        if (window.CHARS?.[i]?.id !== id) return;
        let img = card.querySelector('.portrait-img');
        const ph  = card.querySelector('.portrait-placeholder');
        if (!img) {
          img = document.createElement('img');
          img.className = 'portrait-img';
          img.alt = window.CHARS[i].name;
          card.querySelector('.card-portrait').appendChild(img);
        }
        img.src = result.url;
        img.style.opacity = '1';
        if (ph) ph.style.display = 'none';
        card.classList.remove('empty-slot');
        const btn = card.querySelector('.upload-btn');
        if (btn) btn.classList.remove('upload-btn-visible');
      });

      // Update modal if open for same character
      const mName = document.getElementById('m-name');
      const mImg  = document.getElementById('m-img');
      const char  = window.CHARS?.find(c => c.id === id);
      if (mImg && mName && char && mName.textContent === char.name) {
        mImg.src = result.url;
      }

      const label = result.source === 'api' ? '✓ Saved permanently' : '✓ Saved (session only)';
      if (typeof showToast !== 'undefined') showToast(label);
    } else {
      if (typeof showToast !== 'undefined') showToast('Upload failed — try again');
    }

    input.value = '';
  };

  /* ── Override handleModalUpload ── */
  window.handleModalUpload = async function (input) {
    const file = input.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const name = document.getElementById('m-name')?.textContent;
    const char = window.CHARS?.find(c => c.name === name);
    if (!char) return;
    await window.handleUpload(char.id, input);
    input.value = '';
  };

  /* ── On load: restore saved photos from API ── */
  const chars = await API.getCharacters();
  if (chars && Array.isArray(chars)) {
    chars.forEach(apiChar => {
      if (!apiChar.custom_img) return;
      const url = `http://localhost:8000/uploads/${apiChar.custom_img}`;
      document.querySelectorAll('.char-card').forEach((card, i) => {
        if (window.CHARS?.[i]?.id !== apiChar.id) return;
        let img = card.querySelector('.portrait-img');
        const ph  = card.querySelector('.portrait-placeholder');
        if (!img) {
          img = document.createElement('img');
          img.className = 'portrait-img';
          img.alt = apiChar.name;
          card.querySelector('.card-portrait')?.appendChild(img);
        }
        img.src = url;
        img.style.opacity = '1';
        if (ph) ph.style.display = 'none';
        card.classList.remove('empty-slot');
      });
    });
  }
});
