#!/bin/bash
set -e

echo "🚀 Starting Portfolio Backend..."

# Load environment variables
if [ -f .env ]; then
    echo "📦 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set defaults
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-8000}
export WORKERS=${WORKERS:-1}

# Database initialization
if [ ! -f "portfolio.db" ]; then
    echo "🗄️  Initializing database..."
    python -c "from app.database import init_db, create_default_admin, create_sample_data; init_db(); create_default_admin(); create_sample_data()"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads/resumes uploads/images backups

# Start the server
echo "🎯 Starting Uvicorn on ${HOST}:${PORT} with ${WORKERS} worker(s)..."

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Running in PRODUCTION mode"
    uvicorn app.main:app \
        --host ${HOST} \
        --port ${PORT} \
        --workers ${WORKERS} \
        --no-access-log \
        --proxy-headers \
        --forwarded-allow-ips='*'
else
    echo "🛠️  Running in DEVELOPMENT mode"
    uvicorn app.main:app \
        --host ${HOST} \
        --port ${PORT} \
        --reload
fi
