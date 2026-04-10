/* ═══════════════════════════════════════════
   P3P ARCHIVE — script.js
   Character data + all UI logic
═══════════════════════════════════════════ */

const CHARS = [
  {
    id:1, filter:'starter', rt:'starter',
    name:'Male Protagonist', role:'Leader · Wild Card',
    arcana:'Fool', persona:'Orpheus → Any Arcana',
    bday:'April 7', weapon:'One-handed Swords', routeLabel:'Male Route', va:'Akira Ishida (JP)',
    img:'assets/images/characters/Male-Protagonist.jpeg', initial:'M',
    desc:'The original protagonist of Persona 3. A transfer student at Gekkoukan High School who possesses the Wild Card — the rare ability to wield every Arcana. Silent and stoic, he bonds with SEES in a story defined by mortality, friendship, and fate. His connection to Death itself will define the game\'s climax and the ultimate sacrifice at its heart.',
    unlock:'Automatically available from the very beginning of the game. Select the Male route at the title screen — no additional conditions or steps required. He is the original protagonist.',
    skills:['Wild Card','All Arcana Fusion','Evoker Combat','Protagonist Bonuses']
  },
  {
    id:2, filter:'fem', rt:'fem',
    name:'Female Protagonist', role:'Leader · Wild Card',
    arcana:'Fool', persona:'Orpheus Femina → Any Arcana',
    bday:'April 7', weapon:'One-handed Swords', routeLabel:'Female Route Only', va:'Akiko Yajima (JP)',
    img:'assets/images/characters/Female-Protagonist.jpeg', initial:'F',
    desc:'The iconic protagonist introduced exclusively in Persona 3 Portable. She wields the same Wild Card ability but experiences a completely different emotional journey — her route features unique Social Links, romance options unavailable to the male route, and a distinct tone of warmth and resilience. Universally beloved by the community.',
    unlock:'Select the Female route when prompted at the very beginning of the game. This unlocks her exclusive storyline including the Shinjiro Hierophant Social Link (romance) and Ryoji Death Social Link (romance), both unavailable on the male route.',
    skills:['Wild Card','All Arcana Fusion','Exclusive Social Links','Shinjiro & Ryoji Romance']
  },
  {
    id:3, filter:'starter', rt:'starter',
    name:'Yukari Takeba', role:'Healer · Wind Mage',
    arcana:'Lovers', persona:'Io → Isis',
    bday:'March 21', weapon:'Bow & Arrow', routeLabel:'Both Routes', va:'Megumi Toyoguchi (JP)',
    img:'assets/images/characters/Yukari-Takeba.jpeg', initial:'YK',
    desc:'A popular and athletic second-year at Gekkoukan who joined SEES to uncover the truth about her father\'s mysterious death. Cheerful and emotional on the surface, Yukari hides deep wounds and guilt. She is the team\'s primary healer, combining strong Wind offensive magic with vital recovery spells. Her growth arc throughout the game is among the most resonant.',
    unlock:'Automatically joins the party at the very beginning of the game. She is the very first party member encountered — fighting alongside the protagonist from April on both Male and Female routes with no unlock conditions.',
    skills:['Garula / Garudyne','Media / Mediarama','Recarm','High Agility']
  },
  {
    id:4, filter:'starter', rt:'starter',
    name:'Junpei Iori', role:'Striker · Fire Mage',
    arcana:'Magician', persona:'Hermes → Trismegistus',
    bday:'December 27', weapon:'Two-handed Sword', routeLabel:'Both Routes', va:'Kōsuke Toriumi (JP)',
    img:'assets/images/characters/Junpei-Iori.jpeg', initial:'JP',
    desc:'The protagonist\'s boisterous, good-natured best friend who hides insecurity beneath constant humor. Junpei desperately wants to prove himself as a Persona-user and often charges in without thinking. His arc is shaped by his relationship with Strega\'s Chidori, leading to one of Persona 3\'s most memorable and heartbreaking storylines.',
    unlock:'Automatically joins the party from the very start of the game on both routes. No unlock conditions — he is alongside the protagonist from April\'s first Tartarus exploration.',
    skills:['Agidyne / Maragidyne','Slash Attack','Brave Blade','High Strength']
  },
  {
    id:5, filter:'story', rt:'story',
    name:'Akihiko Sanada', role:'Brawler · Thunder Mage',
    arcana:'Emperor', persona:'Polydeuces → Caesar',
    bday:'September 22', weapon:'Gloves / Fists', routeLabel:'Both Routes', va:'Hikaru Midorikawa (JP)',
    img:'assets/images/characters/Akihiko-Sanada.jpeg', initial:'AK',
    desc:'A legendary third-year boxing star who co-founded SEES with Mitsuru. Driven by survivor\'s guilt over the death of his childhood friend Shinjiro, Akihiko is obsessively focused on becoming stronger. He struggles to express emotion and often appears cold — but beneath that lies fierce loyalty and grief that define his character arc.',
    unlock:'Joins the party automatically via story progression in April after the initial Tartarus exploration and early story cutscenes. Simply play through the opening chapters and he will become a controllable party member with no special conditions.',
    skills:['Ziodyne / Maziodyne','Survive Theurgy','Powerful Strikes','High Endurance']
  },
  {
    id:6, filter:'story', rt:'story',
    name:'Mitsuru Kirijo', role:'Commander · Ice Mage',
    arcana:'Empress', persona:'Penthesilea → Artemisia',
    bday:'May 8', weapon:'Rapier', routeLabel:'Both Routes', va:'Rie Tanaka (JP)',
    img:'assets/images/characters/Mitsuru-Kirijo.jpeg', initial:'MK',
    desc:'The sophisticated, commanding leader of SEES and heiress to the Kirijo Group. She carries enormous guilt for her family\'s role in creating the Dark Hour. Originally just the mission operator in Persona 3, P3P upgraded her to a fully playable battle member. Her icy, precise combat style perfectly mirrors her guarded but deeply caring personality.',
    unlock:'Joins as a fully controllable battle member — a P3P exclusive upgrade — through natural story progression in May. Simply advance through the narrative and she joins the active party roster automatically.',
    skills:['Mabufudyne','Marin Karin (Charm)','Pierce Attacks','High Magic Stat']
  },
  {
    id:7, filter:'story', rt:'story',
    name:'Fuuka Yamagishi', role:'Navigator · Support',
    arcana:'Priestess', persona:'Lucia → Juno',
    bday:'October 9', weapon:'N/A (Navigator)', routeLabel:'Both Routes', va:'Mamiko Noto (JP)',
    img:'assets/images/characters/Fuuka-Yamagishi.jpeg', initial:'FK',
    desc:'A shy and gentle student who takes over as SEES\'s navigator after Mitsuru moves to active combat. Her Persona has exceptional scanning and support abilities — she can analyze enemies, detect weaknesses, and boost the party remotely. Outside battle she is soft-spoken, deeply kind, and infamously terrible at cooking despite her best efforts.',
    unlock:'Joins SEES automatically as the navigator following story events in June, after the Full Moon operation involving her rescue from Tartarus. Advance through the main narrative and she will appear naturally.',
    skills:['Enemy Analysis','Scan Weaknesses','Party HP/SP Restore','Radar Support']
  },
  {
    id:8, filter:'story', rt:'story',
    name:'Ken Amada', role:'Avenger · Light Mage',
    arcana:'Justice', persona:'Nemesis → Kala-Nemi',
    bday:'September 27', weapon:'Spear / Extendable Rod', routeLabel:'Both Routes', va:'Megumi Ogata (JP)',
    img:'assets/images/characters/Ken-Amada.jpeg', initial:'KA',
    desc:'An elementary-school-aged boy who joined SEES driven by a deeply personal vendetta. Far more mature than his age suggests, Ken conceals a dangerous single-mindedness beneath a polite, composed facade. His arc explores grief, justice, and what it truly means to move forward. He wields Light and Almighty magic with spear-based physical attacks.',
    unlock:'Joins the party automatically through story progression in July, following events at the Moonlight Bridge and the introduction of the antagonist group Strega. Simply progress the main story.',
    skills:['Hamaon / Mahama','Almighty Skills','Spear Attacks (Shock)','Mediarama']
  },
  {
    id:9, filter:'story', rt:'story',
    name:'Koromaru', role:'Shadow Hunter · Dark Mage',
    arcana:'Strength', persona:'Cerberus',
    bday:'Unknown', weapon:'Knife (in mouth)', routeLabel:'Both Routes', va:'N/A',
    img:'assets/images/characters/Koromaru.jpeg', initial:'KO',
    desc:'A white Shiba Inu who belonged to a deceased shrine priest. Fiercely loyal to his late owner\'s memory, Koromaru is surprisingly capable in combat — he awakened to his Persona through sheer force of devotion. He wields Dark and Fire magic simultaneously, making him an unusual and powerful dual-element attacker with exceptional agility.',
    unlock:'Joins the party automatically through story events in July, at the same time as Ken Amada, after SEES encounters him at the shrine near Gekkoukan. Both join simultaneously via story progression.',
    skills:['Mudoon / Mamudo','Agidyne / Maragidyne','High Agility','Evade Slash']
  },
  {
    id:10, filter:'event', rt:'event',
    name:'Shinjiro Aragaki', role:'Former SEES · Berserker',
    arcana:'Hierophant', persona:'Castor',
    bday:'January 1', weapon:'Axe / Blunt Weapons', routeLabel:'Both (limited) · Romance on FeMC', va:'Kazuya Nakai (JP)',
    img:'assets/images/characters/Shinjiro-Aragaki.jpg', initial:'SK',
    desc:'A former SEES member who left after a tragic accident caused by his Persona killed an innocent person. Rough and deeply antisocial on the surface, Shinjiro is extraordinarily compassionate and consumed by guilt. In the Female route he becomes a full Social Link with a romance path. He is a devastating physical powerhouse — the hardest-hitting member in the game.',
    unlock:'BOTH ROUTES: Rejoins party in September via story events but is temporary due to plot circumstances. FEMALE ROUTE ONLY: His Hierophant Social Link opens in September — maximize it before the October 4th deadline for the full romance arc. He is only available for a limited window, so prioritize his link immediately when it opens.',
    skills:['Gigantic Fist','Powerful Blunt Attacks','High Strength Stat','Late Game Monster']
  },
  {
    id:11, filter:'story', rt:'story',
    name:'Aigis', role:'Android Warrior · Protector',
    arcana:'Chariot → Aeon', persona:'Palladion → Athena',
    bday:'August 8 (activation)', weapon:'Built-in Firearms & Blades', routeLabel:'Both Routes', va:'Maaya Sakamoto (JP)',
    img:'assets/images/characters/Aigis.jpg', initial:'AI',
    desc:'An android created by the Kirijo Group to combat Shadows. Programmed above all else to protect the protagonist — a directive rooted in a suppressed memory from a fateful night ten years prior. Aigis gradually develops genuine emotions and self-awareness throughout the story, becoming one of the most beloved characters in the entire Persona series.',
    unlock:'Joins the party automatically through story progression in August, following events at Yakushima. Her exclusive Social Link (the Aeon Arcana, unique to P3P) opens on both routes after she joins.',
    skills:['Orgia Mode (berserk boost)','Firearms / Almighty Bullets','Slash Skills','Balanced High Stats']
  },
  {
    id:12, filter:'both', rt:'both',
    name:'Ryoji Mochizuki', role:'Transfer Student · Harbinger',
    arcana:'Death', persona:'Thanatos',
    bday:'November 8', weapon:'N/A (Non-playable)', routeLabel:'Both Routes · Social Link on FeMC', va:'Akira Ishida (JP)',
    img:'assets/images/characters/Ryoji-Mochizuki.jpeg', initial:'RY',
    desc:'A charismatic, cheerful transfer student who arrives in autumn and immediately captivates the school. Ryoji harbors a devastating secret that is entirely central to the game\'s climax and the true nature of the protagonist. He shares a deep, mysterious bond with the main character. In the Female route he is a romance Social Link, and his tragic story is unforgettable.',
    unlock:'Appears automatically through story progression in November as a new transfer student — no action required. FEMALE ROUTE ONLY: His Death Arcana Social Link opens via story-triggered conversations at Gekkoukan. Build the relationship through available dialogue options before the story deadline.',
    skills:['Non-playable Character','Story Role Only','FeMC Romance Social Link','Death Arcana (FeMC)']
  },
  {
    id:13, filter:'optional', rt:'optional',
    name:'Metis', role:'Android · Aigis\'s Sister',
    arcana:'Hanged Man', persona:'Psyche',
    bday:'Unknown', weapon:'Arm Blades', routeLabel:'Not in P3P (FES Only)', va:'Nana Mizuki (JP)',
    img:'assets/images/characters/Metis.jpg', initial:'ME',
    desc:'Metis is NOT a playable character in Persona 3 Portable. She exists exclusively in Persona 3 FES\'s "The Answer" epilogue mode (Episode Aigis). When Atlus ported the game to PSP as P3P, The Answer epilogue was removed entirely, meaning Metis does not appear in this version at all.',
    unlock:'Metis is UNAVAILABLE in Persona 3 Portable. She only appears in Persona 3 FES on PS2/PS3 via the "The Answer" epilogue. To access her content you must play Persona 3 FES — she was not included when the game was remastered in 2023 either.',
    skills:['Arm Blade Attacks (FES)','Wind Magic (FES)','Not in P3P','FES Exclusive Only']
  },
  {
    id:14, filter:'story', rt:'story',
    name:'Takeharu Kirijo', role:'Kirijo Group Chairman',
    arcana:'N/A', persona:'N/A',
    bday:'Unknown', weapon:'N/A', routeLabel:'Both Routes (NPC)', va:'Unshou Ishizuka (JP)',
    img:'assets/images/characters/Takeharu-Kirijo.jpeg', initial:'TK',
    desc:'Mitsuru\'s father and the chairman of the Kirijo Group. Takeharu plays a pivotal supporting role in the story\'s progression and SEES\'s broader mission. Not a playable party member, but central to understanding the game\'s mythology — specifically the Kirijo Group\'s experiments that created the Dark Hour in the first place.',
    unlock:'Story NPC — appears automatically through plot progression at key story beats. Not playable in any version of Persona 3 Portable.',
    skills:['Story Character Only','Non-playable','Key Narrative Role']
  },

  // ── STREGA ──
  {
    id:15, filter:'enemy', rt:'enemy',
    name:'Takaya Sakaki', role:'Strega Leader · Antagonist',
    arcana:'Tower', persona:'Hypnos',
    bday:'Unknown', weapon:'Revolver', routeLabel:'Both Routes (antagonist)', va:'Jouji Nakata (JP)',
    img:'', initial:'TA',
    desc:'The charismatic and nihilistic leader of Strega, a group of artificial Persona-users. Takaya views the end of the Dark Hour as a death sentence — it is the only thing keeping him alive — and works to destroy SEES\'s mission. Cold, theatrical and philosophical, he is one of P3\'s most memorable antagonists.',
    unlock:'Story antagonist — appears automatically through plot events. Not a playable character. Upload your own photo.',
    skills:['Hypnos Persona','Revolver Expert','Nihilistic Philosophy','Megidola (boss)']
  },
  {
    id:16, filter:'enemy', rt:'enemy',
    name:'Jin Shirato', role:'Strega Member · Bomber',
    arcana:'Hermit', persona:'Moros',
    bday:'Unknown', weapon:'Grenades / Bombs', routeLabel:'Both Routes (antagonist)', va:'Hiroki Tochi (JP)',
    img:'', initial:'JN',
    desc:'Takaya\'s loyal right-hand man and tactical support of Strega. Jin is calculating and analytical, providing logistical support for Strega\'s operations. He uses bomb-based attacks in battle and is fiercely devoted to Takaya above all else. His fate is directly tied to Strega\'s final confrontation with SEES.',
    unlock:'Story antagonist — appears automatically. Not playable. Upload your own photo.',
    skills:['Moros Persona','Bomb Attacks','Bufudyne','Tactical Support']
  },
  {
    id:17, filter:'enemy', rt:'enemy',
    name:'Chidori Yoshino', role:'Strega Member · Artist',
    arcana:'Priestess', persona:'Medea',
    bday:'November 8', weapon:'Cleaver', routeLabel:'Both Routes (linked to Junpei)', va:'Miyuki Sawashiro (JP)',
    img:'', initial:'CH',
    desc:'A quiet, detached member of Strega who expresses herself through obsessive sketching in her notebook. Chidori develops a complex and deeply emotional bond with Junpei that forms one of P3\'s most heartbreaking storylines. Her Persona Medea has powerful healing and poison abilities.',
    unlock:'Appears through story events connected to Junpei\'s arc. Her relationship with Junpei unfolds across multiple story beats in both routes. Not playable. Upload your own photo.',
    skills:['Medea Persona','Poison Mist','Mediarama','Regenerate 3']
  },
  // ── SOCIAL LINK NPCs ──
  {
    id:18, filter:'npc', rt:'npc',
    name:'Elizabeth', role:'Velvet Room Attendant',
    arcana:'Fool (special)', persona:'Thanatos (ultimate)',
    bday:'Unknown', weapon:'Compendium / Magic', routeLabel:'Male Route (S.Link: Empress)', va:'Miyuki Sawashiro (JP)',
    img:'', initial:'EL',
    desc:'The Velvet Room attendant who assists the male protagonist. Cheerful, curious and fascinatingly naive about the human world, Elizabeth manages the Persona Compendium and issues optional requests. She has her own boss fight and Social Link exclusive to the male route, making her one of the most beloved characters in the series.',
    unlock:'Available from the start of the game in the Velvet Room (male route). Social Link (Empress) begins automatically when you first visit and ranks up by completing her 55 requests throughout the game.',
    skills:['55 Request Quests','Compendium Access','Empress S.Link (Male)','Secret Boss Fight']
  },
  {
    id:19, filter:'npc', rt:'fem',
    name:'Theodore', role:'Velvet Room Attendant',
    arcana:'Fool (special)', persona:'Thanatos (ultimate)',
    bday:'Unknown', weapon:'Compendium / Magic', routeLabel:'Female Route (S.Link: Empress)', va:'Akira Ishida (JP)',
    img:'', initial:'TH',
    desc:'Elizabeth\'s younger brother and the Velvet Room attendant for the female protagonist. More reserved and earnest than his sister, Theodore develops a touching personal journey as he experiences human emotions for the first time through his bond with the female protagonist. His Social Link is one of the female route\'s most rewarding.',
    unlock:'Available from the start of the game in the Velvet Room (female route only). Social Link (Empress) ranks up by completing his requests throughout the game — exclusive to the Female Protagonist route.',
    skills:['Request Quests','Compendium Access','Empress S.Link (Female)','Secret Boss Fight']
  },
  {
    id:20, filter:'npc', rt:'npc',
    name:'Igor', role:'Velvet Room Master',
    arcana:'Fool', persona:'N/A',
    bday:'Unknown', weapon:'N/A', routeLabel:'Both Routes', va:'Isamu Tanonaka (JP)',
    img:'', initial:'IG',
    desc:'The enigmatic long-nosed master of the Velvet Room who facilitates Persona fusion for the protagonist. Igor has appeared throughout the Persona series as a constant guide to Wild Card users. He speaks cryptically but always with the protagonist\'s best interests at heart, overseeing their journey toward their ultimate fate.',
    unlock:'Available immediately from the first Velvet Room visit. Not a Social Link in P3P — he is the Velvet Room host and fusion master for the entire game.',
    skills:['Persona Fusion','Compendium Registry','Special Fusion','Series Constant']
  },
  {
    id:21, filter:'npc', rt:'npc',
    name:'Pharos', role:'Mysterious Child',
    arcana:'Death', persona:'Thanatos (fragment)',
    bday:'Unknown', weapon:'N/A', routeLabel:'Both Routes', va:'Akira Ishida (JP)',
    img:'', initial:'PH',
    desc:'A mysterious young boy who appears in the protagonist\'s dreams, visiting their dorm room at night. Pharos speaks in riddles and seems deeply connected to the protagonist\'s fate and the nature of Death. His true identity is one of the game\'s most significant revelations and is tied directly to the game\'s climax.',
    unlock:'Appears automatically through story events — he visits the protagonist\'s dorm room at night beginning early in the game. Ranking up conversations with him advances the Death Arcana Social Link (both routes).',
    skills:['Death Arcana S.Link','Night Visits Only','Key Story Role','Connected to Ryoji']
  },
  {
    id:22, filter:'npc', rt:'npc',
    name:'Nyx Avatar', role:'Final Boss · Goddess of Death',
    arcana:'All 12 Arcana', persona:'Erebus / Nyx',
    bday:'Unknown', weapon:'Cosmic Power', routeLabel:'Both Routes (final boss)', va:'N/A',
    img:'', initial:'NX',
    desc:'The true final boss of Persona 3 and the ultimate obstacle standing between humanity and destruction. Nyx Avatar manifests through 12 arcana phases, each with different weaknesses and abilities. Defeating it requires the bonds the protagonist has built throughout the entire game — their Social Links literally empower the finishing blow.',
    unlock:'Appears at the top of Tartarus on January 31st during the final confrontation. All 12 phases must be overcome. Recommended level: 75+. Ensure all Social Links are maxed before this date for the true ending.',
    skills:['12 Arcana Phases','All Element Coverage','Moonless Gown','Death Incarnate']
  },
  {
    id:23, filter:'npc', rt:'npc',
    name:'Kenji Tomochika', role:'Classmate · Social Link',
    arcana:'Magician', persona:'N/A',
    bday:'April 29', weapon:'N/A', routeLabel:'Both Routes', va:'N/A',
    img:'', initial:'KJ',
    desc:'The male protagonist\'s cheerful classmate who has an enthusiastic (and comedic) crush on a female teacher at Gekkoukan. His Social Link explores themes of youthful infatuation, growing up, and what it means to pursue impossible ideals. Ranking up his link is straightforward and available from early April.',
    unlock:'Social Link (Magician) available from April by talking to him at Gekkoukan High. Available on Male route. Spend time with him after school to progress his link.',
    skills:['Magician S.Link','Available April','Male Route Only','Comedy Relief']
  },
  {
    id:24, filter:'npc', rt:'fem',
    name:'Hidetoshi Odagiri', role:'Student Council · Social Link',
    arcana:'Emperor', persona:'N/A',
    bday:'August 8', weapon:'N/A', routeLabel:'Female Route Only', va:'N/A',
    img:'', initial:'HO',
    desc:'A strict and principled member of the student council who takes rules extremely seriously. Hidetoshi\'s Social Link explores themes of justice, authority and what it truly means to uphold principles in a flawed world. His arc has surprising emotional depth beneath his rigid exterior.',
    unlock:'Social Link (Emperor) available on Female route from May by joining the Student Council. Spend time with him at the student council room to progress the link.',
    skills:['Emperor S.Link (FeMC)','Available May','Student Council','Justice Theme']
  },
  {
    id:25, filter:'npc', rt:'npc',
    name:'Maiko Oohashi', role:'Child at Shrine · Social Link',
    arcana:'Hanged Man', persona:'N/A',
    bday:'Unknown', weapon:'N/A', routeLabel:'Both Routes', va:'N/A',
    img:'', initial:'MO',
    desc:'A young girl who can be found at the shrine near the school, struggling with her parents\' impending divorce. Her Social Link is one of the most emotionally affecting in the game — deceptively simple on the surface but deeply moving. She also has a connection to Koromaru\'s backstory at the shrine.',
    unlock:'Social Link (Hanged Man) available from May on weekends at the Naganaki Shrine. Available on both routes. Bring Weird Takoyaki or Takoyaki snacks to speed up link progression.',
    skills:['Hanged Man S.Link','Weekend Only','Shrine Location','Emotional Storyline']
  },
];

