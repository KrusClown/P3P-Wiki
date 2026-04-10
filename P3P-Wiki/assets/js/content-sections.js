/* ═══════════════════════════════════════════
   P3P ARCHIVE — content-sections.js
   13. Tartarus Floor Guide
   16. Party Builder
   All Characters — Full Dossier
═══════════════════════════════════════════ */


/* ──────────────────────────────────────────
   SECTION VISIBILITY — extend showSec
────────────────────────────────────────── */
/* ── section init handled by script.js showSec ── */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure chars-content stays visible on load
  const charsEl = document.getElementById('chars-content');
  if (charsEl && !charsEl.classList.contains('visible')) {
    charsEl.classList.add('visible');
  }
});


/* ═══════════════════════════════════════════
   13. TARTARUS FLOOR GUIDE
═══════════════════════════════════════════ */
const TARTARUS_DATA = [
  {
    block: 'Thebel',
    floors: '1–16',
    color: '#7ab8e8',
    deadline: 'April 9',
    recLevel: '5–10',
    boss: { name: 'Arcane Turret', floor: 16, weakness: 'Wind', resist: 'Elec', reward: 'Arcane Piece' },
    barriers: [8],
    safeRooms: [6, 12],
    keyItem: { floor: 7, name: 'Old Document' },
    shadows: ['Slaughter Drive','Trance Twins','Shaking Tiara'],
    tip: 'Start here in late April after unlocking Tartarus. Focus on grinding to level 8–10 before the first barrier. The boss is weak to Wind — bring Yukari.'
  },
  {
    block: 'Arqa',
    floors: '17–63',
    color: '#d484e8',
    deadline: 'June 9',
    recLevel: '11–25',
    boss: { name: 'Crying Table', floor: 63, weakness: 'Fire', resist: 'Ice', reward: 'Crying Piece' },
    barriers: [25, 38, 51],
    safeRooms: [20, 32, 45, 58],
    keyItem: { floor: 35, name: 'Old Documents x2' },
    shadows: ['Venus Eagle','Haughty Maya','Hell Knight'],
    tip: 'Longest early block. Multiple barriers require revisiting. Junpei\'s Fire is essential against the boss. Stock up on Dis-Charms before the upper floors.'
  },
  {
    block: 'Yabbashah',
    floors: '64–114',
    color: '#50c8a0',
    deadline: 'August 9',
    recLevel: '26–40',
    boss: { name: 'Rampage Drive', floor: 114, weakness: 'Ice', resist: 'Fire', reward: 'Rampage Piece' },
    barriers: [75, 90, 102],
    safeRooms: [68, 80, 95, 108],
    keyItem: { floor: 80, name: 'Hidden Memos' },
    shadows: ['Arrogant Maya','Stasis Giant','Natural Dancer'],
    tip: 'Shadows start using Status ailments frequently. Equip accessories that resist Sleep and Panic. Mitsuru\'s Ice and Akihiko\'s Electric coverage shine here.'
  },
  {
    block: 'Tziah',
    floors: '115–164',
    color: '#f0c86e',
    deadline: 'October 4',
    recLevel: '41–55',
    boss: { name: 'Fanatic Tower', floor: 164, weakness: 'Elec', resist: 'Pierce', reward: 'Fanatic Piece' },
    barriers: [125, 140, 155],
    safeRooms: [118, 132, 148, 160],
    keyItem: { floor: 135, name: 'Concealed Memos' },
    shadows: ['Reckless Maya','Sleeping Table','Elegant Mother'],
    tip: 'Highly recommended to reach this block before Shinjiro\'s deadline (Oct 4). Akihiko\'s Ziodyne is the key weapon against Fanatic Tower. Grind to 50+ before the boss.'
  },
  {
    block: 'Harabah',
    floors: '165–214',
    color: '#ff6b85',
    deadline: 'December 2',
    recLevel: '56–70',
    boss: { name: 'Stasis Giant', floor: 214, weakness: 'Wind', resist: 'Dark', reward: 'Stasis Piece' },
    barriers: [175, 190, 205],
    safeRooms: [168, 182, 198, 210],
    keyItem: { floor: 185, name: 'Encoded Memos' },
    shadows: ['Mythical Gigas','Jotun of Grief','World Balance'],
    tip: 'Aigis becomes your most important party member in this block — her balanced stats and Orgia Mode help with the increasingly difficult shadows. Stock many Medicines.'
  },
  {
    block: 'Adamah',
    floors: '215–254',
    color: '#e84060',
    deadline: 'January 31',
    recLevel: '71–90',
    boss: { name: 'Immortal Gigas', floor: 254, weakness: 'None', resist: 'Physical', reward: 'Final Piece' },
    barriers: [225, 240],
    safeRooms: [220, 235, 248],
    keyItem: { floor: 230, name: 'Final Memos' },
    shadows: ['Jotun of Blood','Momentous Gigas','Fierce Cyclops'],
    tip: 'Final block before the endgame. All party members should be level 75+. The Immortal Gigas boss has no elemental weakness — rely on Almighty skills and full buffs. Bring Aigis and Akihiko.'
  }
];

