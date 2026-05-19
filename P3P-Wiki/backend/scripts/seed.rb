#!/usr/bin/env ruby
# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/scripts/seed.rb
# Seeds all 25 characters into the database
# via the FastAPI REST API
#
# Usage: ruby scripts/seed.rb
# Requires: API running on localhost:8000
# ═══════════════════════════════════════════

require 'net/http'
require 'json'
require 'uri'

API = 'http://localhost:8000/api'

CHARACTERS = [
  # ── SEES ──
  { id:1,  name:'Male Protagonist',    role:'Leader · Wild Card',
    arcana:'Fool',        persona:'Orpheus → Any Arcana',
    bday:'April 7',       weapon:'One-handed Swords',
    route_label:'Male Route', va:'Akira Ishida (JP)',
    filter_type:'starter', initial:'M',
    img_path:'assets/images/characters/Male-Protagonist.jpeg',
    desc_text:'The original protagonist of Persona 3. A transfer student at Gekkoukan High who possesses the Wild Card — the rare ability to wield every Arcana. His bonds with SEES define a story of mortality, friendship, and fate.',
    unlock_text:'Select the Male route at the title screen. Available from the very beginning.',
    skills:'["Wild Card","All Arcana Fusion","Evoker Combat","Protagonist Bonuses"]' },

  { id:2,  name:'Female Protagonist',  role:'Leader · Wild Card',
    arcana:'Fool',        persona:'Orpheus Femina → Any Arcana',
    bday:'April 7',       weapon:'One-handed Swords',
    route_label:'Female Route Only', va:'Akiko Yajima (JP)',
    filter_type:'fem', initial:'F',
    img_path:'assets/images/characters/Female-Protagonist.jpeg',
    desc_text:'The iconic protagonist introduced exclusively in P3P. Same Wild Card ability but a completely different emotional journey — unique Social Links and romance options with Shinjiro and Ryoji.',
    unlock_text:'Select the Female route when prompted at the beginning of the game.',
    skills:'["Wild Card","All Arcana Fusion","Exclusive Social Links","Shinjiro & Ryoji Romance"]' },

  { id:3,  name:'Yukari Takeba',        role:'Healer · Wind Mage',
    arcana:'Lovers',      persona:'Io → Isis',
    bday:'March 21',      weapon:'Bow & Arrow',
    route_label:'Both Routes', va:'Megumi Toyoguchi (JP)',
    filter_type:'starter', initial:'YK',
    img_path:'assets/images/characters/Yukari-Takeba.jpeg',
    desc_text:'A popular second-year who joined SEES to uncover the truth about her father\'s death. Primary healer with strong Wind magic and recovery spells.',
    unlock_text:'Automatically joins from the very beginning on both routes.',
    skills:'["Garula / Garudyne","Media / Mediarama","Recarm","High Agility"]' },

  { id:4,  name:'Junpei Iori',          role:'Striker · Fire Mage',
    arcana:'Magician',    persona:'Hermes → Trismegistus',
    bday:'December 27',   weapon:'Two-handed Sword',
    route_label:'Both Routes', va:'Kosuke Toriumi (JP)',
    filter_type:'starter', initial:'JP',
    img_path:'assets/images/characters/Junpei-Iori.jpeg',
    desc_text:'The protagonist\'s best friend hiding insecurity beneath humor. His arc is shaped by a heartbreaking relationship with Strega member Chidori.',
    unlock_text:'Automatically joins from the very start on both routes.',
    skills:'["Agidyne / Maragidyne","Slash Attack","Brave Blade","High Strength"]' },

  { id:5,  name:'Akihiko Sanada',       role:'Brawler · Thunder Mage',
    arcana:'Emperor',     persona:'Polydeuces → Caesar',
    bday:'September 22',  weapon:'Gloves / Fists',
    route_label:'Both Routes', va:'Hikaru Midorikawa (JP)',
    filter_type:'story', initial:'AK',
    img_path:'assets/images/characters/Akihiko-Sanada.jpeg',
    desc_text:'A legendary boxing star who co-founded SEES with Mitsuru. Driven by survivor guilt over the death of his childhood friend Shinjiro.',
    unlock_text:'Joins automatically via story progression in April.',
    skills:'["Ziodyne / Maziodyne","Survive Theurgy","Powerful Strikes","High Endurance"]' },

  { id:6,  name:'Mitsuru Kirijo',       role:'Commander · Ice Mage',
    arcana:'Empress',     persona:'Penthesilea → Artemisia',
    bday:'May 8',         weapon:'Rapier',
    route_label:'Both Routes', va:'Rie Tanaka (JP)',
    filter_type:'story', initial:'MK',
    img_path:'assets/images/characters/Mitsuru-Kirijo.jpeg',
    desc_text:'The sophisticated leader of SEES and Kirijo Group heiress. P3P upgraded her from mission operator to fully playable battle member.',
    unlock_text:'Joins as controllable member through story progression in May.',
    skills:'["Mabufudyne","Marin Karin (Charm)","Pierce Attacks","High Magic Stat"]' },

  { id:7,  name:'Fuuka Yamagishi',      role:'Navigator · Support',
    arcana:'Priestess',   persona:'Lucia → Juno',
    bday:'October 9',     weapon:'N/A (Navigator)',
    route_label:'Both Routes', va:'Mamiko Noto (JP)',
    filter_type:'story', initial:'FK',
    img_path:'assets/images/characters/Fuuka-Yamagishi.jpeg',
    desc_text:'A shy student who becomes navigator. Her Persona scans enemies and detects weaknesses. Infamously terrible at cooking.',
    unlock_text:'Joins automatically following story events in June.',
    skills:'["Enemy Analysis","Scan Weaknesses","Party HP/SP Restore","Radar Support"]' },

  { id:8,  name:'Ken Amada',            role:'Avenger · Light Mage',
    arcana:'Justice',     persona:'Nemesis → Kala-Nemi',
    bday:'September 27',  weapon:'Spear / Extendable Rod',
    route_label:'Both Routes', va:'Megumi Ogata (JP)',
    filter_type:'story', initial:'KA',
    img_path:'assets/images/characters/Ken-Amada.jpeg',
    desc_text:'An elementary-school-aged boy driven by a personal vendetta. Far more mature than his age suggests. His arc explores grief and justice.',
    unlock_text:'Joins automatically through story progression in July.',
    skills:'["Hamaon / Mahama","Almighty Skills","Spear Attacks","Mediarama"]' },

  { id:9,  name:'Koromaru',             role:'Shadow Hunter · Dark Mage',
    arcana:'Strength',    persona:'Cerberus',
    bday:'Unknown',       weapon:'Knife (in mouth)',
    route_label:'Both Routes', va:'N/A',
    filter_type:'story', initial:'KO',
    img_path:'assets/images/characters/Koromaru.jpeg',
    desc_text:'A white Shiba Inu loyal to his late owner who awakened to his Persona through sheer devotion. Dual Fire and Dark attacker.',
    unlock_text:'Joins automatically in July alongside Ken.',
    skills:'["Mudoon / Mamudo","Agidyne / Maragidyne","High Agility","Evade Slash"]' },

  { id:10, name:'Shinjiro Aragaki',     role:'Former SEES · Berserker',
    arcana:'Hierophant',  persona:'Castor',
    bday:'January 1',     weapon:'Axe / Blunt Weapons',
    route_label:'Both (limited) · Romance on FeMC', va:'Kazuya Nakai (JP)',
    filter_type:'event', initial:'SK',
    img_path:'assets/images/characters/Shinjiro-Aragaki.jpg',
    desc_text:'A former SEES member consumed by guilt over a past accident. Hardest-hitting party member. Romance Social Link on the Female route.',
    unlock_text:'Rejoins in September. FeMC: max Hierophant S.Link before October 4th.',
    skills:'["Gigantic Fist","Powerful Blunt Attacks","High Strength Stat","Late Game Monster"]' },

  { id:11, name:'Aigis',                role:'Android Warrior · Protector',
    arcana:'Chariot → Aeon', persona:'Palladion → Athena',
    bday:'August 8 (activation)', weapon:'Built-in Firearms & Blades',
    route_label:'Both Routes', va:'Maaya Sakamoto (JP)',
    filter_type:'story', initial:'AI',
    img_path:'assets/images/characters/Aigis.jpg',
    desc_text:'An android programmed to protect the protagonist. Gradually develops genuine emotions and self-awareness. One of the most beloved characters in the series.',
    unlock_text:'Joins automatically through story progression in August.',
    skills:'["Orgia Mode","Firearms / Almighty Bullets","Slash Skills","Balanced High Stats"]' },

  { id:12, name:'Ryoji Mochizuki',      role:'Transfer Student · Harbinger',
    arcana:'Death',       persona:'Thanatos',
    bday:'November 8',    weapon:'N/A (Non-playable)',
    route_label:'Both Routes · Social Link on FeMC', va:'Akira Ishida (JP)',
    filter_type:'both', initial:'RY',
    img_path:'assets/images/characters/Ryoji-Mochizuki.jpeg',
    desc_text:'A charismatic transfer student with a devastating secret central to the game\'s climax. Romance Social Link on the Female route.',
    unlock_text:'Appears automatically in November. FeMC: Death Arcana S.Link via conversations.',
    skills:'["Non-playable","Story Role Only","FeMC Romance Social Link","Death Arcana (FeMC)"]' },

  { id:13, name:'Metis',                role:'Android · Aigis\'s Sister',
    arcana:'Hanged Man',  persona:'Psyche',
    bday:'Unknown',       weapon:'Arm Blades',
    route_label:'Not in P3P (FES Only)', va:'Nana Mizuki (JP)',
    filter_type:'optional', initial:'ME',
    img_path:'assets/images/characters/Metis.jpg',
    desc_text:'NOT in P3P. Exclusive to Persona 3 FES The Answer epilogue which was removed in the PSP port.',
    unlock_text:'Unavailable in P3P. Play Persona 3 FES to access her.',
    skills:'["FES Exclusive Only","Not in P3P","Arm Blade Attacks (FES)","Wind Magic (FES)"]' },

  { id:14, name:'Takeharu Kirijo',      role:'Kirijo Group Chairman',
    arcana:'N/A',         persona:'N/A',
    bday:'Unknown',       weapon:'N/A',
    route_label:'Both Routes (NPC)', va:'Unshou Ishizuka (JP)',
    filter_type:'story', initial:'TK',
    img_path:'assets/images/characters/Takeharu-Kirijo.jpeg',
    desc_text:'Mitsuru\'s father and chairman of the Kirijo Group. Central to understanding the origin of the Dark Hour.',
    unlock_text:'Story NPC — appears through plot progression. Not playable.',
    skills:'["Story Character Only","Non-playable","Key Narrative Role"]' },

  # ── STREGA ──
  { id:15, name:'Takaya Sakaki',        role:'Strega Leader · Antagonist',
    arcana:'Tower',       persona:'Hypnos',
    bday:'Unknown',       weapon:'Revolver',
    route_label:'Both Routes (antagonist)', va:'Jouji Nakata (JP)',
    filter_type:'enemy', initial:'TA',
    img_path:'assets/images/characters/Takaya-Sakaki.jpg',
    desc_text:'The nihilistic leader of Strega. Views the end of the Dark Hour as a death sentence and works to destroy SEES. One of P3\'s most memorable antagonists.',
    unlock_text:'Story antagonist — not playable. Upload your own photo.',
    skills:'["Hypnos Persona","Revolver Expert","Nihilistic Philosophy","Megidola (boss)"]' },

  { id:16, name:'Jin Shirato',          role:'Strega Member · Bomber',
    arcana:'Hermit',      persona:'Moros',
    bday:'Unknown',       weapon:'Grenades / Bombs',
    route_label:'Both Routes (antagonist)', va:'Hiroki Tochi (JP)',
    filter_type:'enemy', initial:'JN',
    img_path:'assets/images/characters/Jin-Shirato.jpeg',
    desc_text:'Takaya\'s loyal right-hand. Calculating and analytical. Fiercely devoted to Takaya above all else.',
    unlock_text:'Story antagonist — not playable. Upload your own photo.',
    skills:'["Moros Persona","Bomb Attacks","Bufudyne","Tactical Support"]' },

  { id:17, name:'Chidori Yoshino',      role:'Strega Member · Artist',
    arcana:'Priestess',   persona:'Medea',
    bday:'November 8',    weapon:'Cleaver',
    route_label:'Both Routes (Junpei\'s arc)', va:'Miyuki Sawashiro (JP)',
    filter_type:'enemy', initial:'CH',
    img_path:'assets/images/characters/Chidori-Yoshino.jpeg',
    desc_text:'A quiet Strega member who sketches obsessively. Her emotional bond with Junpei forms one of P3\'s most heartbreaking storylines.',
    unlock_text:'Appears through story events. Not playable. Upload your own photo.',
    skills:'["Medea Persona","Poison Mist","Mediarama","Regenerate 3"]' },

  # ── NPCs ──
  { id:18, name:'Elizabeth',            role:'Velvet Room Attendant',
    arcana:'Fool (special)', persona:'Thanatos (ultimate)',
    bday:'Unknown',       weapon:'Compendium / Magic',
    route_label:'Male Route', va:'Miyuki Sawashiro (JP)',
    filter_type:'npc', initial:'EL',
    img_path:'assets/images/characters/Elizabeth.jpg',
    desc_text:'The Velvet Room attendant for the male protagonist. Cheerful and fascinatingly naive. Issues 55 requests and has a secret boss fight.',
    unlock_text:'Available from Velvet Room (male route). Empress S.Link via 55 requests.',
    skills:'["55 Request Quests","Compendium Access","Empress S.Link (Male)","Secret Boss Fight"]' },

  { id:19, name:'Theodore',             role:'Velvet Room Attendant',
    arcana:'Fool (special)', persona:'Thanatos (ultimate)',
    bday:'Unknown',       weapon:'Compendium / Magic',
    route_label:'Female Route Only', va:'Akira Ishida (JP)',
    filter_type:'fem', initial:'TH',
    img_path:'assets/images/characters/Theodore.png',
    desc_text:'Elizabeth\'s younger brother and Velvet Room attendant for the female protagonist. Earnest and developing emotionally through his bond with FeMC.',
    unlock_text:'Available from Velvet Room (female route only). Empress S.Link via requests.',
    skills:'["Request Quests","Compendium Access","Empress S.Link (Female)","Secret Boss Fight"]' },

  { id:20, name:'Igor',                 role:'Velvet Room Master',
    arcana:'Fool',        persona:'N/A',
    bday:'Unknown',       weapon:'N/A',
    route_label:'Both Routes', va:'Isamu Tanonaka (JP)',
    filter_type:'npc', initial:'IG',
    img_path:'assets/images/characters/Igor.png',
    desc_text:'The enigmatic long-nosed master of the Velvet Room. Facilitates Persona fusion and guides Wild Card users. A series constant.',
    unlock_text:'Available from the first Velvet Room visit. Fusion master throughout the entire game.',
    skills:'["Persona Fusion","Compendium Registry","Special Fusion","Series Constant"]' },

  { id:21, name:'Pharos',               role:'Mysterious Child',
    arcana:'Death',       persona:'Thanatos (fragment)',
    bday:'Unknown',       weapon:'N/A',
    route_label:'Both Routes', va:'Akira Ishida (JP)',
    filter_type:'npc', initial:'PH',
    img_path:'assets/images/characters/Pharos.jpeg',
    desc_text:'A mysterious boy who visits the dorm at night and speaks in riddles. His true identity is one of the game\'s most significant revelations.',
    unlock_text:'Appears automatically at night. Advances the Death Arcana Social Link.',
    skills:'["Death Arcana S.Link","Night Visits Only","Key Story Role","Connected to Ryoji"]' },

  { id:22, name:'Nyx Avatar',           role:'Final Boss · Goddess of Death',
    arcana:'All 12 Arcana', persona:'Erebus / Nyx',
    bday:'Unknown',       weapon:'Cosmic Power',
    route_label:'Both Routes (final boss)', va:'N/A',
    filter_type:'npc', initial:'NX',
    img_path:'assets/images/characters/Nyx.jpg',
    desc_text:'The true final boss. Manifests through 12 arcana phases. Your maxed Social Links literally power the finishing blow.',
    unlock_text:'Appears at top of Tartarus on January 31st. Recommended level 75+.',
    skills:'["12 Arcana Phases","All Element Coverage","Moonless Gown","Death Incarnate"]' },

  { id:23, name:'Kenji Tomochika',      role:'Classmate · Social Link',
    arcana:'Magician',    persona:'N/A',
    bday:'April 29',      weapon:'N/A',
    route_label:'Male Route', va:'N/A',
    filter_type:'npc', initial:'KJ',
    img_path:'assets/images/characters/Kenji-Tomochika.jpg',
    desc_text:'The male protagonist\'s cheerful classmate with an infatuated crush on a female teacher. His Social Link explores youthful idealism.',
    unlock_text:'Magician S.Link — available from April at Gekkoukan. Male route only.',
    skills:'["Magician S.Link","Available April","Male Route Only","Comedy Relief"]' },

  { id:24, name:'Hidetoshi Odagiri',    role:'Student Council · Social Link',
    arcana:'Emperor',     persona:'N/A',
    bday:'August 8',      weapon:'N/A',
    route_label:'Female Route Only', va:'N/A',
    filter_type:'fem', initial:'HO',
    img_path:'assets/images/characters/Hidetoshi-Odagiri.jpeg',
    desc_text:'A strict student council member who takes rules extremely seriously. Surprising emotional depth beneath his rigid exterior.',
    unlock_text:'Emperor S.Link — available on Female route from May in the student council room.',
    skills:'["Emperor S.Link (FeMC)","Available May","Student Council","Justice Theme"]' },

  { id:25, name:'Maiko Oohashi',        role:'Child at Shrine · Social Link',
    arcana:'Hanged Man',  persona:'N/A',
    bday:'Unknown',       weapon:'N/A',
    route_label:'Both Routes', va:'N/A',
    filter_type:'npc', initial:'MO',
    img_path:'assets/images/characters/Maiko-Oohashi.jpeg',
    desc_text:'A young girl at the shrine struggling with her parents\' divorce. One of the most emotionally affecting Social Links in the game.',
    unlock_text:'Hanged Man S.Link — available from May on weekends at Naganaki Shrine. Bring Takoyaki.',
    skills:'["Hanged Man S.Link","Weekend Only","Shrine Location","Emotional Storyline"]' }
].freeze

