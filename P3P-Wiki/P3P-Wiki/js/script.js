const CHARS = [
  {
    id:1,filter:'starter',rt:'starter',
    name:'Male Protagonist',role:'Leader · Wild Card',
    arcana:'Fool',persona:'Orpheus → Any Arcana',
    bday:'April 7',weapon:'One-handed Swords',routeLabel:'Male Route',va:'Akira Ishida (JP)',
    img:'assets/images/characters/male-protagonist.jpeg',
    initial:'M',
    desc:'The original protagonist of Persona 3. A transfer student at Gekkoukan High School who possesses the Wild Card — the rare ability to wield every Arcana. Silent and stoic, he bonds with SEES in a story defined by mortality, friendship, and fate. His connection to Death itself will define the game\'s climax and the ultimate sacrifice at its heart.',
    unlock:'Automatically available from the very beginning of the game. Select the Male route at the title screen — no additional conditions or steps required. He is the original protagonist.',
    skills:['Wild Card','All Arcana Fusion','Evoker Combat','Protagonist Bonuses']
  },
  {
    id:2,filter:'fem',rt:'fem',
    name:'Female Protagonist',role:'Leader · Wild Card',
    arcana:'Fool',persona:'Orpheus Femina → Any Arcana',
    bday:'April 7',weapon:'One-handed Swords',routeLabel:'Female Route Only',va:'Akiko Yajima (JP)',
    img:'assets/images/characters/female-protagonist.jpeg',
    initial:'F',
    desc:'The iconic protagonist introduced exclusively in Persona 3 Portable. She wields the same Wild Card ability but experiences a completely different emotional journey — her route features unique Social Links, romance options unavailable to the male route, and a distinct tone of warmth and resilience. Universally beloved by the community.',
    unlock:'Select the Female route when prompted at the very beginning of the game. This unlocks her exclusive storyline including the Shinjiro Hierophant Social Link (romance) and Ryoji Death Social Link (romance), both unavailable on the male route.',
    skills:['Wild Card','All Arcana Fusion','Exclusive Social Links','Shinjiro & Ryoji Romance']
  },
  {
    id:3,filter:'starter',rt:'starter',
    name:'Yukari Takeba',role:'Healer · Wind Mage',
    arcana:'Lovers',persona:'Io → Isis',
    bday:'March 21',weapon:'Bow & Arrow',routeLabel:'Both Routes',va:'Megumi Toyoguchi (JP)',
    img:'assets/images/characters/yukari-takeba.jpeg',
    initial:'YK',
    desc:'A popular and athletic second-year at Gekkoukan who joined SEES to uncover the truth about her father\'s mysterious death. Cheerful and emotional on the surface, Yukari hides deep wounds and guilt. She is the team\'s primary healer, combining strong Wind offensive magic with vital recovery spells. Her growth arc throughout the game is among the most resonant.',
    unlock:'Automatically joins the party at the very beginning of the game. She is the very first party member encountered — fighting alongside the protagonist from April on both Male and Female routes with no unlock conditions.',
    skills:['Garula / Garudyne','Media / Mediarama','Recarm / Recarm','High Agility']
  },
  {
    id:4,filter:'starter',rt:'starter',
    name:'Junpei Iori',role:'Striker · Fire Mage',
    arcana:'Magician',persona:'Hermes → Trismegistus',
    bday:'December 27',weapon:'Two-handed Sword',routeLabel:'Both Routes',va:'Kōsuke Toriumi (JP)',
    img:'assets/images/characters/junpei-iori.jpeg',
    initial:'JP',
    desc:'The protagonist\'s boisterous, good-natured best friend who hides insecurity beneath constant humor. Junpei desperately wants to prove himself as a Persona-user and often charges in without thinking. His arc is shaped by his relationship with Strega\'s Chidori, leading to one of Persona 3\'s most memorable and heartbreaking storylines.',
    unlock:'Automatically joins the party from the very start of the game on both routes. No unlock conditions — he is alongside the protagonist from April\'s first Tartarus exploration.',
    skills:['Agidyne / Maragidyne','Slash Attack','Brave Blade','High Strength']
  },
  {
    id:5,filter:'story',rt:'story',
    name:'Akihiko Sanada',role:'Brawler · Thunder Mage',
    arcana:'Emperor',persona:'Polydeuces → Caesar',
    bday:'September 22',weapon:'Gloves / Fists',routeLabel:'Both Routes',va:'Hikaru Midorikawa (JP)',
    img:'assets/images/characters/akihiko-sanada.jpeg',
    initial:'AK',
    desc:'A legendary third-year boxing star who co-founded SEES with Mitsuru. Driven by survivor\'s guilt over the death of his childhood friend Shinjiro, Akihiko is obsessively focused on becoming stronger. He struggles to express emotion and often appears cold — but beneath that lies fierce loyalty and grief that define his character arc.',
    unlock:'Joins the party automatically via story progression in April after the initial Tartarus exploration and early story cutscenes. Simply play through the opening chapters and he will become a controllable party member with no special conditions.',
    skills:['Ziodyne / Maziodyne','Survive Theurgy','Powerful Strikes','High Endurance']
  },
  {
    id:6,filter:'story',rt:'story',
    name:'Mitsuru Kirijo',role:'Commander · Ice Mage',
    arcana:'Empress',persona:'Penthesilea → Artemisia',
    bday:'May 8',weapon:'Rapier',routeLabel:'Both Routes',va:'Rie Tanaka (JP)',
    img:'assets/images/characters/mitsuru-kirijo.jpeg',
    initial:'MK',
    desc:'The sophisticated, commanding leader of SEES and heiress to the Kirijo Group. She carries enormous guilt for her family\'s role in creating the Dark Hour. Originally just the mission operator in Persona 3, P3P upgraded her to a fully playable battle member. Her icy, precise combat style perfectly mirrors her guarded but deeply caring personality.',
    unlock:'Joins as a fully controllable battle member — a P3P exclusive upgrade — through natural story progression in May. Simply advance through the narrative and she joins the active party roster automatically.',
    skills:['Mabufudyne','Marin Karin (Charm)','Pierce Attacks','High Magic Stat']
  },
  {
    id:7,filter:'story',rt:'story',
    name:'Fuuka Yamagishi',role:'Navigator · Support',
    arcana:'Priestess',persona:'Lucia → Juno',
    bday:'October 9',weapon:'N/A (Navigator)',routeLabel:'Both Routes',va:'Mamiko Noto (JP)',
    img:'assets/images/characters/fuuka-yamagishi.jpeg',
    initial:'FK',
    desc:'A shy and gentle student who takes over as SEES\'s navigator after Mitsuru moves to active combat. Her Persona has exceptional scanning and support abilities — she can analyze enemies, detect weaknesses, and boost the party remotely. Outside battle she is soft-spoken, deeply kind, and infamously terrible at cooking despite her best efforts.',
    unlock:'Joins SEES automatically as the navigator following story events in June, after the Full Moon operation involving her rescue from Tartarus. Advance through the main narrative and she will appear naturally.',
    skills:['Enemy Analysis','Scan Weaknesses','Party HP/SP Restore','Radar Support']
  },
  {
    id:8,filter:'story',rt:'story',
    name:'Ken Amada',role:'Avenger · Light Mage',
    arcana:'Justice',persona:'Nemesis → Kala-Nemi',
    bday:'September 27',weapon:'Spear / Extendable Rod',routeLabel:'Both Routes',va:'Megumi Ogata (JP)',
    img:'assets/images/characters/ken-amada.jpeg',
    initial:'KA',
    desc:'An elementary-school-aged boy who joined SEES driven by a deeply personal vendetta. Far more mature than his age suggests, Ken conceals a dangerous single-mindedness beneath a polite, composed facade. His arc explores grief, justice, and what it truly means to move forward. He wields Light and Almighty magic with spear-based physical attacks.',
    unlock:'Joins the party automatically through story progression in July, following events at the Moonlight Bridge and the introduction of the antagonist group Strega. Simply progress the main story.',
    skills:['Hamaon / Mahama','Almighty Skills','Spear Attacks (Shock)','Mediarama']
  },
  {
    id:9,filter:'story',rt:'story',
    name:'Koromaru',role:'Shadow Hunter · Dark Mage',
    arcana:'Strength',persona:'Cerberus',
    bday:'Unknown',weapon:'Knife (in mouth)',routeLabel:'Both Routes',va:'N/A',
    img:'assets/images/characters/koromaru.jpeg',
    initial:'KO',
    desc:'A white Shiba Inu who belonged to a deceased shrine priest. Fiercely loyal to his late owner\'s memory, Koromaru is surprisingly capable in combat — he awakened to his Persona through sheer force of devotion. He wields Dark and Fire magic simultaneously, making him an unusual and powerful dual-element attacker with exceptional agility.',
    unlock:'Joins the party automatically through story events in July, at the same time as Ken Amada, after SEES encounters him at the shrine near Gekkoukan. Both join simultaneously via story progression.',
    skills:['Mudoon / Mamudo','Agidyne / Maragidyne','High Agility','Evade Slash']
  },
  {
    id:10,filter:'event',rt:'event',
    name:'Shinjiro Aragaki',role:'Former SEES · Berserker',
    arcana:'Hierophant',persona:'Castor',
    bday:'January 1',weapon:'Axe / Blunt Weapons',routeLabel:'Both (limited) · Romance on FeMC',va:'Kazuya Nakai (JP)',
    img:'assets/images/characters/shinjiro-aragaki.jpg',
    initial:'SK',
    desc:'A former SEES member who left after a tragic accident caused by his Persona killed an innocent person. Rough and deeply antisocial on the surface, Shinjiro is extraordinarily compassionate and consumed by guilt. In the Female route he becomes a full Social Link with a romance path. He is a devastating physical powerhouse — the hardest-hitting member in the game.',
    unlock:'BOTH ROUTES: Rejoins party in September via story events but is temporary due to plot circumstances. FEMALE ROUTE ONLY: His Hierophant Social Link opens in September — maximize it before the October 4th deadline for the full romance arc. He is only available for a limited window, so prioritize his link immediately when it opens.',
    skills:['Gigantic Fist','Powerful Blunt Attacks','High Strength Stat','Late Game Monster']
  },
  {
    id:11,filter:'story',rt:'story',
    name:'Aigis',role:'Android Warrior · Protector',
    arcana:'Chariot → Aeon',persona:'Palladion → Athena',
    bday:'August 8 (activation)',weapon:'Built-in Firearms & Blades',routeLabel:'Both Routes',va:'Maaya Sakamoto (JP)',
    img:'assets/images/characters/aigis.jpg',
    initial:'AI',
    desc:'An android created by the Kirijo Group to combat Shadows. Programmed above all else to protect the protagonist — a directive rooted in a suppressed memory from a fateful night ten years prior. Aigis gradually develops genuine emotions and self-awareness throughout the story, becoming one of the most beloved characters in the entire Persona series.',
    unlock:'Joins the party automatically through story progression in August, following events at Yakushima. Her exclusive Social Link (the Aeon Arcana, unique to P3P) opens on both routes after she joins.',
    skills:['Orgia Mode (berserk boost)','Firearms / Almighty Bullets','Slash Skills','Balanced High Stats']
  },
  {
    id:12,filter:'both',rt:'both',
    name:'Ryoji Mochizuki',role:'Transfer Student · Harbinger',
    arcana:'Death',persona:'Thanatos',
    bday:'November 8',weapon:'N/A (Non-playable)',routeLabel:'Both Routes · Social Link on FeMC',va:'Akira Ishida (JP)',
    img:'assets/images/characters/ryoji-mochizuki.jpeg',
    initial:'RY',
    desc:'A charismatic, cheerful transfer student who arrives in autumn and immediately captivates the school. Ryoji harbors a devastating secret that is entirely central to the game\'s climax and the true nature of the protagonist. He shares a deep, mysterious bond with the main character. In the Female route he is a romance Social Link, and his tragic story is unforgettable.',
    unlock:'Appears automatically through story progression in November as a new transfer student — no action required. FEMALE ROUTE ONLY: His Death Arcana Social Link opens via story-triggered conversations at Gekkoukan. Build the relationship through available dialogue options before the story deadline.',
    skills:['Non-playable Character','Story Role Only','FeMC Romance Social Link','Death Arcana (FeMC)']
  },
  {
    id:13,filter:'optional',rt:'optional',
    name:'Metis',role:'Android · Aigis\'s Sister',
    arcana:'Hanged Man',persona:'Psyche',
    bday:'Unknown',weapon:'Arm Blades',routeLabel:'Not in P3P (FES Only)',va:'Nana Mizuki (JP)',
    img:'assets/images/characters/metis.jpg',
    initial:'ME',
    desc:'Metis is NOT a playable character in Persona 3 Portable. She exists exclusively in Persona 3 FES\'s "The Answer" epilogue mode (Episode Aigis). When Atlus ported the game to PSP as P3P, The Answer epilogue was removed entirely, meaning Metis does not appear in this version at all.',
    unlock:'Metis is UNAVAILABLE in Persona 3 Portable. She only appears in Persona 3 FES on PS2/PS3 via the "The Answer" epilogue. To access her content you must play Persona 3 FES — she was not included when the game was remastered in 2023 either.',
    skills:['Arm Blade Attacks (FES)','Wind Magic (FES)','Not in P3P','FES Exclusive Only']
  },
  {
    id:14,filter:'story',rt:'story',
    name:'Takeharu Kirijo',role:'Kirijo Group Chairman',
    arcana:'N/A',persona:'N/A',
    bday:'Unknown',weapon:'N/A',routeLabel:'Both Routes (NPC)',va:'Unshou Ishizuka (JP)',
    img:'assets/images/characters/takeharu-kirijo.jpeg',
    initial:'TK',
    desc:'Mitsuru\'s father and the chairman of the Kirijo Group. Takeharu plays a pivotal supporting role in the story\'s progression and SEES\'s broader mission. Not a playable party member, but central to understanding the game\'s mythology — specifically the Kirijo Group\'s experiments that created the Dark Hour in the first place.',
    unlock:'Story NPC — appears automatically through plot progression at key story beats. Not playable in any version of Persona 3 Portable.',
    skills:['Story Character Only','Non-playable','Key Narrative Role']
  }
];

