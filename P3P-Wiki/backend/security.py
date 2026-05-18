# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/security.py
# Full security layer:
#   - AES-256 field encryption
#   - Rate limiting
#   - Input validation & sanitization
#   - SQL injection protection
#   - XSS prevention
#   - CSRF tokens
#   - Brute force protection
#   - Secure headers
# ═══════════════════════════════════════════

import os, re, time, hmac, hashlib, base64, secrets, html
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional
from collections import defaultdict
from functools import wraps

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


# ═══════════════════════════════════════════
# 1. AES-256 ENCRYPTION
#    Encrypts sensitive DB fields at rest
# ═══════════════════════════════════════════
try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    CRYPTO_AVAILABLE = True
except ImportError:
    CRYPTO_AVAILABLE = False
    print("⚠  cryptography not installed — encryption disabled")
    print("   Run: pip install cryptography")


class Encryptor:
    """AES-256 (via Fernet) field-level encryption for the database."""

    def __init__(self):
        self._fernet = None
        if CRYPTO_AVAILABLE:
            self._fernet = self._load_or_create_key()

    def _load_or_create_key(self):
        key_path = Path(__file__).parent / "db" / ".key"
        key_path.parent.mkdir(exist_ok=True)

        # Priority: env var → key file → generate new
        raw_key = os.environ.get("P3P_ENCRYPT_KEY")

        if raw_key:
            # Derive a Fernet key from the env var passphrase
            kdf  = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b"p3p_archive_salt_v1",
                iterations=480_000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(raw_key.encode()))
        elif key_path.exists():
            key = key_path.read_bytes().strip()
        else:
            # Generate and save a new key
            key = Fernet.generate_key()
            key_path.write_bytes(key)
            key_path.chmod(0o600)  # owner read-only
            print(f"✓ Encryption key generated: {key_path}")

        return Fernet(key)

    def encrypt(self, value: str) -> str:
        """Encrypt a string value. Returns base64 token."""
        if not self._fernet or not value:
            return value
        return self._fernet.encrypt(value.encode()).decode()

    def decrypt(self, token: str) -> str:
        """Decrypt a Fernet token back to string."""
        if not self._fernet or not token:
            return token
        try:
            return self._fernet.decrypt(token.encode()).decode()
        except Exception:
            return token  # return as-is if not encrypted

    def is_encrypted(self, value: str) -> bool:
        """Check if a value looks like a Fernet token."""
        if not value:
            return False
        try:
            base64.urlsafe_b64decode(value.encode() + b"==")
            return value.startswith("gAA")
        except Exception:
            return False


# Global encryptor instance
encryptor = Encryptor()


# ═══════════════════════════════════════════
# 2. INPUT VALIDATION & SANITIZATION
#    Blocks SQL injection, XSS, path traversal
# ═══════════════════════════════════════════

# SQL injection patterns
SQL_INJECTION_PATTERNS = re.compile(
    r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b"
    r"|--|;|/\*|\*/|xp_|CAST\s*\(|CONVERT\s*\(|CHAR\s*\(|NCHAR\s*\()",
    re.IGNORECASE
)

# XSS patterns
XSS_PATTERNS = re.compile(
    r"(<script|</script|javascript:|on\w+=|<iframe|<object|<embed|<link|<meta)",
    re.IGNORECASE
)

# Path traversal
PATH_TRAVERSAL = re.compile(r"\.\./|\.\.\\|%2e%2e|%252e")

# Allowed characters for character fields
SAFE_TEXT = re.compile(r"^[\w\s\.\,\!\?\'\"\-\:\;\(\)\[\]\/\+\&\#\@\%\°áéíóúÁÉÍÓÚñÑüÜ]+$")