let currentFilter = 'all';

/* ── HELPERS ── */
function routeClass(rt) {
  return { starter:'rt-starter', story:'rt-story', event:'rt-event', fem:'rt-fem', both:'rt-both', optional:'rt-optional' }[rt] || 'rt-story';
}
function routeLabel(rt) {
  return { starter:'Starter', story:'Story', event:'Event', fem:'FeMC Only', both:'Both', optional:'Other' }[rt] || rt;
}

/* ── BUILD GRID ── */
/* ── CUSTOM IMAGE STORE (sessionStorage so images persist through tab) ── */
const CustomImages = {
  get(id)       { try { return sessionStorage.getItem('p3p_img_' + id); } catch(e) { return null; } },
  set(id, data) { try { sessionStorage.setItem('p3p_img_' + id, data); } catch(e) {} },
};

function buildGrid() {
  const g = document.getElementById('grid');
  g.innerHTML = '';
  CHARS.forEach((c, i) => {
    const show      = currentFilter === 'all' || c.filter === currentFilter;
    const div       = document.createElement('div');
    const customSrc = CustomImages.get(c.id);
    const imgSrc    = customSrc || c.img || '';
    const hasPhoto  = !!(customSrc || c.img);

    // New chars without a default photo get the empty-slot style
    div.className = 'char-card' + (show ? '' : ' hidden') + (!hasPhoto ? ' empty-slot' : '');
    div.style.animationDelay = (i * 0.045) + 's';
    div.onclick = () => openModal(c);
    const shortUnlock = c.unlock.length > 90 ? c.unlock.substring(0, 87) + '...' : c.unlock;

    // Upload button: always visible on empty slots, hover-only on filled ones
    const uploadClass = hasPhoto ? 'upload-btn' : 'upload-btn upload-btn-visible';
    const uploadLabel = hasPhoto ? 'Change Photo' : 'Add Photo';

    div.innerHTML = `
      <div class="card-portrait">
        <div class="portrait-placeholder">${c.initial}</div>
        ${imgSrc ? `<img class="portrait-img" src="${imgSrc}" alt="${c.name}"
          onload="this.style.opacity=1;this.previousElementSibling.style.display='none'"
          onerror="this.style.display='none';this.previousElementSibling.style.display='flex'"
          style="opacity:0;transition:opacity 0.5s;">` : ''}
        <div class="portrait-overlay"></div>
        <div class="p-arcana">${c.arcana}</div>
        <div class="p-route ${routeClass(c.filter)}">${routeLabel(c.filter)}</div>
        <button class="${uploadClass}" onclick="event.stopPropagation();triggerUpload(${c.id})">+ ${uploadLabel}</button>
        <input class="upload-input" type="file" id="upload-${c.id}" accept="image/*" onchange="handleUpload(${c.id}, this)">
      </div>
      <div class="card-body">
        <div><div class="card-name">${c.name}</div><div class="card-role">${c.role}</div></div>
        <div class="card-hr"></div>
        <div class="card-meta">
          <div class="meta-i"><span class="meta-l">Persona</span><span class="meta-v">${c.persona.split('\u2192')[0].trim()}</span></div>
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

/* ── UPLOAD HANDLERS ── */
window.triggerUpload = function(id) {
  const input = document.getElementById('upload-' + id);
  if (input) input.click();
};

window.handleUpload = function(id, input) {
  const file = input.files[0];
  if (!file) return;

  // Validate it's an image
  if (!file.type.startsWith('image/')) {
    if (typeof showToast !== 'undefined') showToast('Please select an image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;

    // Save to session storage
    CustomImages.set(id, dataUrl);

    // Update all portrait images for this character (card + modal)
    document.querySelectorAll('.char-card').forEach((card, i) => {
      if (window.CHARS[i]?.id === id) {
        const img = card.querySelector('.portrait-img');
        const ph  = card.querySelector('.portrait-placeholder');
        if (img) {
          img.src = dataUrl;
          img.style.opacity = '1';
          if (ph) ph.style.display = 'none';
        }
      }
    });

    // Update CHARS data so modal also shows new image
    const char = window.CHARS.find(c => c.id === id);
    if (char) char._customImg = dataUrl;

    if (typeof showToast !== 'undefined') showToast('✓ Photo updated successfully');
  };
  reader.readAsDataURL(file);
  // Reset input so same file can be re-selected
  input.value = '';
};

/* ── MODAL UPLOAD HANDLER ── */
window.handleModalUpload = function(input) {
  const file = input.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  // Find current modal character by name
  const name = document.getElementById('m-name')?.textContent;
  const char = window.CHARS.find(c => c.name === name);
  if (!char) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    CustomImages.set(char.id, dataUrl);
    char._customImg = dataUrl;

    // Update modal image
    const mImg = document.getElementById('m-img');
    if (mImg) { mImg.src = dataUrl; mImg.style.opacity = '1'; }

    // Update card image too
    document.querySelectorAll('.char-card').forEach((card, i) => {
      if (window.CHARS[i]?.id === char.id) {
        const img = card.querySelector('.portrait-img');
        const ph  = card.querySelector('.portrait-placeholder');
        if (img) { img.src = dataUrl; img.style.opacity = '1'; if (ph) ph.style.display = 'none'; }
      }
    });

    if (typeof showToast !== 'undefined') showToast('✓ Photo updated for ' + char.name);
  };
  reader.readAsDataURL(file);
  input.value = '';
};

/* ── FILTER ── */
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

/* ── LIVE SEARCH with highlight ── */
function liveSearch(v) {
  v = v.toLowerCase();
  document.querySelectorAll('.char-card').forEach((card, i) => {
    const c        = CHARS[i];
    const match    = !v || c.name.toLowerCase().includes(v) || c.arcana.toLowerCase().includes(v) || c.persona.toLowerCase().includes(v) || c.role.toLowerCase().includes(v);
    const filterOk = currentFilter === 'all' || c.filter === currentFilter;
    card.classList.toggle('hidden', !(match && filterOk));
    // highlight name
    const nameEl = card.querySelector('.card-name');
    if (!nameEl) return;
    if (v && c.name.toLowerCase().includes(v)) {
      const regex = new RegExp(`(${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      nameEl.innerHTML = c.name.replace(regex, '<span class="highlight">$1</span>');
    } else {
      nameEl.textContent = c.name;
    }
  });
  updateCount();
}

/* ── COUNT ── */
function updateCount() {
  const n = document.querySelectorAll('.char-card:not(.hidden)').length;
  document.getElementById('rcount').textContent = n + ' character' + (n !== 1 ? 's' : '');
}

/* ── MODAL ── */
function openModal(c) {
  const img = document.getElementById('m-img');
  const ph  = document.getElementById('m-ph');
  img.style.display = 'block'; ph.style.display = 'none';
  // Use custom uploaded image if available
  const customSrc = CustomImages.get(c.id);
  img.src = customSrc || c._customImg || c.img;
  img.alt = c.name;
  ph.textContent = c.initial;
  document.getElementById('m-name').textContent    = c.name;
  document.getElementById('m-role').textContent    = c.role;
  document.getElementById('m-arcana').textContent  = c.arcana;
  document.getElementById('m-persona').textContent = c.persona;
  document.getElementById('m-bday').textContent    = c.bday;
  document.getElementById('m-weapon').textContent  = c.weapon;
  document.getElementById('m-route').textContent   = c.routeLabel;
  document.getElementById('m-va').textContent      = c.va;
  document.getElementById('m-desc').textContent    = c.desc;
  document.getElementById('m-unlock').textContent  = c.unlock;
  document.getElementById('m-skills').innerHTML    = c.skills.map(s => `<span class="skill">${s}</span>`).join('');
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

/* ── SECTION SWITCH ── */
function showSec(id, btn) {
  // Toggle ALL known sections
  ['chars','about','classes','tartarus','party'].forEach(s => {
    const el = document.getElementById(s + '-content');
    if (el) el.classList.toggle('visible', id === s);
  });
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelector('.page-main').scrollIntoView({ behavior: 'smooth' });
  // Save section to cookie
  if (typeof SectionMemory !== 'undefined') SectionMemory.save(id);
  // Lazy-init new sections
  if (id === 'tartarus' && !window._tartarusInit) { if(typeof initTartarus==='function'){initTartarus();} window._tartarusInit = true; }
  if (id === 'party'    && !window._partyInit)    { if(typeof initParty==='function'){initParty();}       window._partyInit = true; }
}

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── ANIMATED COUNTERS ── */
function animateCounters() {
  const counters = document.querySelectorAll('.hstat-n');
  const targets  = [14, 2, 12];
  const duration = 1800;
  const frameRate = 1000 / 60;

  counters.forEach((el, i) => {
    const target      = targets[i];
    const totalFrames = Math.round(duration / frameRate);
    let frame         = 0;
    el.textContent    = '0';

    setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = 1 - Math.pow(2, -10 * (frame / totalFrames));
        const current  = Math.round(progress * target);
        el.textContent = current;
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 80);
        if (frame >= totalFrames) {
          el.textContent = target;
          clearInterval(interval);
        }
      }, frameRate);
    }, i * 200);
  });
}

