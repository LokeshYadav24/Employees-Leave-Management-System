@echo off
echo Employee Leave Management System - Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed.

echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Setting up database...
call node setup.js
if errorlevel 1 (
    echo ERROR: Failed to setup database.
    pause
    exit /b 1
)

echo.
echo Configuring user accounts...
call node fix-passwords.js
if errorlevel 1 (
    echo ERROR: Failed to configure passwords.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo   npm start
echo.
echo Then open your browser to:
echo   http://localhost:3001
echo.
echo Default login: admin@company.com / admin123
echo.
pause
