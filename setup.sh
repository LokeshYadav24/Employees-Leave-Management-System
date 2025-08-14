#!/bin/bash

echo "Employee Leave Management System - Setup"
echo "========================================"
echo

echo "Checking Node.js installation..."
if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: Node.js is not installed."
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi
echo "Node.js is installed."

echo
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies."
    exit 1
fi

echo
echo "Setting up database..."
node setup.js
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to setup database."
    exit 1
fi

echo
echo "Configuring user accounts..."
node fix-passwords.js
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to configure passwords."
    exit 1
fi

echo
echo "Setup completed successfully!"
echo
echo "To start the application:"
echo "  npm start"
echo
echo "Then open your browser to:"
echo "  http://localhost:3001"
echo
echo "Default login: admin@company.com / admin123"
echo
