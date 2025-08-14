#!/bin/sh
set -e

echo "🚀 Starting Cloudflare Tunnel Manager..."

# Initialize database if it doesn't exist
echo "📁 Checking database..."
if [ ! -f "/app/data/dev.db" ]; then
    echo "🔧 Database not found, creating and initializing..."
    npx prisma db push --force-reset
    echo "✅ Database initialized successfully"
else
    echo "📊 Database exists, running migrations..."
    npx prisma db push
    echo "✅ Database migrations completed"
fi

# Start the application
echo "🌟 Starting server on port ${PORT:-3001}..."
exec "$@"