#!/bin/sh
set -e

echo "Starting InfinytTech Backend..."

# Optionally apply database migrations if enabled
if [ "$APPLY_MIGRATIONS" = "true" ]; then
    echo "Applying database migrations..."
    python manage.py migrate --noinput
fi

# Collect static files into STATIC_ROOT
echo "Collecting static files..."
python manage.py collectstatic --noinput

# If arguments provided, execute them (e.g. bash or custom command)
if [ "$#" -gt 0 ]; then
    exec "$@"
fi

# Default: Start Gunicorn WSGI server
echo "Starting Gunicorn WSGI server on port ${PORT:-8000}..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${GUNICORN_WORKERS:-3} \
    --threads ${GUNICORN_THREADS:-2} \
    --timeout ${GUNICORN_TIMEOUT:-60} \
    --access-logfile - \
    --error-logfile -
