#!/usr/bin/env ruby
# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/scripts/images.rb
# Reports photo status for all 25 characters:
# default assets, custom uploads, missing slots
#
# Usage: ruby scripts/images.rb
# ═══════════════════════════════════════════

require 'fileutils'

BASE_DIR    = File.expand_path('..', __dir__)
UPLOADS_DIR = File.join(BASE_DIR, 'uploads')
ASSETS_DIR  = File.join(BASE_DIR, '..', 'assets', 'images', 'characters')

CHARACTERS = {
  1  => { name: 'Male Protagonist',    default: 'Male-Protagonist.jpeg' },
  2  => { name: 'Female Protagonist',  default: 'Female-Protagonist.jpeg' },
  3  => { name: 'Yukari Takeba',       default: 'Yukari-Takeba.jpeg' },
  4  => { name: 'Junpei Iori',         default: 'Junpei-Iori.jpeg' },
  5  => { name: 'Akihiko Sanada',      default: 'Akihiko-Sanada.jpeg' },
  6  => { name: 'Mitsuru Kirijo',      default: 'Mitsuru-Kirijo.jpeg' },
  7  => { name: 'Fuuka Yamagishi',     default: 'Fuuka-Yamagishi.jpeg' },
  8  => { name: 'Ken Amada',           default: 'Ken-Amada.jpeg' },
  9  => { name: 'Koromaru',            default: 'Koromaru.jpeg' },
  10 => { name: 'Shinjiro Aragaki',    default: 'Shinjiro-Aragaki.jpg' },
  11 => { name: 'Aigis',               default: 'Aigis.jpg' },
  12 => { name: 'Ryoji Mochizuki',     default: 'Ryoji-Mochizuki.jpeg' },
  13 => { name: 'Metis',               default: 'Metis.jpg' },
  14 => { name: 'Takeharu Kirijo',     default: 'Takeharu-Kirijo.jpeg' },
  # New slots — no default, must upload
  15 => { name: 'Takaya Sakaki',       default: 'Takaya-Sakaki.jpg' },
  16 => { name: 'Jin Shirato',         default: 'Jin-Shirato.jpeg' },
  17 => { name: 'Chidori Yoshino',     default: 'Chidori-Yoshino.jpeg' },
  18 => { name: 'Elizabeth',           default: 'Elizabeth.jpg' },
  19 => { name: 'Theodore',            default: nil },
  20 => { name: 'Igor',                default: 'Igor.png' },
  21 => { name: 'Pharos',              default: nil },
  22 => { name: 'Nyx Avatar',          default: nil },
  23 => { name: 'Kenji Tomochika',     default: 'Kenji-Tomochika.jpg' },
  24 => { name: 'Hidetoshi Odagiri',   default: nil },
  25 => { name: 'Maiko Oohashi',       default: nil }
}.freeze

def file_kb(path)
  "#{(File.size(path) / 1024.0).round(1)} KB"
end

def has_upload?(id)
  Dir[File.join(UPLOADS_DIR, "#{id}_*")].any? { |f| File.file?(f) }
end

def upload_filename(id)
  files = Dir[File.join(UPLOADS_DIR, "#{id}_*")].select { |f| File.file?(f) }
  files.empty? ? nil : File.basename(files.last)
end

puts "\n🎴  P3P Archive — Photo Status Report"
puts "=" * 56

# ── Original 14 — should have default assets ──
puts "\n  SEES Members (default photos expected)\n"
CHARACTERS.select { |id, _| id <= 14 }.each do |id, data|
  asset = File.join(ASSETS_DIR, data[:default])
  custom = upload_filename(id)

  if custom
    puts "  [C] %2d. %-22s custom: %s" % [id, data[:name], custom]
  elsif File.exist?(asset)
    puts "  [✓] %2d. %-22s %s" % [id, data[:name], file_kb(asset)]
  else
    puts "  [✗] %2d. %-22s MISSING" % [id, data[:name]]
  end
end

# ── New 11 — need uploaded photos ──
puts "\n  New Characters (upload required)\n"
CHARACTERS.select { |id, _| id > 14 }.each do |id, data|
  custom = upload_filename(id)
  if custom
    path = File.join(UPLOADS_DIR, custom)
    puts "  [✓] %2d. %-22s %s" % [id, data[:name], file_kb(path)]
  else
    puts "  [ ] %2d. %-22s — no photo yet" % [id, data[:name]]
  end
end

# ── Summary ──
total_with_photo = CHARACTERS.count do |id, data|
  if id <= 14
    asset = data[:default] ? File.exist?(File.join(ASSETS_DIR, data[:default])) : false
    asset || has_upload?(id)
  else
    has_upload?(id)
  end
end

puts "\n" + "=" * 56
puts "  Coverage: #{total_with_photo}/#{CHARACTERS.count} characters have a photo"
puts "  Missing:  #{CHARACTERS.count - total_with_photo} still need photos\n"