function initTartarus() {
  const container = document.getElementById('tartarus-blocks');
  if (!container) return;

  container.innerHTML = TARTARUS_DATA.map((block, bi) => `
    <div class="tartarus-block" style="--block-color:${block.color}" onclick="toggleTartarusBlock(${bi})">
      <div class="tb-header">
        <div class="tb-left">
          <div class="tb-color-bar"></div>
          <div class="tb-info">
            <div class="tb-name">${block.block}</div>
            <div class="tb-floors">Floors ${block.floors}</div>
          </div>
        </div>
        <div class="tb-right">
          <div class="tb-meta-item"><span class="tb-meta-l">Deadline</span><span class="tb-meta-v">${block.deadline}</span></div>
          <div class="tb-meta-item"><span class="tb-meta-l">Rec. Level</span><span class="tb-meta-v">${block.recLevel}</span></div>
          <div class="tb-meta-item"><span class="tb-meta-l">Boss Floor</span><span class="tb-meta-v">${block.boss.floor}</span></div>
          <div class="tb-chevron">▼</div>
        </div>
      </div>
      <div class="tb-body" id="tb-body-${bi}">
        <div class="tb-body-inner">

          <div class="tb-boss-card">
            <div class="tb-section-label">Boss</div>
            <div class="tb-boss-name">${block.boss.name}</div>
            <div class="tb-boss-meta">
              <span class="tb-boss-tag tb-weak">Weak: ${block.boss.weakness}</span>
              <span class="tb-boss-tag tb-resist">Resist: ${block.boss.resist}</span>
              <span class="tb-boss-tag tb-reward">Reward: ${block.boss.reward}</span>
            </div>
          </div>

          <div class="tb-floor-map">
            <div class="tb-section-label">Floor Map</div>
            <div class="tb-map-items">
              ${block.barriers.map(f => `<div class="tb-map-item tb-barrier"><span class="tb-map-icon">⚔</span><span>Floor ${f} — Barrier</span></div>`).join('')}
              ${block.safeRooms.map(f => `<div class="tb-map-item tb-safe"><span class="tb-map-icon">🛡</span><span>Floor ${f} — Safe Room</span></div>`).join('')}
              <div class="tb-map-item tb-key"><span class="tb-map-icon">🔑</span><span>Floor ${block.keyItem.floor} — ${block.keyItem.name}</span></div>
              <div class="tb-map-item tb-boss-floor"><span class="tb-map-icon">💀</span><span>Floor ${block.boss.floor} — Boss: ${block.boss.name}</span></div>
            </div>
          </div>

          <div class="tb-shadows-tip">
            <div class="tb-two-col">
              <div>
                <div class="tb-section-label">Common Shadows</div>
                <div class="tb-shadows-list">${block.shadows.map(s => `<span class="tb-shadow-tag">${s}</span>`).join('')}</div>
              </div>
              <div>
                <div class="tb-section-label">Strategy Tip</div>
                <p class="tb-tip-text">${block.tip}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `).join('');
}

window.toggleTartarusBlock = function (index) {
  const body    = document.getElementById(`tb-body-${index}`);
  const header  = body.previousElementSibling;
  const chevron = header.querySelector('.tb-chevron');
  const isOpen  = body.classList.toggle('open');
  chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
};


