# 🗄️ MongoDB + Authentication Guide

## ✅ Current Status

**MongoDB Service:** ✅ Running  
**Database Name:** `sitesage-ai`  
**Connection:** `mongodb://localhost:27017/sitesage-ai`

---

## 📊 What MongoDB Stores

### 1. **Users Collection**
Stores user accounts with:
- `name` - User's full name (e.g., "Kushal HM")
- `email` - Login email (unique)
- `password` - Hashed with bcrypt (secure)
- `createdAt` - Account creation date
- `analysisQuota` - Daily analysis limit (default: 10)
- `lastReset` - When quota was last reset

### 2. **Analyses Collection**
Stores SEO analysis history:
- `userId` - Reference to user
- `url` or `businessName` - What was analyzed
- `keyword` - Target keyword
- `results` - Full SEO/AEO analysis from Gemini AI
  - `seoScore` - SEO rating (0-100)
  - `aeoScore` - AEO rating (0-100)
  - `recommendations` - Action items
  - `keywordStrategy` - Keyword suggestions
  - `metaTags` - Optimized meta tags
  - `contentSuggestions` - Blog ideas
- `scrapedContent` - Raw data from website
- `geminiResponse` - Full AI response
- `createdAt` - Analysis timestamp

---

## 🔐 Authentication Flow

### **Signup Process:**
1. User enters: Name, Email, Password
2. Backend validates:
   - Email format
   - Password length (min 8 chars)
   - Email not already used
3. Password is **hashed** with bcrypt (not stored as plain text)
4. User saved to MongoDB
5. JWT token generated
6. Token + user data returned to frontend
7. Frontend stores in `localStorage`:
   - `token` - For API authentication
   - `user` - User name + email

### **Login Process:**
1. User enters: Email, Password
2. Backend finds user by email
3. Compares password with bcrypt hash
4. If match → generates JWT token
5. Returns token + user data
6. Frontend stores in localStorage

### **Protected Routes:**
Every analysis request includes:
```javascript
Authorization: Bearer <token>
```

Backend middleware (`backend/middleware/auth.js`):
1. Extracts token from header
2. Verifies JWT signature
3. Decodes user ID
4. Attaches user to request
5. Allows or denies access

---

## 🗂️ Viewing Data in MongoDB Compass

### **Step 1: Open MongoDB Compass**
- You already have it installed

### **Step 2: Connect**
- Connection String: `mongodb://localhost:27017`
- Click "Connect"

### **Step 3: Select Database**
- Database: `sitesage-ai`

### **Step 4: View Collections**

**Users Collection:**
```json
{
  "_id": "673a1b2c...",
  "name": "Kushal HM",
  "email": "kushal@example.com",
  "password": "$2b$10$...", // Hashed - NOT plain text
  "analysisQuota": {
    "daily": 10,
    "used": 3,
    "lastReset": "2025-10-29T00:00:00.000Z"
  },
  "createdAt": "2025-10-29T10:30:00.000Z"
}
```

**Analyses Collection:**
```json
{
  "_id": "673a2d4e...",
  "userId": "673a1b2c...",
  "url": "https://www.nike.com",
  "keyword": "shoes",
  "results": {
    "seoScore": 85,
    "aeoScore": 78,
    "overallScore": 82,
    "recommendations": [
      {
        "title": "Add Schema Markup",
        "priority": "high",
        "description": "..."
      }
    ],
    "keywordStrategy": {
      "primary": "nike shoes",
      "lsi": ["athletic footwear", "running shoes"],
      "longTail": ["nike running shoes for men"]
    }
  },
  "createdAt": "2025-10-29T11:00:00.000Z"
}
```

---

## 🔧 Testing the System

### **Test 1: Create Account**

1. Go to: http://localhost:8080
2. Click "Sign Up"
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Create Account"

**Expected Result:**
- ✅ Redirected to Dashboard
- ✅ Name "Test User" shows in top-right
- ✅ User saved to MongoDB

**Verify in Compass:**
- Open `sitesage-ai` database
- Click `users` collection
- See your new user

---

### **Test 2: Login**

1. Logout (if logged in)
2. Click "Login"
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In"

