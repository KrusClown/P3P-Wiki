#!/usr/bin/env ruby
# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/scripts/backup.rb
# Backs up SQLite database + all uploaded photos
# to a timestamped ZIP archive
#
# Usage: ruby scripts/backup.rb
# ═══════════════════════════════════════════

require 'fileutils'
require 'time'
require 'json'

BASE_DIR    = File.expand_path('..', __dir__)
DB_PATH     = File.join(BASE_DIR, 'db', 'p3p.db')
UPLOADS_DIR = File.join(BASE_DIR, 'uploads')
BACKUP_DIR  = File.join(BASE_DIR, 'backups')

FileUtils.mkdir_p(BACKUP_DIR)

def file_size_kb(path)
  (File.size(path) / 1024.0).round(1)
end

def backup
  ts          = Time.now.strftime('%Y%m%d_%H%M%S')
  backup_name = "p3p_backup_#{ts}"
  backup_path = File.join(BACKUP_DIR, backup_name)

  puts "\n💾  P3P Archive — Backup"
  puts "=" * 42

  FileUtils.mkdir_p(backup_path)

  # Copy database
  if File.exist?(DB_PATH)
    FileUtils.cp(DB_PATH, File.join(backup_path, 'p3p.db'))
    puts "  ✓ Database     #{file_size_kb(DB_PATH)} KB"
  else
    puts "  ⚠ Database not found — skipping"
  end

  # Copy uploads
  if Dir.exist?(UPLOADS_DIR)
    FileUtils.cp_r(UPLOADS_DIR, File.join(backup_path, 'uploads'))
    count = Dir[File.join(UPLOADS_DIR, '*')].count { |f| File.file?(f) }
    puts "  ✓ Photos       #{count} file(s)"
  else
    puts "  ⚠ Uploads folder not found — skipping"
  end

  # Write manifest
  manifest = {
    created_at: Time.now.iso8601,
    db:         DB_PATH,
    uploads:    Dir[File.join(UPLOADS_DIR, '*')].map { |f| File.basename(f) }
  }
  File.write(File.join(backup_path, 'manifest.json'), JSON.pretty_generate(manifest))

  # Zip
  zip_path = "#{backup_path}.zip"
  system("zip -r #{zip_path} #{backup_path} -q 2>/dev/null")
  FileUtils.rm_rf(backup_path)

  zip_size = File.exist?(zip_path) ? "#{file_size_kb(zip_path)} KB" : "N/A"
  puts "  ✓ Archive      #{File.basename(zip_path)}  (#{zip_size})"
  puts "=" * 42
  puts "  Saved: #{zip_path}\n"

  # Keep only last 10 backups
  backups = Dir[File.join(BACKUP_DIR, '*.zip')].sort
  if backups.length > 10
    removed = backups[0..-(11)]
    removed.each { |b| FileUtils.rm(b) }
    puts "  🗑  Removed #{removed.length} old backup(s)\n"
  end
end

backup
