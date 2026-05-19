# ═══════════════════════════════════════════
# P3P ARCHIVE — backend/Dockerfile
# Python FastAPI backend container
# ═══════════════════════════════════════════

FROM python:3.12-slim

# Metadata
LABEL maintainer="P3P Archive"
LABEL description="Persona 3 Portable Wiki — FastAPI Backend"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .
COPY security.py .

# Create required directories
RUN mkdir -p /app/db /app/uploads /app/backups

# Create non-root user for security
RUN groupadd -r p3p && useradd -r -g p3p p3p
RUN chown -R p3p:p3p /app
USER p3p

# Expose API port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