let currentFilter = 'all';

function routeClass(rt) {
  return {starter:'rt-starter',story:'rt-story',event:'rt-event',fem:'rt-fem',both:'rt-both',optional:'rt-optional'}[rt] || 'rt-story';
}
function routeLabel(rt) {
  return {starter:'Starter',story:'Story',event:'Event',fem:'FeMC Only',both:'Both',optional:'Other'}[rt] || rt;
}

function buildGrid() {
  const g = document.getElementById('grid');
  g.innerHTML = '';
  CHARS.forEach((c, i) => {
    const show = currentFilter === 'all' || c.filter === currentFilter;
    const div = document.createElement('div');
    div.className = 'char-card' + (show ? '' : ' hidden');
    div.style.animationDelay = (i * 0.045) + 's';
    div.onclick = () => openModal(c);
    const shortUnlock = c.unlock.length > 90 ? c.unlock.substring(0, 87) + '…' : c.unlock;
    div.innerHTML = `
      <div class="card-portrait">
        <div class="portrait-placeholder">${c.initial}</div>
        <img class="portrait-img" src="${c.img}" alt="${c.name}"
          onload="this.style.opacity=1;this.previousElementSibling.style.display='none'"
          onerror="this.style.display='none';this.previousElementSibling.style.display='flex'"
          style="opacity:0;transition:opacity 0.5s;">
        <div class="portrait-overlay"></div>
        <div class="p-arcana">${c.arcana}</div>
        <div class="p-route ${routeClass(c.filter)}">${routeLabel(c.filter)}</div>
      </div>
      <div class="card-body">
        <div><div class="card-name">${c.name}</div><div class="card-role">${c.role}</div></div>
        <div class="card-hr"></div>
        <div class="card-meta">
          <div class="meta-i"><span class="meta-l">Persona</span><span class="meta-v">${c.persona.split('→')[0].trim()}</span></div>
          <div class="meta-i"><span class="meta-l">Weapon</span><span class="meta-v">${c.weapon}</span></div>
          <div class="meta-i"><span class="meta-l">Birthday</span><span class="meta-v">${c.bday}</span></div>
          <div class="meta-i"><span class="meta-l">Route</span><span class="meta-v">${c.routeLabel}</span></div>
        </div>
        <div class="card-unlock">
          <div class="ul-tag">Unlock</div>
          <div class="ul-text">${shortUnlock}</div>
        </div>
      </div>
      <div class="card-glow"></div>`;
    g.appendChild(div);
  });
  updateCount();
}