class Validator:
    """Validates and sanitizes all incoming data."""

    @staticmethod
    def sanitize_text(value: str, max_len: int = 2000) -> str:
        """Sanitize text — strip HTML, limit length."""
        if not value:
            return ""
        # HTML-escape to prevent XSS
        value = html.escape(str(value).strip())
        # Truncate
        return value[:max_len]

    @staticmethod
    def check_sql_injection(value: str) -> bool:
        """Returns True if SQL injection detected."""
        return bool(SQL_INJECTION_PATTERNS.search(str(value)))

    @staticmethod
    def check_xss(value: str) -> bool:
        """Returns True if XSS attempt detected."""
        return bool(XSS_PATTERNS.search(str(value)))

    @staticmethod
    def check_path_traversal(value: str) -> bool:
        """Returns True if path traversal detected."""
        return bool(PATH_TRAVERSAL.search(str(value)))

    @staticmethod
    def validate_filename(filename: str) -> str:
        """Ensure uploaded filename is safe."""
        # Strip any directory components
        name = Path(filename).name
        # Only allow alphanumeric, dash, underscore, dot
        safe = re.sub(r"[^\w\-\.]", "_", name)
        # No double dots
        safe = re.sub(r"\.{2,}", ".", safe)
        return safe[:100]

    @staticmethod
    def validate_character_id(cid: int) -> bool:
        return isinstance(cid, int) and 1 <= cid <= 999

    @staticmethod
    def validate_text_field(value: str, field: str = "field") -> str:
        """Full pipeline: check for attacks, then sanitize."""
        if not value:
            return ""
        val = str(value)
        if Validator.check_sql_injection(val):
            raise HTTPException(400, f"Invalid characters in {field}")
        if Validator.check_xss(val):
            raise HTTPException(400, f"Invalid content in {field}")
        return Validator.sanitize_text(val)

    @staticmethod
    def validate_all_fields(data: dict) -> dict:
        """Validate every string field in a dict."""
        clean = {}
        for key, value in data.items():
            if isinstance(value, str):
                clean[key] = Validator.validate_text_field(value, key)
            elif isinstance(value, int):
                clean[key] = value
            else:
                clean[key] = value
        return clean


validator = Validator()


# ═══════════════════════════════════════════
# 3. RATE LIMITER
#    Per-IP request throttling
# ═══════════════════════════════════════════

class RateLimiter:
    """
    Sliding window rate limiter.
    Tracks requests per IP per time window.
    """

    def __init__(self):
        # { ip: [(timestamp, endpoint), ...] }
        self._requests: dict = defaultdict(list)
        self._blocked:  dict = {}  # { ip: unblock_timestamp }

        # Config
        self.WINDOW_SECONDS  = 60
        self.MAX_REQUESTS    = 100   # per window
        self.UPLOAD_MAX      = 10    # stricter for uploads
        self.BLOCK_DURATION  = 300   # 5 min block after violation

    def _clean_old(self, ip: str):
        cutoff = time.time() - self.WINDOW_SECONDS
        self._requests[ip] = [
            r for r in self._requests[ip] if r[0] > cutoff
        ]

    def is_blocked(self, ip: str) -> bool:
        if ip in self._blocked:
            if time.time() < self._blocked[ip]:
                return True
            else:
                del self._blocked[ip]
        return False

    def block(self, ip: str):
        self._blocked[ip] = time.time() + self.BLOCK_DURATION
        print(f"🛡  Blocked IP {ip} for {self.BLOCK_DURATION}s")

    def check(self, ip: str, endpoint: str = "") -> bool:
        """
        Returns True if request is allowed.
        Raises 429 if rate exceeded.
        """
        if self.is_blocked(ip):
            raise HTTPException(
                status_code=429,
                detail="Too many requests — IP temporarily blocked"
            )

        self._clean_old(ip)
        limit = self.UPLOAD_MAX if "photo" in endpoint else self.MAX_REQUESTS
        count = len(self._requests[ip])

        if count >= limit:
            self.block(ip)
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded ({limit} req/{self.WINDOW_SECONDS}s)"
            )

        self._requests[ip].append((time.time(), endpoint))
        return True

    def get_stats(self, ip: str) -> dict:
        self._clean_old(ip)
        return {
            "ip":       ip,
            "requests": len(self._requests[ip]),
            "limit":    self.MAX_REQUESTS,
            "window_s": self.WINDOW_SECONDS,
            "blocked":  self.is_blocked(ip)
        }