/* ── INIT ── */
buildGrid();
animateCounters();

/* ═══════════════════════════════════════════
   CLASS GUIDE DATA + LOGIC
═══════════════════════════════════════════ */

const CLASS_DATA = {
  april: {
    name: 'April', sub: 'School begins — first classes',
    entries: [
      { date: 'Apr 9',  type: 'class', subject: 'Modern Japanese',    question: 'What type of literary expression is used in this poem?', answer: 'Personification', reward: '+Academics' },
      { date: 'Apr 11', type: 'class', subject: 'Mathematics',        question: 'What is the name for a number only divisible by 1 and itself?', answer: 'Prime number', reward: '+Academics' },
      { date: 'Apr 14', type: 'class', subject: 'Classical Japanese', question: 'What does the word "aware" mean in classical Japanese?', answer: 'Pathos of things', reward: '+Academics' },
      { date: 'Apr 18', type: 'class', subject: 'Modern Japanese',    question: 'Who wrote "I Am a Cat"?', answer: 'Natsume Soseki', reward: '+Academics' },
      { date: 'Apr 23', type: 'class', subject: 'Health',             question: 'What is the name of the muscle that controls the pupil?', answer: 'Sphincter pupillae', reward: '+Academics' },
      { date: 'Apr 25', type: 'class', subject: 'Mathematics',        question: 'If a triangle has angles 90° and 45°, what is the third?', answer: '45 degrees', reward: '+Academics' },
      { date: 'Apr 27', type: 'free',  subject: 'No class',           question: 'Free afternoon — no Q&A', answer: 'Study at dorm or Wakatsu', reward: 'Free Time' },
    ]
  },
  may: {
    name: 'May', sub: 'First midterm exam period',
    entries: [
      { date: 'May 2',  type: 'class', subject: 'Classical Japanese', question: 'What period is "The Tale of Genji" from?', answer: 'Heian period', reward: '+Academics' },
      { date: 'May 7',  type: 'class', subject: 'Modern Japanese',    question: 'What is the literary term for giving human traits to objects?', answer: 'Personification', reward: '+Academics' },
      { date: 'May 10', type: 'class', subject: 'Health',             question: 'What organ produces insulin?', answer: 'Pancreas', reward: '+Academics' },
      { date: 'May 13', type: 'class', subject: 'Mathematics',        question: 'What do you call the longest side of a right triangle?', answer: 'Hypotenuse', reward: '+Academics' },
      { date: 'May 19', type: 'test',  subject: '📝 MIDTERM EXAMS', question: '', answer: '', reward: 'Top Score Bonus', isExam: true,
        examQA: [
          { q: 'What period is The Tale of Genji from?',           a: 'Heian period' },
          { q: 'What is "aware" in classical Japanese?',           a: 'Pathos of things' },
          { q: 'What muscle controls the pupil?',                  a: 'Sphincter pupillae' },
          { q: 'What is a number divisible only by 1 and itself?', a: 'Prime number' },
          { q: 'What is the longest side of a right triangle?',    a: 'Hypotenuse' },
        ]
      },
      { date: 'May 26', type: 'free',  subject: 'Post-exam free day', question: 'Relax or Social Link', answer: 'Great day for Social Links', reward: 'Free Time' },
    ]
  },
  june: {
    name: 'June', sub: 'Rainy season — Fuuka joins SEES',
    entries: [
      { date: 'Jun 4',  type: 'class', subject: 'Mathematics',        question: 'What is the formula for the area of a circle?', answer: 'πr²', reward: '+Academics' },
      { date: 'Jun 8',  type: 'class', subject: 'Modern Japanese',    question: 'Who is the author of "No Longer Human"?', answer: 'Osamu Dazai', reward: '+Academics' },
      { date: 'Jun 13', type: 'class', subject: 'Health',             question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', reward: '+Academics' },
      { date: 'Jun 15', type: 'class', subject: 'Classical Japanese', question: 'The Manyoshu is the oldest what?', answer: 'Collection of Japanese poetry', reward: '+Academics' },
      { date: 'Jun 20', type: 'class', subject: 'Modern Japanese',    question: 'What literary movement did Soseki belong to?', answer: 'Naturalism', reward: '+Academics' },
      { date: 'Jun 22', type: 'free',  subject: 'Rainy afternoon',    question: 'No class scheduled', answer: 'Study, read library books or hang out', reward: 'Free Time' },
      { date: 'Jun 27', type: 'class', subject: 'Mathematics',        question: 'What is the derivative of x²?', answer: '2x', reward: '+Academics' },
    ]
  },
  july: {
    name: 'July', sub: 'Final exams — Ken & Koromaru join',
    entries: [
      { date: 'Jul 3',  type: 'class', subject: 'Health',             question: 'What vitamin is produced by sunlight?', answer: 'Vitamin D', reward: '+Academics' },
      { date: 'Jul 7',  type: 'class', subject: 'Classical Japanese', question: 'What is a "renga"?', answer: 'Linked verse poetry', reward: '+Academics' },
      { date: 'Jul 10', type: 'class', subject: 'Modern Japanese',    question: 'What is onomatopoeia?', answer: 'Words that imitate sounds', reward: '+Academics' },
      { date: 'Jul 14', type: 'exam',  subject: '📝 FINAL EXAMS', question: '', answer: '', reward: 'Top Score Bonus', isExam: true,
        examQA: [
          { q: 'What is the formula for the area of a circle?',    a: 'πr²' },
          { q: 'Who wrote "No Longer Human"?',                     a: 'Osamu Dazai' },
          { q: 'What is the powerhouse of the cell?',              a: 'Mitochondria' },
          { q: 'What is the Manyoshu?',                            a: 'Oldest collection of Japanese poetry' },
          { q: 'What is the derivative of x²?',                   a: '2x' },
          { q: 'What vitamin is produced by sunlight?',            a: 'Vitamin D' },
          { q: 'What is a renga?',                                 a: 'Linked verse poetry' },
        ]
      },
      { date: 'Jul 20', type: 'free',  subject: 'Summer begins',      question: 'Summer break starts', answer: 'Focus on Tartarus and Social Links', reward: 'Free Time' },
    ]
  },
  august: {
    name: 'August', sub: 'Summer break — Aigis joins SEES',
    entries: [
      { date: 'Aug 2',  type: 'free',  subject: 'Summer break',       question: 'No school — free all day', answer: 'Great time for Social Links and Tartarus', reward: 'Free Time' },
      { date: 'Aug 7',  type: 'class', subject: 'Supplementary',      question: 'What is the speed of light?', answer: '300,000 km/s', reward: '+Academics' },
      { date: 'Aug 9',  type: 'class', subject: 'Supplementary',      question: 'What does DNA stand for?', answer: 'Deoxyribonucleic acid', reward: '+Academics' },
      { date: 'Aug 21', type: 'class', subject: 'Supplementary',      question: 'What is the atomic number of carbon?', answer: '6', reward: '+Academics' },
      { date: 'Aug 30', type: 'free',  subject: 'Summer ends',        question: 'Last day of summer break', answer: 'Prepare for fall semester', reward: 'Free Time' },
    ]
  },
  september: {
    name: 'September', sub: 'Fall semester — Shinjiro returns',
    entries: [
      { date: 'Sep 1',  type: 'class', subject: 'Modern Japanese',    question: 'What is a "haiku"?', answer: '17 syllable poem — 5/7/5', reward: '+Academics' },
      { date: 'Sep 5',  type: 'class', subject: 'Health',             question: 'What is the normal human body temperature?', answer: '36.5°C / 98.6°F', reward: '+Academics' },
      { date: 'Sep 10', type: 'class', subject: 'Classical Japanese', question: 'What is "mono no aware"?', answer: 'Appreciation of impermanence', reward: '+Academics' },
      { date: 'Sep 14', type: 'class', subject: 'Mathematics',        question: 'What is the value of pi to 4 decimal places?', answer: '3.1415', reward: '+Academics' },
      { date: 'Sep 17', type: 'free',  subject: 'Autumn festival',    question: 'No class — school event', answer: 'Spend time with party members', reward: 'Free Time' },
      { date: 'Sep 21', type: 'class', subject: 'Modern Japanese',    question: 'What is "stream of consciousness" writing?', answer: 'Narrative depicting thought processes', reward: '+Academics' },
      { date: 'Sep 25', type: 'class', subject: 'Health',             question: 'How many bones are in the adult human body?', answer: '206', reward: '+Academics' },
    ]
  },
  october: {
    name: 'October', sub: 'Second midterm — Shinjiro deadline',
    entries: [
      { date: 'Oct 3',  type: 'class', subject: 'Classical Japanese', question: 'Who wrote "The Pillow Book"?', answer: 'Sei Shonagon', reward: '+Academics' },
      { date: 'Oct 6',  type: 'class', subject: 'Mathematics',        question: 'What is the square root of 144?', answer: '12', reward: '+Academics' },
      { date: 'Oct 10', type: 'class', subject: 'Modern Japanese',    question: 'What is a metaphor?', answer: 'Direct comparison without like or as', reward: '+Academics' },
      { date: 'Oct 14', type: 'test',  subject: '📝 MIDTERM EXAMS', question: '', answer: '', reward: 'Top Score Bonus', isExam: true,
        examQA: [
          { q: 'What is a haiku?',                                 a: '17 syllable poem — 5/7/5' },
          { q: 'What is mono no aware?',                           a: 'Appreciation of impermanence' },
          { q: 'What is stream of consciousness?',                 a: 'Narrative depicting thought processes' },
          { q: 'Who wrote The Pillow Book?',                       a: 'Sei Shonagon' },
          { q: 'What is the square root of 144?',                  a: '12' },
          { q: 'How many bones in the adult human body?',          a: '206' },
        ]
      },
      { date: 'Oct 22', type: 'free',  subject: 'Post-exam rest',     question: 'Free time after exams', answer: 'Social Links or Tartarus', reward: 'Free Time' },
    ]
  },
  november: {
    name: 'November', sub: 'Ryoji arrives — story accelerates',
    entries: [
      { date: 'Nov 4',  type: 'class', subject: 'Health',             question: 'What part of the eye detects color?', answer: 'Cones', reward: '+Academics' },
      { date: 'Nov 7',  type: 'class', subject: 'Modern Japanese',    question: 'What is an "unreliable narrator"?', answer: 'A narrator whose credibility is compromised', reward: '+Academics' },
      { date: 'Nov 12', type: 'class', subject: 'Mathematics',        question: 'What is the sum of angles in a triangle?', answer: '180 degrees', reward: '+Academics' },
      { date: 'Nov 17', type: 'class', subject: 'Classical Japanese', question: 'The Kojiki is Japan\'s oldest what?', answer: 'Historical chronicle', reward: '+Academics' },
      { date: 'Nov 20', type: 'class', subject: 'Health',             question: 'What is the largest organ in the human body?', answer: 'Skin', reward: '+Academics' },
      { date: 'Nov 24', type: 'free',  subject: 'Autumn holiday',     question: 'No class scheduled', answer: 'Key Social Link day — prioritize Ryoji (FeMC)', reward: 'Free Time' },
    ]
  },
  december: {
    name: 'December', sub: 'Final exams — critical story choices',
    entries: [
      { date: 'Dec 3',  type: 'class', subject: 'Modern Japanese',    question: 'What is the climax of a story?', answer: 'Point of highest tension', reward: '+Academics' },
      { date: 'Dec 6',  type: 'class', subject: 'Mathematics',        question: 'What is 15% of 200?', answer: '30', reward: '+Academics' },
      { date: 'Dec 10', type: 'class', subject: 'Health',             question: 'What is the function of red blood cells?', answer: 'Transport oxygen', reward: '+Academics' },
      { date: 'Dec 14', type: 'exam',  subject: '📝 FINAL EXAMS', question: '', answer: '', reward: 'Top Score Bonus', isExam: true,
        examQA: [
          { q: 'What part of the eye detects color?',              a: 'Cones' },
          { q: 'What is an unreliable narrator?',                  a: 'A narrator whose credibility is compromised' },
          { q: 'What is the sum of angles in a triangle?',         a: '180 degrees' },
          { q: 'The Kojiki is Japan\'s oldest what?',              a: 'Historical chronicle' },
          { q: 'What is the largest organ in the human body?',     a: 'Skin' },
          { q: 'What is 15% of 200?',                              a: '30' },
          { q: 'What transports oxygen in blood?',                 a: 'Red blood cells' },
        ]
      },
      { date: 'Dec 24', type: 'free',  subject: 'Christmas Eve',      question: 'No class — story event', answer: 'Critical story night — no free activities', reward: 'Story Event' },
    ]
  },
  january: {
    name: 'January', sub: 'Final stretch — endgame approaches',
    entries: [
      { date: 'Jan 8',  type: 'class', subject: 'Modern Japanese',    question: 'What is the resolution of a story called?', answer: 'Denouement', reward: '+Academics' },
      { date: 'Jan 13', type: 'class', subject: 'Classical Japanese', question: 'What is "wabi-sabi"?', answer: 'Beauty in imperfection and impermanence', reward: '+Academics' },
      { date: 'Jan 18', type: 'class', subject: 'Health',             question: 'What is the medical term for the kneecap?', answer: 'Patella', reward: '+Academics' },
      { date: 'Jan 21', type: 'class', subject: 'Mathematics',        question: 'What is the Pythagorean theorem?', answer: 'a² + b² = c²', reward: '+Academics' },
      { date: 'Jan 25', type: 'free',  subject: 'Last free days',     question: 'Final weeks before endgame', answer: 'Max remaining Social Links now', reward: 'Free Time' },
      { date: 'Jan 31', type: 'free',  subject: 'January ends',       question: 'February is story-locked', answer: 'Ensure all Social Links are maxed', reward: '⚠️ Last Chance' },
    ]
  }
};

function setMonth(month, btn) {
  document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMonth(month);
}

function renderMonth(month) {
  const data    = CLASS_DATA[month];
  const content = document.getElementById('month-content');
  if (!data || !content) return;

  let html = `
    <div class="month-header">
      <span class="month-name">${data.name}</span>
      <span class="month-sub">${data.sub}</span>
    </div>
    <div class="entries-list">
  `;

  data.entries.forEach(e => {
    if (e.isExam) {
      const qaRows = e.examQA.map(qa => `
        <div class="exam-item">
          <div class="exam-q">${qa.q}</div>
          <div class="exam-a">${qa.a}</div>
        </div>`).join('');
      html += `
        <div class="exam-block">
          <div class="exam-block-title">
            ${e.subject} &nbsp;·&nbsp; ${e.date}
            <span style="font-size:10px;letter-spacing:0.15em;color:var(--muted);font-family:'DM Sans',sans-serif;font-weight:300;">— Answer all correctly for top score bonus</span>
          </div>
          <div class="exam-qa">${qaRows}</div>
        </div>`;
    } else {
      const typeLabel = { class:'Class', free:'Free', test:'Mid-term', exam:'Exam' }[e.type] || e.type;
      html += `
        <div class="entry">
          <div class="entry-date">${e.date.replace(/\w+ /,'')}</div>
          <div class="entry-type"><span class="entry-type-badge type-${e.type}">${typeLabel}</span></div>
          <div class="entry-content">
            <div class="entry-subject">${e.subject}</div>
            ${e.question ? `<div class="entry-question">${e.question}</div>` : ''}
            ${e.answer   ? `<div class="entry-answer">${e.answer}</div>`   : ''}
          </div>
          <div class="entry-reward"><span class="reward-tag">${e.reward}</span></div>
        </div>`;
    }
  });

  html += `</div>`;
  content.innerHTML = html;
}

/* Override showSec to include classes tab */
window.showSec = function (id, btn) {
  document.getElementById('chars-content').classList.toggle('visible',   id === 'chars');
  document.getElementById('about-content').classList.toggle('visible',   id === 'about');
  const cc = document.getElementById('classes-content');
  if (cc) cc.classList.toggle('visible', id === 'classes');
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelector('.page-main').scrollIntoView({ behavior: 'smooth' });
  if (id === 'classes') {
    const mc = document.getElementById('month-content');
    if (mc && !mc.innerHTML.trim()) renderMonth('april');
  }
};
