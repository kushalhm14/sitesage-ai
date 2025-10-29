#!/bin/bash

# SiteSage AI - Server Startup Script
# Run this in Git Bash to start both backend and frontend servers

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║       🚀 Starting SiteSage AI Servers 🚀         ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Kill any existing node processes
echo "🔄 Stopping existing servers..."
taskkill //F //IM node.exe 2>/dev/null || true
sleep 2

# Start MongoDB check
echo "📦 Checking MongoDB..."
if netstat -an | grep -q ":27017"; then
    echo "✅ MongoDB is running on port 27017"
else
    echo "⚠️  WARNING: MongoDB not detected on port 27017"
    echo "   Make sure MongoDB service is running!"
fi

echo ""
echo "🔧 Starting Backend Server..."
cd "$SCRIPT_DIR/backend"

# Start backend in background
start node index.js

sleep 3

# Check if backend started
if netstat -an | grep -q ":5000"; then
    echo "✅ Backend running on http://localhost:5000"
else
    echo "❌ Backend failed to start!"
    exit 1
fi

echo ""
echo "🎨 Starting Frontend Server..."
cd "$SCRIPT_DIR"

# Start frontend in background
start npm run dev

sleep 5

# Check if frontend started
if netstat -an | grep -q ":8080"; then
    echo "✅ Frontend running on http://localhost:8080"
else
    echo "❌ Frontend failed to start!"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║       ✅ ALL SERVERS RUNNING! ✅                 ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "🌐 Application URLs:"
echo "   • Frontend: http://localhost:8080"
echo "   • Backend:  http://localhost:5000"
echo ""
echo "🎯 Next Steps:"
echo "   1. Open http://localhost:8080 in your browser"
echo "   2. Sign Up with your name"
echo "   3. Start analyzing websites!"
echo ""
echo "📝 Note: Both servers are running in separate windows."
echo "   Close those windows to stop the servers."
echo ""