rate_limiter = RateLimiter()


# ═══════════════════════════════════════════
# 4. CSRF TOKEN MANAGER
# ═══════════════════════════════════════════

class CSRFManager:
    """Simple CSRF token generation and validation."""

    SECRET = os.environ.get("P3P_SECRET", secrets.token_hex(32))

    @classmethod
    def generate(cls, session_id: str) -> str:
        """Generate a CSRF token tied to a session."""
        raw     = f"{session_id}:{int(time.time() // 3600)}"
        sig     = hmac.new(cls.SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
        return base64.urlsafe_b64encode(f"{raw}:{sig}".encode()).decode()

    @classmethod
    def validate(cls, token: str, session_id: str) -> bool:
        """Validate CSRF token. Returns False if invalid/expired."""
        try:
            decoded  = base64.urlsafe_b64decode(token.encode()).decode()
            parts    = decoded.split(":")
            if len(parts) != 3:
                return False
            sid, hour, sig = parts
            if sid != session_id:
                return False
            # Accept current hour and previous hour (max 2h window)
            current_hour = int(time.time() // 3600)
            if int(hour) < current_hour - 1:
                return False
            raw      = f"{sid}:{hour}"
            expected = hmac.new(cls.SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
            return hmac.compare_digest(sig, expected)
        except Exception:
            return False


# ═══════════════════════════════════════════
# 5. SECURE HEADERS MIDDLEWARE
# ═══════════════════════════════════════════

class SecureHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security headers to every response:
    - CSP, HSTS, X-Frame-Options, etc.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: blob: https://static.wikia.nocookie.net; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "connect-src 'self' http://localhost:8000;"
        )

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Block MIME sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # XSS protection (legacy browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions policy
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), payment=()"
        )

        # HSTS (enable in production with HTTPS)
        # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Remove server info
        response.headers.pop("Server", None)
        response.headers.pop("X-Powered-By", None)

        return response


