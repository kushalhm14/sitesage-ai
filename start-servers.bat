@echo off
REM SiteSage AI - Server Startup Script (Windows)
REM Double-click this file to start both servers

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║                                                   ║
echo ║       🚀 Starting SiteSage AI Servers 🚀         ║
echo ║                                                   ║
echo ╚═══════════════════════════════════════════════════╝
echo.

REM Kill existing node processes
echo 🔄 Stopping existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Check MongoDB
echo 📦 Checking MongoDB...
netstat -an | findstr ":27017" >nul
if %errorlevel%==0 (
    echo ✅ MongoDB is running on port 27017
) else (
    echo ⚠️  WARNING: MongoDB not detected on port 27017
    echo    Make sure MongoDB service is running!
)

echo.
echo 🔧 Starting Backend Server...
cd /d "%~dp0backend"
start "SiteSage Backend" cmd /k "node index.js"
timeout /t 3 /nobreak >nul

REM Check backend
netstat -an | findstr ":5000" >nul
if %errorlevel%==0 (
    echo ✅ Backend running on http://localhost:5000
) else (
    echo ❌ Backend failed to start!
    pause
    exit /b 1
)

echo.
echo 🎨 Starting Frontend Server...
cd /d "%~dp0"
start "SiteSage Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

REM Check frontend
netstat -an | findstr ":8080" >nul
if %errorlevel%==0 (
    echo ✅ Frontend running on http://localhost:8080
) else (
    echo ❌ Frontend failed to start!
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║                                                   ║
echo ║       ✅ ALL SERVERS RUNNING! ✅                 ║
echo ║                                                   ║
echo ╚═══════════════════════════════════════════════════╝
echo.
echo 🌐 Application URLs:
echo    • Frontend: http://localhost:8080
echo    • Backend:  http://localhost:5000
echo.
echo 🎯 Next Steps:
echo    1. Open http://localhost:8080 in your browser
echo    2. Sign Up with your name
echo    3. Start analyzing websites!
echo.
echo 📝 Note: Both servers are running in separate windows.
echo    Close those windows to stop the servers.
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:8080
echo.
echo Press any key to close this window...
pause >nul
