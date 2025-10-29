# 🚀 SiteSage AI - Quick Start Guide

## ✅ All Backend Tasks Completed!

Your backend is **100% ready** with:
- ✅ Google Gemini 1.5 Flash AI (FREE)
- ✅ Web scraping service
- ✅ MongoDB database models
- ✅ JWT authentication
- ✅ Express REST API
- ✅ Security middleware
- ✅ Rate limiting

---

## 🎯 Next Steps to Run Your Backend:

### Step 1: Get FREE Gemini API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

### Step 2: Set Up Environment Variables

1. Navigate to backend folder:
```bash
cd c:\ai-ad-strategist\ai-ad\site-sage-ai-76-main\backend
```

2. Create `.env` file (copy from example):
```bash
copy .env.example .env
```

3. Edit `.env` file and add your credentials:
```env
# Required - Get FREE at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...YOUR_ACTUAL_KEY_HERE...

# MongoDB (choose one option):
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/sitesage-ai

# Option B: FREE MongoDB Atlas (recommended)
# Sign up: https://www.mongodb.com/cloud/atlas/register
# Get connection string and paste here:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sitesage-ai

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Server Port
PORT=5000
```

### Step 3: Install MongoDB (if using local)

**Option A: Use MongoDB Atlas (FREE, Recommended)**
- No installation needed
- Sign up at: https://www.mongodb.com/cloud/atlas/register
- Get free 512MB database
- Copy connection string to `.env`

**Option B: Install MongoDB Locally**
- Windows: Download from https://www.mongodb.com/try/download/community
- Run MongoDB service

### Step 4: Start the Backend Server

```bash
npm start
```

You should see:
```
🚀 =====================================
   SiteSage AI Backend Server Started
   =====================================
   🌐 Server running on port: 5000
   📍 Environment: development
   🔗 Base URL: http://localhost:5000
   📚 API Docs: http://localhost:5000/api
   =====================================

✅ MongoDB Connected: localhost
📁 Database Name: sitesage-ai
```

---

## 🧪 Test Your Backend

### Test 1: Health Check
Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-29T...",
  "uptime": 5.123,
  "environment": "development"
}
```

### Test 2: Create User Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Test 3: Analyze a Website
First, login to get token, then:
```bash
curl -X POST http://localhost:5000/api/analysis/analyze-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"url\":\"https://example.com\"}"
```

---

## 🔗 Connect Frontend to Backend

Update your frontend API base URL to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📊 Backend Features

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Analysis Routes (Requires Auth)
- `POST /api/analysis/analyze-url` - Analyze website URL
- `POST /api/analysis/generate-strategy` - Generate SEO strategy (manual)
- `GET /api/analysis/history` - Get user's analysis history
- `GET /api/analysis/:id` - Get specific analysis
- `DELETE /api/analysis/:id` - Delete analysis

### User Quotas (Free Plan)
- 10 analyses per month
- Auto-resets monthly
- Quota tracked per user

---

## 💰 Cost Breakdown

**Total Monthly Cost: $0.00** ✅

- Gemini 1.5 Flash: **FREE** (15 req/min, 1M tokens/day)
- MongoDB Atlas: **FREE** (512MB tier)
- Hosting options:
  - Railway: FREE tier
  - Render: FREE tier
  - Vercel: FREE (for serverless)

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
**Solution:**
- Make sure MongoDB is running locally, OR
- Use MongoDB Atlas (FREE): https://www.mongodb.com/cloud/atlas/register
- Check `MONGODB_URI` in `.env`

### "GEMINI_API_KEY not set"
**Solution:**
- Get FREE key: https://aistudio.google.com/app/apikey
- Add to `.env` file
- Restart server

### "Port 5000 already in use"
**Solution:**
- Change `PORT=5001` in `.env`
- Or kill process using port 5000

### CORS errors from frontend
**Solution:**
- Add your frontend URL to `.env`:
```env
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

---

## 📚 Full API Documentation

See `README.md` in this folder for complete API documentation with examples.

---

## 🎉 You're All Set!

Your SiteSage AI backend is **production-ready** with:
- ✅ FREE Google Gemini AI
- ✅ Professional architecture
- ✅ Security best practices
- ✅ Scalable design
- ✅ Complete documentation

**Next:** Connect your React frontend and start analyzing websites! 🚀
