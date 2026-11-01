# Multi-stage production Dockerfile for InfinytTech Django REST API
FROM python:3.12-slim-bookworm AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    DJANGO_ENV=production

# Install essential system libraries and curl for container healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    pkg-config \
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged system user for security
RUN groupadd -r infinyt && useradd -r -u 1000 -g infinyt -m infinyt

WORKDIR /app

# Install python dependencies first to leverage Docker layer caching
COPY requirements/ /app/requirements/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements/prod.txt

# Copy backend application source
COPY . /app/

# Ensure runtime directories exist and belong to unprivileged user
RUN mkdir -p /app/static /app/media /app/logs && \
    chmod +x /app/entrypoint.sh && \
    chown -R infinyt:infinyt /app

USER infinyt

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/api/site-settings/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
