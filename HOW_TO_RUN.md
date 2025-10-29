# 🚀 Quick Start Guide - Running SiteSage AI

## Option 1: Windows Batch File (Easiest!)

**Simply double-click this file:**
```
start-servers.bat
```

This will:
- ✅ Stop any existing servers
- ✅ Start the backend (port 5000)
- ✅ Start the frontend (port 8080)
- ✅ Open your browser automatically

The servers will run in separate command windows. Close those windows to stop the servers.

---

## Option 2: Git Bash Script

**Run in Git Bash terminal:**
```bash
./start-servers.sh
```

---

## Option 3: Manual Start (VS Code Terminal)

### Terminal 1 - Backend:
```bash
cd backend
node index.js
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

---

## 🌐 Access the Application

Once both servers are running, open:

**👉 http://localhost:8080**

---

## ✅ What Should Be Running

Before starting the app, make sure:

1. **MongoDB Service** - Running on port 27017
   - Check: Windows Services → "MongoDB Server"
   - Or check in terminal: `netstat -an | findstr "27017"`

2. **Backend Server** - Will start on port 5000
   - Handles API requests
   - Connects to Google Gemini AI
   - Uses FREE `models/gemini-1.5-flash` model

3. **Frontend Server** - Will start on port 8080
   - React + Vite development server
   - User interface

---

## 🛑 Stopping the Servers

### If using start-servers.bat:
- Close the two command windows that opened

### If using VS Code terminals:
- Press `Ctrl+C` in each terminal

### Force kill all Node processes:
```bash
taskkill /F /IM node.exe
```

---

## 🔧 Troubleshooting

### "Port already in use" error:
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Or kill specific ports
netstat -ano | findstr ":8080"
netstat -ano | findstr ":5000"
# Then: taskkill /F /PID <process_id>
```

### MongoDB not running:
```bash
# Start MongoDB service
net start MongoDB
```

### Gemini API error:
- Check `backend/.env` has your API key
- Model should be: `models/gemini-1.5-flash`
- Get FREE API key at: https://aistudio.google.com/app/apikey

---

## 📝 First Time Setup

1. **Install Dependencies:**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

2. **Configure Environment:**
   - Copy `backend/.env.example` to `backend/.env`
   - Add your Gemini API key

3. **Start MongoDB Service:**
   - Windows Services → Start "MongoDB Server"

4. **Run the application:**
   - Double-click `start-servers.bat`

---

## 🎯 Using the Application

1. **Sign Up** - Create account with your name
2. **Login** - Access the dashboard
3. **Analyze** - Enter URL + keyword or manual business data
4. **Results** - Get FREE AI-powered SEO insights!

---

## 💰 Cost

**100% FREE!**
- No credit card required
- Gemini 1.5 Flash model is completely free
- 1,500 analyses per day (FREE tier limit)

---

## 📞 Need Help?

Check these files for more info:
- `GEMINI_FREE_MODEL.md` - Details about FREE Gemini model
- `BACKEND_COMPLETE.md` - Backend setup guide
- `REAL_AI_INTEGRATION.md` - AI integration documentation
- `SUCCESS.md` - Testing examples

---

**Enjoy your FREE AI-powered SEO analyzer!** 🎉