function setF(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.ftag').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.char-card').forEach((card, i) => {
    const show = f === 'all' || CHARS[i].filter === f;
    card.classList.toggle('hidden', !show);
  });
  updateCount();
}

function liveSearch(v) {
  v = v.toLowerCase();
  document.querySelectorAll('.char-card').forEach((card, i) => {
    const c = CHARS[i];
    const match = !v || c.name.toLowerCase().includes(v) || c.arcana.toLowerCase().includes(v) || c.persona.toLowerCase().includes(v) || c.role.toLowerCase().includes(v);
    const filterOk = currentFilter === 'all' || c.filter === currentFilter;
    card.classList.toggle('hidden', !(match && filterOk));
  });
  updateCount();
}

function updateCount() {
  const n = document.querySelectorAll('.char-card:not(.hidden)').length;
  document.getElementById('rcount').textContent = n + ' character' + (n !== 1 ? 's' : '');
}

function openModal(c) {
  const img = document.getElementById('m-img');
  const ph = document.getElementById('m-ph');
  img.style.display = 'block'; ph.style.display = 'none';
  img.src = c.img; img.alt = c.name;
  ph.textContent = c.initial;
  document.getElementById('m-name').textContent = c.name;
  document.getElementById('m-role').textContent = c.role;
  document.getElementById('m-arcana').textContent = c.arcana;
  document.getElementById('m-persona').textContent = c.persona;
  document.getElementById('m-bday').textContent = c.bday;
  document.getElementById('m-weapon').textContent = c.weapon;
  document.getElementById('m-route').textContent = c.routeLabel;
  document.getElementById('m-va').textContent = c.va;
  document.getElementById('m-desc').textContent = c.desc;
  document.getElementById('m-unlock').textContent = c.unlock;
  document.getElementById('m-skills').innerHTML = c.skills.map(s => `<span class="skill">${s}</span>`).join('');
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function outsideClose(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

function showSec(id, btn) {
  document.getElementById('chars-content').classList.toggle('visible', id === 'chars');
  document.getElementById('about-content').classList.toggle('visible', id === 'about');
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelector('.page-main').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
buildGrid();