/* ═══════════════════════════════════════════
   16. PARTY BUILDER
═══════════════════════════════════════════ */
const PARTY_ELEMENTS = {
  1:  { name:'Male Protagonist',   elements:['Elec','Dark','Light','Almighty'], icon:'M'  },
  2:  { name:'Female Protagonist', elements:['Elec','Dark','Light','Almighty'], icon:'F'  },
  3:  { name:'Yukari',             elements:['Wind','Healing'],                 icon:'YK' },
  4:  { name:'Junpei',             elements:['Fire','Slash'],                   icon:'JP' },
  5:  { name:'Akihiko',            elements:['Elec','Strike'],                  icon:'AK' },
  6:  { name:'Mitsuru',            elements:['Ice','Status'],                   icon:'MK' },
  7:  { name:'Fuuka',              elements:['Support','Healing','Analysis'],   icon:'FK' },
  8:  { name:'Ken',                elements:['Light','Almighty','Pierce'],      icon:'KA' },
  9:  { name:'Koromaru',           elements:['Dark','Fire'],                    icon:'KO' },
  10: { name:'Shinjiro',           elements:['Strike'],                         icon:'SK' },
  11: { name:'Aigis',              elements:['Almighty','Slash','Fire'],        icon:'AI' },
};

const ALL_ELEMENTS = ['Fire','Ice','Elec','Wind','Dark','Light','Healing','Strike','Slash','Pierce','Almighty','Support','Status','Analysis'];
let partySlots = [null, null, null];

function initParty() {
  const roster = document.getElementById('party-roster');
  if (!roster) return;

  const playable = Object.entries(PARTY_ELEMENTS).filter(([id]) => ![1,2].includes(parseInt(id)));

  roster.innerHTML = playable.map(([id, data]) => `
    <div class="roster-member" id="roster-${id}" onclick="addToParty(${id})">
      <div class="roster-avatar">${data.icon}</div>
      <div class="roster-name">${data.name}</div>
      <div class="roster-elements">${data.elements.slice(0,2).map(e => `<span class="elem-tag">${e}</span>`).join('')}</div>
    </div>
  `).join('');

  renderPartySlots();
}

window.addToParty = function (id) {
  id = parseInt(id);
  if (partySlots.includes(id)) {
    partySlots = partySlots.map(s => s === id ? null : s);
  } else {
    const empty = partySlots.indexOf(null);
    if (empty === -1) { if (typeof showToast !== 'undefined') showToast('Party is full — remove a member first'); return; }
    partySlots[empty] = id;
  }
  renderPartySlots();
  renderAnalysis();
  updateRosterHighlights();
};

window.clearParty = function () {
  partySlots = [null, null, null];
  renderPartySlots();
  renderAnalysis();
  updateRosterHighlights();
};

function renderPartySlots() {
  partySlots.forEach((memberId, i) => {
    const slot = document.querySelector(`.party-slot[data-slot="${i}"]`);
    if (!slot) return;
    if (memberId === null) {
      slot.className = 'party-slot empty';
      slot.innerHTML = `<div class="slot-num">${i+1}</div><div class="slot-label">Select Member</div>`;
    } else {
      const data = PARTY_ELEMENTS[memberId];
      slot.className = 'party-slot filled';
      slot.innerHTML = `
        <div class="slot-avatar">${data.icon}</div>
        <div class="slot-name">${data.name}</div>
        <div class="slot-elements">${data.elements.map(e=>`<span class="elem-tag">${e}</span>`).join('')}</div>
        <button class="slot-remove" onclick="event.stopPropagation();addToParty(${memberId})">✕</button>`;
    }
  });
}

function updateRosterHighlights() {
  document.querySelectorAll('.roster-member').forEach(el => {
    const id = parseInt(el.id.replace('roster-',''));
    el.classList.toggle('in-party', partySlots.includes(id));
  });
}

