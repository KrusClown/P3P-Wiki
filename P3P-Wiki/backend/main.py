# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/main.py
# FastAPI · SQLite (dev) / PostgreSQL (prod)
# ═══════════════════════════════════════════

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
from contextlib import asynccontextmanager
from pathlib import Path
import sqlite3, os, uuid, json
from datetime import datetime

# ── PATHS ──
BASE_DIR    = Path(__file__).parent
UPLOADS_DIR = BASE_DIR / "uploads"
DB_PATH     = BASE_DIR / "db" / "p3p.db"
UPLOADS_DIR.mkdir(exist_ok=True)
DB_PATH.parent.mkdir(exist_ok=True)

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_SIZE_MB = 5

# ── DATABASE ──
def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS characters (
            id           INTEGER PRIMARY KEY,
            name         TEXT NOT NULL,
            role         TEXT,
            arcana       TEXT,
            persona      TEXT,
            bday         TEXT,
            weapon       TEXT,
            route_label  TEXT,
            va           TEXT,
            filter_type  TEXT,
            initial      TEXT,
            desc_text    TEXT,
            unlock_text  TEXT,
            skills       TEXT,
            img_path     TEXT,
            custom_img   TEXT,
            created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at   TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS photo_uploads (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            character_id  INTEGER NOT NULL,
            filename      TEXT NOT NULL,
            original_name TEXT,
            size_bytes    INTEGER,
            uploaded_at   TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (character_id) REFERENCES characters(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            event        TEXT,
            character_id INTEGER,
            detail       TEXT,
            ts           TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("✓ Database initialized:", DB_PATH)

# ── APP ──
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="P3P Archive API",
    description="Persona 3 Portable Wiki — Character Database & Photo Storage",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
register_security(app)

# ── HELPERS ──
def row_to_dict(row) -> dict:
    d = decrypt_row(dict(row))  # decrypt encrypted fields
    try:
        d["skills"] = json.loads(d.get("skills") or "[]")
    except Exception:
        d["skills"] = []
    if d.get("custom_img"):
        d["photo_url"] = f"/uploads/{d['custom_img']}"
    elif d.get("img_path"):
        d["photo_url"] = f"/{d['img_path']}"
    else:
        d["photo_url"] = None
    return d

def log(conn, event: str, char_id=None, detail=""):
    conn.execute(
        "INSERT INTO events (event, character_id, detail) VALUES (?,?,?)",
        (event, char_id, detail)
    )

# ── MODELS ──
class CharacterIn(BaseModel):
    id:          int
    name:        str
    role:        Optional[str] = ""
    arcana:      Optional[str] = ""
    persona:     Optional[str] = ""
    bday:        Optional[str] = ""
    weapon:      Optional[str] = ""
    route_label: Optional[str] = ""
    va:          Optional[str] = ""
    filter_type: Optional[str] = ""
    initial:     Optional[str] = ""
    desc_text:   Optional[str] = ""
    unlock_text: Optional[str] = ""
    skills:      Optional[str] = "[]"
    img_path:    Optional[str] = ""

class CharacterPatch(BaseModel):
    name:        Optional[str] = None
    role:        Optional[str] = None
    arcana:      Optional[str] = None
    persona:     Optional[str] = None
    bday:        Optional[str] = None
    weapon:      Optional[str] = None
    route_label: Optional[str] = None
    desc_text:   Optional[str] = None
    unlock_text: Optional[str] = None
    skills:      Optional[str] = None

# ═══════════════════════════════════════════
# ROUTES
# ═══════════════════════════════════════════

@app.get("/")
def root():
    conn   = get_db()
    total  = conn.execute("SELECT COUNT(*) FROM characters").fetchone()[0]
    photos = conn.execute("SELECT COUNT(*) FROM characters WHERE custom_img IS NOT NULL").fetchone()[0]
    conn.close()
    return {"api": "P3P Archive", "version": "2.0.0",
            "characters": total, "custom_photos": photos}

# ── GET all characters ──
@app.get("/api/characters")
def get_all():
    conn = get_db()
    rows = conn.execute("SELECT * FROM characters ORDER BY id").fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

# ── GET one character ──
@app.get("/api/characters/{cid}")
def get_one(cid: int):
    conn = get_db()
    row  = conn.execute("SELECT * FROM characters WHERE id=?", (cid,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, f"Character {cid} not found")
    return row_to_dict(row)

# ── CREATE / UPSERT character ──
@app.post("/api/characters", status_code=201)
def create(c: CharacterIn):
    conn   = get_db()
    skills = c.skills if isinstance(c.skills, str) else json.dumps(c.skills)
    try:
        # Validate fields
        Validator.validate_text_field(c.name, "name")
        # Encrypt sensitive fields
        enc = encrypt_row({"desc_text": c.desc_text, "unlock_text": c.unlock_text, "va": c.va})
        conn.execute("""
            INSERT OR REPLACE INTO characters
            (id,name,role,arcana,persona,bday,weapon,route_label,va,
             filter_type,initial,desc_text,unlock_text,skills,img_path)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (c.id, c.name, c.role, c.arcana, c.persona, c.bday, c.weapon,
              c.route_label, enc["va"], c.filter_type, c.initial, enc["desc_text"],
              enc["unlock_text"], skills, c.img_path))
        log(conn, "seeded", c.id, c.name)
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(500, str(e))
    finally:
        conn.close()
    return {"ok": True, "id": c.id}

# ── UPDATE character fields ──
@app.patch("/api/characters/{cid}")
def patch(cid: int, data: CharacterPatch):
    fields = {k: v for k, v in data.dict().items() if v is not None}
    if not fields:
        raise HTTPException(400, "No fields provided")
    fields["updated_at"] = datetime.utcnow().isoformat()
    conn = get_db()
    sets = ", ".join(f"{k}=?" for k in fields)
    conn.execute(f"UPDATE characters SET {sets} WHERE id=?", [*fields.values(), cid])
    log(conn, "updated", cid, str(list(fields.keys())))
    conn.commit()
    conn.close()
    return {"ok": True, "id": cid}

# ── UPLOAD photo ──
@app.post("/api/characters/{cid}/photo")
async def upload_photo(cid: int, file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Extension {ext} not allowed")

    content = await file.read()
    mb = len(content) / 1_048_576
    if mb > MAX_SIZE_MB:
        raise HTTPException(413, f"Max {MAX_SIZE_MB}MB")
    # Validate by magic bytes — not just extension
    validate_image_bytes(content, file.filename)
    # Log upload attempt
    audit.write("PHOTO_UPLOAD", detail=f"char={cid} file={file.filename} size={mb:.2f}MB")

    conn = get_db()
    row  = conn.execute("SELECT custom_img FROM characters WHERE id=?", (cid,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Character not found")

    # Remove old file
    if row["custom_img"]:
        old = UPLOADS_DIR / row["custom_img"]
        if old.exists():
            old.unlink()

    fname = f"{cid}_{uuid.uuid4().hex[:8]}{ext}"
    (UPLOADS_DIR / fname).write_bytes(content)

    now = datetime.utcnow().isoformat()
    conn.execute("UPDATE characters SET custom_img=?, updated_at=? WHERE id=?", (fname, now, cid))
    conn.execute("INSERT INTO photo_uploads (character_id,filename,original_name,size_bytes) VALUES (?,?,?,?)",
                 (cid, fname, file.filename, len(content)))
    log(conn, "photo_uploaded", cid, fname)
    conn.commit()
    conn.close()

    return {"ok": True, "url": f"/uploads/{fname}", "size_mb": round(mb, 2)}

# ── DELETE photo ──
@app.delete("/api/characters/{cid}/photo")
def delete_photo(cid: int):
    conn = get_db()
    row  = conn.execute("SELECT custom_img FROM characters WHERE id=?", (cid,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Character not found")
    if row["custom_img"]:
        path = UPLOADS_DIR / row["custom_img"]
        if path.exists():
            path.unlink()
        conn.execute("UPDATE characters SET custom_img=NULL WHERE id=?", (cid,))
        log(conn, "photo_deleted", cid)
        conn.commit()
    conn.close()
    return {"ok": True}

# ── GET photo URL ──
@app.get("/api/characters/{cid}/photo")
def get_photo(cid: int):
    conn = get_db()
    row  = conn.execute("SELECT custom_img, img_path FROM characters WHERE id=?", (cid,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Character not found")
    if row["custom_img"]:
        return {"url": f"/uploads/{row['custom_img']}", "type": "custom"}
    if row["img_path"]:
        return {"url": f"/{row['img_path']}", "type": "default"}
    return {"url": None, "type": "none"}

# ── UPLOAD HISTORY ──
@app.get("/api/uploads")
def upload_history():
    conn = get_db()
    rows = conn.execute("""
        SELECT p.*, c.name FROM photo_uploads p
        JOIN characters c ON p.character_id = c.id
        ORDER BY p.uploaded_at DESC LIMIT 50
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ── STATS ──
@app.get("/api/stats")
def stats():
    conn = get_db()
    events = conn.execute("SELECT event, COUNT(*) n FROM events GROUP BY event").fetchall()
    conn.close()
    return {e["event"]: e["n"] for e in events}


@app.get("/api/security/audit")
def get_audit_log(n: int = 50):
    """Last N security events from the audit log."""
    return {"events": audit.tail(n)}

@app.get("/api/security/rate-status")
def rate_status(request: Request):
    """Rate limit status for the calling IP."""
    ip = request.client.host if request.client else "unknown"
    return rate_limiter.get_stats(ip)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
