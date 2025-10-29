# SiteSage AI Backend

Backend API for SiteSage AI - Autonomous SEO & AEO Optimization Agent

## 🚀 Features

- **Google Gemini 1.5 Flash Integration** (FREE AI API)
- **Web Scraping** with Cheerio
- **MongoDB** database with Mongoose ODM
- **JWT Authentication**
- **Rate Limiting** & Security (Helmet)
- **RESTful API** design

## 📋 Prerequisites

- Node.js 20.x or higher
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key (FREE from https://aistudio.google.com/app/apikey)

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Edit `.env` and add your credentials:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/sitesage-ai
JWT_SECRET=your_strong_secret_key_here
PORT=5000
```

4. **Get FREE Gemini API Key:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy and paste into `.env`

## 🎯 Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Analysis

#### Analyze URL
```http
POST /api/analysis/analyze-url
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "url": "https://example.com"
}
```

#### Generate Strategy (Manual Input)
```http
POST /api/analysis/generate-strategy
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Best SEO Practices 2025",
  "description": "Complete guide to SEO",
  "keywords": ["seo", "optimization", "ranking"],
  "content": "Your article content here..."
}
```

#### Get Analysis History
```http
GET /api/analysis/history?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Specific Analysis
```http
GET /api/analysis/:analysisId
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Analysis
```http
DELETE /api/analysis/:analysisId
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   ├── User.js              # User schema
│   └── Analysis.js          # Analysis schema
├── routes/
│   ├── auth.js              # Auth endpoints
│   └── analysis.js          # Analysis endpoints
├── services/
│   ├── geminiService.js     # Google Gemini AI integration
│   └── webScraper.js        # Web scraping service
├── index.js                 # Express server
├── package.json
└── .env.example
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - DDoS protection (15 req/min)
- **bcrypt** - Password hashing (10 rounds)
- **JWT** - Secure token authentication
- **Input Validation** - Mongoose + Validator

## 💰 Cost

**$0.00** - Completely FREE!

- Google Gemini 1.5 Flash: FREE (15 req/min, 1M tokens/day)
- MongoDB Atlas: FREE tier (512MB)
- All other packages: Open source

## 🐛 Troubleshooting

### "GEMINI_API_KEY not found"
- Make sure you created `.env` file
- Get FREE key: https://aistudio.google.com/app/apikey
- Restart server after adding key

### "MongoDB connection failed"
- Install MongoDB locally, OR
- Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas
- Update `MONGODB_URI` in `.env`

### "CORS error"
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Example: `ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173`

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Support

For issues or questions, open an issue on GitHub.

---

**Made with ❤️ by SiteSage AI Team**