function renderAnalysis() {
  const container = document.getElementById('party-analysis');
  if (!container) return;

  const active = partySlots.filter(Boolean);
  if (active.length === 0) {
    container.innerHTML = '<div class="analysis-placeholder">← Select party members to see analysis</div>';
    return;
  }

  // Gather covered elements
  const covered = new Set();
  active.forEach(id => PARTY_ELEMENTS[id].elements.forEach(e => covered.add(e)));

  // Missing offensive elements
  const offensive = ['Fire','Ice','Elec','Wind','Dark','Light','Almighty'];
  const missing   = offensive.filter(e => !covered.has(e));

  // Synergy score
  const hasHealing  = covered.has('Healing');
  const hasSupport  = covered.has('Support');
  const hasAnalysis = covered.has('Analysis');
  const elemCount   = offensive.filter(e => covered.has(e)).length;
  let score = Math.round((elemCount / offensive.length) * 60);
  if (hasHealing)  score += 15;
  if (hasSupport)  score += 15;
  if (hasAnalysis) score += 10;
  score = Math.min(score, 100);

  const rating = score >= 85 ? { label:'S — Optimal', color:'#50c8a0' }
               : score >= 70 ? { label:'A — Strong',  color:'#f0c86e' }
               : score >= 50 ? { label:'B — Decent',  color:'#7ab8e8' }
               : score >= 30 ? { label:'C — Limited', color:'#ff6b85' }
               :               { label:'D — Weak',    color:'var(--red)' };

  container.innerHTML = `
    <div class="analysis-content">
      <div class="analysis-score-wrap">
        <div class="analysis-score-label">Synergy Rating</div>
        <div class="analysis-score" style="color:${rating.color}">${rating.label}</div>
        <div class="analysis-bar-wrap">
          <div class="analysis-bar-fill" style="width:${score}%;background:${rating.color}"></div>
        </div>
      </div>

      <div class="analysis-section">
        <div class="analysis-label">✓ Covered Elements</div>
        <div class="elem-list">${[...covered].map(e=>`<span class="elem-tag covered">${e}</span>`).join('')}</div>
      </div>

      ${missing.length > 0 ? `
        <div class="analysis-section">
          <div class="analysis-label" style="color:var(--red2)">✗ Missing Offense</div>
          <div class="elem-list">${missing.map(e=>`<span class="elem-tag missing">${e}</span>`).join('')}</div>
        </div>` : '<div class="analysis-section" style="color:#50c8a0;font-size:12px;">✓ All offensive elements covered!</div>'}

      <div class="analysis-section">
        <div class="analysis-label">Support Coverage</div>
        <div class="support-checks">
          <span class="support-check ${hasHealing?'yes':'no'}">${hasHealing?'✓':'✗'} Healing</span>
          <span class="support-check ${hasSupport?'yes':'no'}">${hasSupport?'✓':'✗'} Support</span>
          <span class="support-check ${hasAnalysis?'yes':'no'}">${hasAnalysis?'✓':'✗'} Analysis</span>
        </div>
      </div>
    </div>`;

  // Animate bar
  setTimeout(() => {
    const bar = container.querySelector('.analysis-bar-fill');
    if (bar) { bar.style.transition = 'width 0.8s cubic-bezier(0.16,1,0.3,1)'; }
  }, 50);
}


/* ═══════════════════════════════════════════
   ALL CHARACTERS — Full Expanded Dossier
   Complete info for every SEES member
═══════════════════════════════════════════ */

let allcharsFilter = 'All';
let allcharsSearch = '';

function initAllChars() {
  buildAllCharsFilters();
  renderAllChars();
}

function buildAllCharsFilters() {
  const container = document.getElementById('allchars-filters');
  if (!container || !window.CHARS) return;
  const routes = ['All','starter','story','event','fem','both','optional'];
  const labels  = { All:'All', starter:'Starter', story:'Story', event:'Event', fem:'FeMC Only', both:'Both Routes', optional:'Other' };
  container.innerHTML = routes.map(r =>
    `<button class="ftag ${r==='All'?'on':''}" onclick="setAllCharsFilter('${r}',this)">${labels[r]}</button>`
  ).join('');
}

window.setAllCharsFilter = function(f, btn) {
  allcharsFilter = f;
  document.querySelectorAll('#allchars-filters .ftag').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderAllChars();
};

