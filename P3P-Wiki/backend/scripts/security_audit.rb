#!/usr/bin/env ruby
# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/scripts/security_audit.rb
# Reads the security audit log and reports:
#   - Upload events
#   - Blocked IPs
#   - Suspicious activity
#   - Rate limit violations
#
# Usage: ruby scripts/security_audit.rb
# ═══════════════════════════════════════════

require 'time'
require 'json'

BASE_DIR  = File.expand_path('..', __dir__)
LOG_PATH  = File.join(BASE_DIR, 'db', 'security.log')
DB_PATH   = File.join(BASE_DIR, 'db', 'p3p.db')

# ── Parse log entries ──
def parse_log
  return [] unless File.exist?(LOG_PATH)

  File.readlines(LOG_PATH).filter_map do |line|
    parts = line.strip.split(' | ')
    next if parts.length < 3
    {
      ts:     parts[0],
      event:  parts[1]&.strip,
      ip:     parts[2]&.strip,
      detail: parts[3]&.strip || ''
    }
  end
end

# ── Summary report ──
def report(entries)
  puts "\n🔐  P3P Archive — Security Audit Report"
  puts "=" * 52
  puts "  Log: #{LOG_PATH}"
  puts "  Entries: #{entries.length}"
  puts

  # Count by event type
  by_event = entries.group_by { |e| e[:event] }

  puts "  📊 Event Summary"
  puts "  " + "-" * 40
  by_event.sort_by { |_, v| -v.length }.each do |event, evs|
    puts "  %-30s %d" % [event, evs.length]
  end

  # Photo uploads
  uploads = by_event['PHOTO_UPLOAD'] || []
  unless uploads.empty?
    puts "\n  📷 Recent Photo Uploads (last 10)"
    puts "  " + "-" * 40
    uploads.last(10).each do |e|
      puts "  #{e[:ts][0..18]}  #{e[:detail]}"
    end
  end

  # Unique IPs
  ips = entries.map { |e| e[:ip] }.reject { |i| i.to_s.empty? }.uniq
  puts "\n  🌐 Unique IPs seen: #{ips.length}"
  ips.first(10).each { |ip| puts "    #{ip}" }

  # Last 5 entries
  puts "\n  🕐 Last 5 Log Entries"
  puts "  " + "-" * 40
  entries.last(5).each do |e|
    puts "  [#{e[:ts][0..18]}] #{e[:event]} | #{e[:ip]} | #{e[:detail]}"
  end

  puts "\n" + "=" * 52
end

# ── Check DB events table if exists ──
def db_stats
  require 'sqlite3' rescue return
  return unless File.exist?(DB_PATH)

  db   = SQLite3::Database.new(DB_PATH)
  rows = db.execute("SELECT event, COUNT(*) n FROM events GROUP BY event ORDER BY n DESC") rescue []
  db.close

  return if rows.empty?

  puts "\n  🗄  Database Event Stats"
  puts "  " + "-" * 40
  rows.each do |row|
    puts "  %-30s %d" % [row[0], row[1]]
  end
rescue => e
  # sqlite3 gem not installed — skip
end

entries = parse_log
report(entries)
db_stats

puts
