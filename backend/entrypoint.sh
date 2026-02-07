#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Portfolio CMS Backend..."

# Check if database exists and has data
if [ ! -f "portfolio.db" ]; then
    echo "📦 Database not found. Creating and populating..."
    python populate_data.py
else
    # Check if database is empty (check if users table has records)
    USER_COUNT=$(python -c "import sqlite3; conn = sqlite3.connect('portfolio.db'); cursor = conn.cursor(); cursor.execute('SELECT COUNT(*) FROM users'); print(cursor.fetchone()[0]); conn.close()" 2>/dev/null || echo "0")
    
    if [ "$USER_COUNT" -eq "0" ]; then
        echo "📦 Database is empty. Populating with initial data..."
        python populate_data.py
    else
        echo "✅ Database already exists with $USER_COUNT users"
    fi
fi

echo "🎯 Starting application server..."
# Start the application using environment variables
exec uvicorn app.main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000} --workers ${WORKERS:-1}