window.filterAllChars = function(val) {
  allcharsSearch = val.toLowerCase();
  renderAllChars();
};

function routeBadgeClass(rt) {
  return { starter:'rt-starter', story:'rt-story', event:'rt-event', fem:'rt-fem', both:'rt-both', optional:'rt-optional' }[rt] || 'rt-story';
}
function routeBadgeLabel(rt) {
  return { starter:'Starter', story:'Story', event:'Event', fem:'FeMC Only', both:'Both Routes', optional:'Other' }[rt] || rt;
}

function renderAllChars() {
  const list = document.getElementById('allchars-list');
  const count = document.getElementById('allchars-count');
  if (!list || !window.CHARS) return;

  const filtered = window.CHARS.filter(c => {
    const matchRoute  = allcharsFilter === 'All' || c.filter === allcharsFilter;
    const matchSearch = !allcharsSearch ||
      c.name.toLowerCase().includes(allcharsSearch) ||
      c.arcana.toLowerCase().includes(allcharsSearch) ||
      c.persona.toLowerCase().includes(allcharsSearch) ||
      c.role.toLowerCase().includes(allcharsSearch) ||
      c.weapon.toLowerCase().includes(allcharsSearch) ||
      c.skills.some(s => s.toLowerCase().includes(allcharsSearch));
    return matchRoute && matchSearch;
  });

  if (count) count.textContent = `${filtered.length} character${filtered.length !== 1 ? 's' : ''}`;

  list.innerHTML = filtered.map(c => `
    <div class="ac-card" onclick="openModal(window.CHARS.find(x=>x.id===${c.id}))">

      <!-- Portrait column -->
      <div class="ac-portrait">
        <div class="ac-portrait-placeholder">${c.initial}</div>
        <img class="ac-portrait-img" src="${c.img}" alt="${c.name}"
          onload="this.style.opacity=1;this.previousElementSibling.style.display='none'"
          onerror="this.style.display='none';this.previousElementSibling.style.display='flex'"
          style="opacity:0;transition:opacity 0.5s;">
        <div class="ac-portrait-overlay"></div>
        <div class="ac-route-badge ${routeBadgeClass(c.filter)}">${routeBadgeLabel(c.filter)}</div>
      </div>

      <!-- Info column -->
      <div class="ac-info">
        <div class="ac-header">
          <div>
            <div class="ac-name">${c.name}</div>
            <div class="ac-role">${c.role}</div>
          </div>
          <div class="ac-arcana-badge">${c.arcana}</div>
        </div>

        <div class="ac-divider"></div>

        <div class="ac-grid">
          <div class="ac-field"><span class="ac-label">Persona</span><span class="ac-val">${c.persona}</span></div>
          <div class="ac-field"><span class="ac-label">Birthday</span><span class="ac-val">${c.bday}</span></div>
          <div class="ac-field"><span class="ac-label">Weapon</span><span class="ac-val">${c.weapon}</span></div>
          <div class="ac-field"><span class="ac-label">Route</span><span class="ac-val">${c.routeLabel}</span></div>
          <div class="ac-field"><span class="ac-label">Voice Actor</span><span class="ac-val">${c.va}</span></div>
        </div>

        <div class="ac-divider"></div>

        <div class="ac-desc">${c.desc}</div>

        <div class="ac-divider"></div>

        <div class="ac-unlock-block">
          <div class="ac-unlock-label">How to Unlock</div>
          <div class="ac-unlock-text">${c.unlock}</div>
        </div>

        <div class="ac-skills">
          ${c.skills.map(s => `<span class="ac-skill-tag">${s}</span>`).join('')}
        </div>

        <div class="ac-footer">
          <span class="ac-click-hint">Click to open full profile →</span>
        </div>
      </div>

    </div>
  `).join('');
}