**Expected Result:**
- ✅ Logged in successfully
- ✅ Name appears in navigation
- ✅ Access to Dashboard

---

### **Test 3: Analyze Website**

1. In Dashboard, enter:
   - URL: `https://www.nike.com`
   - Keyword: `shoes`
   - Industry: `E-commerce`
2. Select focus areas (Technical SEO, Content, etc.)
3. Click "Analyze Website"

**Expected Result:**
- ✅ Shows "Analyzing..." loading state
- ✅ Redirects to Results page
- ✅ Shows real AI analysis from Gemini
- ✅ Analysis saved to MongoDB

**Verify in Compass:**
- Open `analyses` collection
- See your analysis with full results

---

### **Test 4: View Analysis History**

**Backend Route:** `GET /api/analysis/history`

In your browser console (F12):
```javascript
fetch('http://localhost:5000/api/analysis/history', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Result:**
- List of all your past analyses

---

## 🚨 Common Issues & Solutions

### **Issue 1: "MongoDB not connected"**

**Check if running:**
```powershell
Get-Service MongoDB
```

**Start if stopped:**
```powershell
net start MongoDB
```

---

### **Issue 2: "User already exists"**

**Solution:** Email is already registered.
- Use different email
- Or delete user from Compass:
  1. Open `users` collection
  2. Find user by email
  3. Click trash icon → Delete

---

### **Issue 3: "No token provided"**

**Cause:** User not logged in or token expired

**Solution:**
1. Logout
2. Login again
3. Token will refresh

---

### **Issue 4: "Analysis quota exceeded"**

**Current Limit:** 10 analyses per day per user

**Reset Quota Manually in Compass:**
1. Open `users` collection
2. Find your user
3. Edit document:
   ```json
   "analysisQuota": {
     "daily": 10,
     "used": 0,
     "lastReset": "2025-10-29T00:00:00.000Z"
   }
   ```
4. Save

**Or increase limit:**
```json
"analysisQuota": {
  "daily": 100,  // Increase limit
  "used": 0
}
```

---

## 📈 Quota System

**How it works:**

1. **Daily Reset:**
   - Every 24 hours, `used` resets to 0
   - Automatic reset on first analysis of new day

2. **Tracking:**
   ```javascript
   // Before analysis
   if (user.analysisQuota.used >= user.analysisQuota.daily) {
     throw new Error('Daily quota exceeded');
   }
   
   // After analysis
   user.analysisQuota.used += 1;
   await user.save();
   ```

3. **Customization:**
   - Edit `backend/models/User.js` to change default quota
   - Premium users could have higher limits

---

## 🔐 Security Features

### ✅ **Password Security**
- Passwords **never** stored in plain text
- bcrypt hashing (10 rounds)
- Salt automatically generated

### ✅ **JWT Tokens**
- Signed with secret key
- Expires after 30 days
- Cannot be forged

### ✅ **API Protection**
- All analysis routes require authentication
- Middleware checks token on every request
- Invalid token = 401 Unauthorized

---

## 📊 Monitoring Users

### **View All Users:**
In MongoDB Compass:
1. Database: `sitesage-ai`
2. Collection: `users`
3. See all registered users

### **View User's Analyses:**
1. Copy user's `_id` from `users` collection
2. Go to `analyses` collection
3. Filter: `{ "userId": "paste-id-here" }`
4. See all analyses by that user

---

## 🎯 Next Steps

### **Add Features:**

1. **Password Reset**
   - Email verification
   - Reset token

2. **Email Verification**
   - Send confirmation email
   - Verify before allowing login

3. **Premium Tiers**
   - Free: 10 analyses/day
   - Pro: 100 analyses/day
   - Enterprise: Unlimited

4. **User Dashboard**
   - Show analysis history
   - Download reports
   - Compare analyses

5. **Team Accounts**
   - Multiple users per organization
   - Shared quota

---

## ✅ Summary

Your MongoDB setup includes:
- ✅ User authentication (signup/login)
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token-based sessions
- ✅ Analysis history storage
- ✅ Daily quota system
- ✅ MongoDB Compass for viewing data

**Everything is ready!** Just start the servers with `start-servers.bat` and begin testing! 🚀