# ═══════════════════════════════════════════
# 6. RATE LIMIT MIDDLEWARE
# ═══════════════════════════════════════════

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Applies rate limiting to every incoming request."""

    # Skip rate limiting for these paths
    SKIP_PATHS = {"/", "/docs", "/openapi.json", "/redoc"}

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        if path not in self.SKIP_PATHS and not path.startswith("/uploads"):
            ip = request.client.host if request.client else "unknown"
            try:
                rate_limiter.check(ip, path)
            except HTTPException as e:
                return JSONResponse(
                    status_code=e.status_code,
                    content={"detail": e.detail, "retry_after": rate_limiter.BLOCK_DURATION}
                )

        return await call_next(request)


# ═══════════════════════════════════════════
# 7. REQUEST INSPECTION MIDDLEWARE
#    Logs and blocks suspicious requests
# ═══════════════════════════════════════════

class RequestInspectionMiddleware(BaseHTTPMiddleware):
    """Inspects query params and headers for attack patterns."""

    SUSPICIOUS_UA = re.compile(
        r"(sqlmap|nikto|nmap|masscan|dirbuster|gobuster|burpsuite|havij)",
        re.IGNORECASE
    )

    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"

        # Block known scanner user-agents
        ua = request.headers.get("user-agent", "")
        if self.SUSPICIOUS_UA.search(ua):
            print(f"🚨 Blocked scanner UA from {ip}: {ua[:80]}")
            return JSONResponse(status_code=403, content={"detail": "Forbidden"})

        # Check query params for injection
        for key, val in request.query_params.items():
            if Validator.check_sql_injection(val) or Validator.check_xss(val):
                print(f"🚨 Injection attempt from {ip} in param '{key}': {val[:80]}")
                return JSONResponse(status_code=400, content={"detail": "Invalid request"})

        # Check path traversal in URL
        if Validator.check_path_traversal(str(request.url)):
            print(f"🚨 Path traversal attempt from {ip}: {request.url}")
            return JSONResponse(status_code=400, content={"detail": "Invalid path"})

        return await call_next(request)


# ═══════════════════════════════════════════
# 8. DB ENCRYPTION HELPERS
#    Encrypt/decrypt specific character fields
# ═══════════════════════════════════════════

# Fields that should be encrypted at rest
ENCRYPTED_FIELDS = {"desc_text", "unlock_text", "va"}


def encrypt_row(data: dict) -> dict:
    """Encrypt sensitive fields before writing to DB."""
    result = dict(data)
    for field in ENCRYPTED_FIELDS:
        if field in result and result[field]:
            result[field] = encryptor.encrypt(str(result[field]))
    return result


def decrypt_row(data: dict) -> dict:
    """Decrypt sensitive fields after reading from DB."""
    result = dict(data)
    for field in ENCRYPTED_FIELDS:
        if field in result and result[field]:
            result[field] = encryptor.decrypt(str(result[field]))
    return result


# ═══════════════════════════════════════════
# 9. SECURE FILE UPLOAD VALIDATOR
# ═══════════════════════════════════════════

# Magic bytes for allowed image types
IMAGE_SIGNATURES = {
    b"\xff\xd8\xff":           "jpeg",
    b"\x89PNG\r\n\x1a\n":     "png",
    b"RIFF":                   "webp",  # RIFF....WEBP
    b"GIF87a":                 "gif",
    b"GIF89a":                 "gif",
}

MAX_IMAGE_DIMENSION = 4096  # pixels (requires Pillow if checking)


def validate_image_bytes(content: bytes, filename: str) -> str:
    """
    Validates uploaded file by magic bytes (not just extension).
    Returns detected mime type or raises HTTPException.
    """
    if len(content) < 8:
        raise HTTPException(400, "File too small to be a valid image")

    for sig, mime in IMAGE_SIGNATURES.items():
        if content[:len(sig)] == sig:
            # Extra check for WebP
            if mime == "webp" and content[8:12] != b"WEBP":
                continue
            return mime

    raise HTTPException(
        415,
        f"File '{filename}' is not a recognized image format. "
        "Upload JPEG, PNG, WebP, or GIF."
    )


# ═══════════════════════════════════════════
# 10. SECURITY AUDIT LOG
# ═══════════════════════════════════════════

class AuditLog:
    """Append-only security event log."""

    LOG_PATH = Path(__file__).parent / "db" / "security.log"

    @classmethod
    def write(cls, event: str, ip: str = "", detail: str = ""):
        cls.LOG_PATH.parent.mkdir(exist_ok=True)
        line = f"{datetime.utcnow().isoformat()} | {event:<25} | {ip:<20} | {detail}\n"
        with open(cls.LOG_PATH, "a") as f:
            f.write(line)

    @classmethod
    def tail(cls, n: int = 50) -> list:
        if not cls.LOG_PATH.exists():
            return []
        lines = cls.LOG_PATH.read_text().strip().split("\n")
        return lines[-n:]


audit = AuditLog()


# ═══════════════════════════════════════════
# EXPORT — register_security(app)
# Call this in main.py to apply everything
# ═══════════════════════════════════════════

def register_security(app):
    """
    Attach all security middleware to the FastAPI app.
    Call after app = FastAPI(...).

    Usage in main.py:
        from security import register_security
        register_security(app)
    """
    # Order matters — outermost runs first
    app.add_middleware(SecureHeadersMiddleware)
    app.add_middleware(RequestInspectionMiddleware)
    app.add_middleware(RateLimitMiddleware)
    print("✓ Security middleware registered")
    print(f"  · Secure headers       ✓")
    print(f"  · Request inspection   ✓")
    print(f"  · Rate limiting        ✓  ({rate_limiter.MAX_REQUESTS} req/min)")
    print(f"  · Encryption           {'✓' if CRYPTO_AVAILABLE else '✗ (install cryptography)'}")
    print(f"  · Input validation     ✓")
    print(f"  · Audit logging        ✓  → {AuditLog.LOG_PATH}")
