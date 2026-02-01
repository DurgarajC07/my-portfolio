@echo off
REM Portfolio CMS Setup Script for Windows
REM This script will set up both backend and frontend

echo ================================
echo Portfolio CMS Setup Script
echo ================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend folder not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend folder not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo Setting up Backend...
echo.

cd backend

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
)

echo Python found
echo.

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Copy .env if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo WARNING: Please update SECRET_KEY in backend/.env before deploying!
)

REM Initialize database
echo Initializing database...
python -m app.database

echo Backend setup complete!
echo.

cd ..\frontend

echo Setting up Frontend...
echo.

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo pnpm not found. Installing pnpm...
    npm install -g pnpm
)

echo pnpm found
echo.

REM Install dependencies
echo Installing Node dependencies...
call pnpm install

REM Copy .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.example .env.local
)

echo Frontend setup complete!
echo.

cd ..

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Your portfolio CMS is ready!
echo.
echo To start the servers:
echo.
echo Backend (Terminal 1):
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload --port 8000
echo.
echo Frontend (Terminal 2):
echo   cd frontend
echo   pnpm dev
echo.
echo Then visit:
echo   Website: http://localhost:3000
echo   Admin: http://localhost:3000/admin
echo   API Docs: http://localhost:8000/api/docs
echo.
echo Default credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo WARNING: Remember to change the password after first login!
echo.
pause