# ── HTTP HELPER ──
def post(path, body)
  uri  = URI("#{API}#{path}")
  http = Net::HTTP.new(uri.host, uri.port)
  req  = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
  req.body = body.to_json
  http.request(req)
rescue => e
  raise "Request failed: #{e.message}"
end

def api_alive?
  res = Net::HTTP.get_response(URI('http://localhost:8000/'))
  res.code.to_i == 200
rescue
  false
end

# ── MAIN ──
unless api_alive?
  puts "\n❌  API not running. Start it first:"
  puts "    cd backend"
  puts "    pip install -r requirements.txt"
  puts "    uvicorn main:app --reload\n"
  exit 1
end

puts "\n🎴  P3P Archive — Seeding Database"
puts "=" * 46

ok = 0
fail = 0

CHARACTERS.each do |char|
  res = post('/characters', char)
  if res.code.to_i == 201
    puts "  ✓  [%2d] %s" % [char[:id], char[:name]]
    ok += 1
  else
    puts "  ✗  [%2d] %s — %s" % [char[:id], char[:name], res.body[0..60]]
    fail += 1
  end
rescue => e
  puts "  ✗  [%2d] %s — %s" % [char[:id], char[:name], e.message]
  fail += 1
end

puts "=" * 46
puts "  ✓ #{ok} seeded   ✗ #{fail} failed\n"
