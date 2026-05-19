# ═══════════════════════════════════════════
# P3P ARCHIVE — Dockerfile (frontend)
# Nginx static file server for the wiki
# ═══════════════════════════════════════════

FROM nginx:alpine

LABEL maintainer="P3P Archive"
LABEL description="Persona 3 Portable Wiki — Nginx Frontend"

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the entire wiki (html, css, js, assets)
COPY index.html /usr/share/nginx/html/
COPY css/       /usr/share/nginx/html/css/
COPY js/        /usr/share/nginx/html/js/
COPY assets/    /usr/share/nginx/html/assets/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