/* ═══════════════════════════════════════════
   CSS — All sections + All Characters styles
═══════════════════════════════════════════ */
(function () {
  const style = document.createElement('style');
  style.textContent = `

  /* ── SECTION VISIBILITY ── */
  .tartarus-section, .party-section { display:none; padding-bottom:80px; }
  .tartarus-section.visible, .party-section.visible { display:block; }

  /* ── NAV overflow on mobile ── */
  .nav-links { flex-wrap:wrap; gap:4px 20px; }

  /* ══════════════════════════
     TARTARUS STYLES
  ══════════════════════════ */
  .tartarus-blocks { padding:32px 64px 0; display:flex; flex-direction:column; gap:2px; }

  .tartarus-block {
    background:var(--card-bg); border:1px solid var(--border);
    cursor:pointer; transition:background 0.25s;
    border-left:3px solid var(--block-color,var(--red));
  }
  .tartarus-block:hover { background:var(--surface); }

  .tb-header {
    padding:20px 24px; display:flex; align-items:center;
    justify-content:space-between; gap:20px; flex-wrap:wrap;
  }
  .tb-left { display:flex; align-items:center; gap:16px; }
  .tb-color-bar {
    width:4px; height:48px; border-radius:2px;
    background:var(--block-color,var(--red));
    box-shadow:0 0 12px var(--block-color,var(--red));
    flex-shrink:0;
  }
  .tb-name { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:700; color:var(--cream); }
  .tb-floors { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-top:2px; }
  .tb-right { display:flex; align-items:center; gap:28px; flex-wrap:wrap; }
  .tb-meta-item { display:flex; flex-direction:column; gap:2px; align-items:flex-end; }
  .tb-meta-l { font-size:8px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); }
  .tb-meta-v { font-size:13px; color:var(--text); }
  .tb-chevron { color:var(--muted2); font-size:12px; transition:transform 0.3s; flex-shrink:0; }

  .tb-body { max-height:0; overflow:hidden; transition:max-height 0.45s cubic-bezier(0.16,1,0.3,1); }
  .tb-body.open { max-height:800px; }
  .tb-body-inner { padding:0 24px 24px; border-top:1px solid var(--border); }

  .tb-boss-card {
    background:rgba(232,64,96,0.05); border:1px solid rgba(232,64,96,0.2);
    padding:16px 20px; margin:20px 0 16px; border-left:2px solid var(--red);
  }
  .tb-section-label { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:var(--red2); margin-bottom:8px; }
  .tb-boss-name { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:700; color:var(--cream); margin-bottom:10px; }
  .tb-boss-meta { display:flex; gap:8px; flex-wrap:wrap; }
  .tb-boss-tag { font-size:9px; letter-spacing:0.15em; text-transform:uppercase; padding:3px 10px; border:1px solid; }
  .tb-weak    { border-color:rgba(80,200,160,0.5); color:#50c8a0; }
  .tb-resist  { border-color:rgba(232,64,96,0.5); color:var(--red2); }
  .tb-reward  { border-color:rgba(212,168,75,0.4); color:var(--gold2); }

  .tb-floor-map { margin-bottom:16px; }
  .tb-map-items { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:6px; }
  .tb-map-item { padding:8px 12px; font-size:12px; display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); }
  .tb-map-icon { flex-shrink:0; }
  .tb-barrier    { border-left:2px solid var(--gold2); }
  .tb-safe       { border-left:2px solid #50c8a0; }
  .tb-key        { border-left:2px solid #7ab8e8; }
  .tb-boss-floor { border-left:2px solid var(--red); }

  .tb-two-col { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  .tb-shadows-list { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .tb-shadow-tag { font-size:10px; padding:3px 10px; border:1px solid var(--border); color:var(--muted2); }
  .tb-tip-text { font-size:12px; line-height:1.8; color:var(--muted2); margin-top:8px; }

  /* ══════════════════════════
     PARTY BUILDER STYLES
  ══════════════════════════ */
  .party-intro { padding:0 64px 32px; border-bottom:1px solid var(--border); }
  .party-intro p { font-size:14px; line-height:1.85; color:var(--muted2); max-width:700px; }

  .party-layout { display:grid; grid-template-columns:1fr 360px; gap:2px; margin:32px 64px 0; background:var(--border); border:1px solid var(--border); }

  .party-roster {
    background:var(--bg); padding:24px;
    display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px;
    align-content:start;
  }
  .roster-member {
    background:var(--card-bg); border:1px solid var(--border);
    padding:14px 12px; cursor:pointer; transition:all 0.22s;
    display:flex; flex-direction:column; gap:6px;
  }
  .roster-member:hover { background:var(--surface); border-color:var(--red2); }
  .roster-member.in-party { border-color:var(--red); background:rgba(232,64,96,0.08); }
  .roster-avatar { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; color:var(--red2); }
  .roster-name { font-size:12px; color:var(--cream); font-weight:500; line-height:1.2; }
  .roster-elements { display:flex; flex-wrap:wrap; gap:3px; }

  .party-panel { background:var(--surface); display:flex; flex-direction:column; gap:0; }
  .party-slots { padding:20px; display:flex; flex-direction:column; gap:8px; border-bottom:1px solid var(--border); }

  .party-slot {
    padding:14px 16px; border:1px solid var(--border);
    transition:all 0.25s; position:relative;
    display:flex; align-items:center; gap:12px;
  }
  .party-slot.empty { background:var(--card-bg); color:var(--muted); font-size:12px; letter-spacing:0.1em; }
  .party-slot.filled { background:rgba(232,64,96,0.06); border-color:var(--border2); }
  .slot-num { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; color:var(--muted); flex-shrink:0; }
  .slot-avatar { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:700; color:var(--red2); flex-shrink:0; }
  .slot-name { font-size:13px; color:var(--cream); font-weight:500; flex:1; }
  .slot-elements { display:flex; flex-wrap:wrap; gap:3px; }
  .slot-remove {
    position:absolute; top:8px; right:8px;
    background:none; border:1px solid var(--border); color:var(--muted);
    width:20px; height:20px; font-size:10px; display:flex; align-items:center; justify-content:center;
    transition:all 0.2s;
  }
  .slot-remove:hover { border-color:var(--red); color:var(--red2); }

  .elem-tag {
    font-size:9px; letter-spacing:0.12em; text-transform:uppercase;
    padding:2px 7px; border:1px solid var(--border); color:var(--muted2);
  }
  .elem-tag.covered { border-color:rgba(80,200,160,0.5); color:#50c8a0; }
  .elem-tag.missing { border-color:rgba(232,64,96,0.5); color:var(--red2); }

  .party-analysis { padding:20px; flex:1; }
  .analysis-placeholder { font-size:12px; color:var(--muted); line-height:1.6; }
  .analysis-content { display:flex; flex-direction:column; gap:16px; }
  .analysis-score-wrap { display:flex; flex-direction:column; gap:6px; }
  .analysis-score-label { font-size:9px; letter-spacing:0.25em; text-transform:uppercase; color:var(--muted); }
  .analysis-score { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:700; }
  .analysis-bar-wrap { height:2px; background:var(--border); position:relative; overflow:hidden; }
  .analysis-bar-fill { position:absolute; top:0; left:0; height:100%; width:0%; box-shadow:0 0 6px currentColor; }
  .analysis-section { display:flex; flex-direction:column; gap:6px; }
  .analysis-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted2); }
  .elem-list { display:flex; flex-wrap:wrap; gap:4px; }
  .support-checks { display:flex; flex-direction:column; gap:4px; }
  .support-check { font-size:11px; }
  .support-check.yes { color:#50c8a0; }
  .support-check.no  { color:var(--muted); }

  /* ══════════════════════════
     ALL CHARACTERS STYLES
  ══════════════════════════ */
  .allchars-list {
    display:flex; flex-direction:column; gap:2px;
    margin:0 64px; border:1px solid var(--border); background:var(--border);
  }

  .ac-card {
    display:grid; grid-template-columns:220px 1fr;
    background:var(--card-bg); cursor:pointer;
    transition:background 0.25s;
    position:relative; overflow:hidden;
  }
  .ac-card:hover { background:var(--surface); }
  .ac-card::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--red),transparent);
    opacity:0; transition:opacity 0.3s;
  }
  .ac-card:hover::after { opacity:1; }

  /* Portrait */
  .ac-portrait {
    position:relative; overflow:hidden;
    background:linear-gradient(160deg,#1e1018,#0e0810);
    min-height:280px;
  }
  .ac-portrait-placeholder {
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-size:3.5rem; font-weight:900;
    color:rgba(232,64,96,0.12);
  }
  .ac-portrait-img {
    width:100%; height:100%; object-fit:cover; object-position:top center;
    filter:saturate(0.85) contrast(1.06);
    transition:transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.3s;
  }
  .ac-card:hover .ac-portrait-img { transform:scale(1.05); filter:saturate(1.05) contrast(1.1); }
  .ac-portrait-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to right, transparent 50%, var(--card-bg) 100%);
  }
  .ac-route-badge {
    position:absolute; bottom:14px; left:12px;
    padding:3px 10px; border:1px solid; font-size:9px;
    letter-spacing:0.18em; text-transform:uppercase;
    background:rgba(10,6,8,0.78); backdrop-filter:blur(8px);
  }

  /* Info */
  .ac-info {
    padding:24px 28px; display:flex; flex-direction:column; gap:14px;
  }
  .ac-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
  .ac-name {
    font-family:'Playfair Display',serif;
    font-size:1.6rem; font-weight:700; color:var(--cream); line-height:1.1;
  }
  .ac-role { font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted2); margin-top:4px; }
  .ac-arcana-badge {
    padding:4px 14px; background:rgba(212,168,75,0.08);
    border:1px solid rgba(212,168,75,0.3); color:var(--gold2);
    font-size:9px; letter-spacing:0.22em; text-transform:uppercase;
    white-space:nowrap; flex-shrink:0;
  }

  .ac-divider { height:1px; background:var(--border); }

  .ac-grid {
    display:grid; grid-template-columns:1fr 1fr 1fr;
    gap:12px 20px;
  }
  .ac-field { display:flex; flex-direction:column; gap:3px; }
  .ac-label { font-size:8px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); }
  .ac-val   { font-size:12px; color:var(--text); line-height:1.4; }

  .ac-desc {
    font-size:13px; line-height:1.82; color:var(--muted2);
  }

  .ac-unlock-block {
    background:rgba(232,64,96,0.05);
    border-left:2px solid var(--red); padding:12px 16px;
  }
  .ac-unlock-label {
    font-size:8px; letter-spacing:0.28em; text-transform:uppercase;
    color:var(--red2); margin-bottom:6px;
  }
  .ac-unlock-text { font-size:12px; line-height:1.75; color:var(--text); }

  .ac-skills { display:flex; flex-wrap:wrap; gap:5px; }
  .ac-skill-tag {
    font-size:9px; letter-spacing:0.1em; padding:3px 10px;
    border:1px solid var(--border2); color:var(--muted2);
    transition:all 0.2s;
  }
  .ac-card:hover .ac-skill-tag { border-color:var(--border2); }

  .ac-footer { display:flex; justify-content:flex-end; }
  .ac-click-hint {
    font-size:9px; letter-spacing:0.18em; text-transform:uppercase;
    color:var(--muted); transition:color 0.25s;
  }
  .ac-card:hover .ac-click-hint { color:var(--red2); }

  /* ── Responsive ── */
  @media(max-width:900px) {
    .tartarus-blocks { padding:20px; }
    .party-layout { grid-template-columns:1fr; margin:20px; }
    .allchars-list { margin:0 20px; }
    .ac-card { grid-template-columns:160px 1fr; }
    .ac-grid { grid-template-columns:1fr 1fr; }
    .tb-two-col { grid-template-columns:1fr; }
    .tb-right { gap:16px; }
    .party-intro { padding:0 20px 24px; }
  }
  @media(max-width:600px) {
    .ac-card { grid-template-columns:1fr; }
    .ac-portrait { min-height:200px; max-height:220px; }
    .ac-portrait-overlay { background:linear-gradient(to bottom, transparent 50%, var(--card-bg) 100%); }
    .ac-grid { grid-template-columns:1fr 1fr; }
    .party-roster { grid-template-columns:1fr 1fr; }
    .tb-right .tb-meta-item:not(:first-child) { display:none; }
  }
  `;
  document.head.appendChild(style);
})();


/* ── INIT on load ── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(buildAllCharsFilters, 200);
});
