# P3P Archive — Backend

Python FastAPI REST API + Ruby automation scripts.

## Stack
- **Python FastAPI** — REST API, SQLite database, photo storage
- **Ruby scripts** — database seeding, backups, image reporting

---

## Quick Start

### 1. Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the API
```bash
uvicorn main:app --reload
# API runs at http://localhost:8000
# Docs at  http://localhost:8000/docs
```

### 3. Seed the database (Ruby)
```bash
ruby scripts/seed.rb
# Seeds all 25 characters into SQLite
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status + stats |
| GET | `/api/characters` | All 25 characters |
| GET | `/api/characters/{id}` | Single character |
| POST | `/api/characters` | Create / upsert character |
| PATCH | `/api/characters/{id}` | Update character fields |
| POST | `/api/characters/{id}/photo` | Upload photo |
| DELETE | `/api/characters/{id}/photo` | Remove custom photo |
| GET | `/api/characters/{id}/photo` | Get current photo URL |
| GET | `/api/uploads` | Upload history |
| GET | `/api/stats` | Event statistics |

Interactive docs: **http://localhost:8000/docs**

---

## Ruby Scripts

```bash
# Seed all 25 characters into the database
ruby scripts/seed.rb

# Backup database + photos to timestamped ZIP
ruby scripts/backup.rb

# Report photo status for all characters
ruby scripts/images.rb
```

---

## Folder Structure

```
backend/
├── main.py             ← FastAPI application
├── requirements.txt    ← Python dependencies
├── db/
│   └── p3p.db         ← SQLite database (auto-created)
├── uploads/           ← Uploaded photos (auto-created)
├── backups/           ← ZIP backups from backup.rb
└── scripts/
    ├── seed.rb        ← Seed all characters via API
    ├── backup.rb      ← Backup DB + uploads
    └── images.rb      ← Photo coverage report
```

---

## Production (PostgreSQL)

To switch from SQLite to PostgreSQL:

1. Uncomment in `requirements.txt`:
   ```
   asyncpg==0.29.0
   sqlalchemy==2.0.30
   alembic==1.13.1
   ```

2. Set environment variable:
   ```bash
   export DATABASE_URL=postgresql://user:pass@localhost/p3p_db
   ```

3. Update `get_db()` in `main.py` to use SQLAlchemy with asyncpg.

---

## How Photos Work

1. User clicks **Add Photo** on a card in the browser
2. `js/api.js` sends the file to `POST /api/characters/{id}/photo`
3. FastAPI saves the file to `backend/uploads/`
4. Database stores the filename in `characters.custom_img`
5. On next page load, `api.js` fetches all characters and restores photos
6. If API is offline → falls back to sessionStorage (temporary)
