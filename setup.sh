#!/bin/bash

# Portfolio CMS Setup Script
# This script will set up both backend and frontend

echo "🚀 Portfolio CMS Setup Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Setting up Backend..."
echo ""

# Setup backend
cd backend

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update SECRET_KEY in backend/.env before deploying!"
fi

# Initialize database
echo "🗄️  Initializing database..."
python -m app.database

echo "✅ Backend setup complete!"
echo ""

# Setup frontend
cd ../frontend

echo "📦 Setting up Frontend..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm found"

# Install dependencies
echo "📥 Installing Node dependencies..."
pnpm install

# Copy .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
fi

echo "✅ Frontend setup complete!"
echo ""

cd ..

echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "🎉 Your portfolio CMS is ready!"
echo ""
echo "To start the servers:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload --port 8000"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend"
echo "  pnpm dev"
echo ""
echo "Then visit:"
echo "  🌐 Website: http://localhost:3000"
echo "  ⚙️  Admin: http://localhost:3000/admin"
echo "  📚 API Docs: http://localhost:8000/api/docs"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "⚠️  Remember to change the password after first login!"
echo ""
