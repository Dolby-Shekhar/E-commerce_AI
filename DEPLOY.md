# Deploy to Render - Step by Step Guide (FREE - No Credit Card Required)

> **Note:** Render Blueprint requires a card. Use **Web Service** (free tier) instead.

---

## Method 1: Single Web Service on Render (Recommended - FREE)

This deploys both frontend and backend as one free web service.

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with **GitHub**
3. **No credit card needed** for free tier

### Step 2: Create Web Service (NOT Blueprint)
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `Dolby-Shekhar/E-commerce_AI`
3. Click **"Connect"**

### Step 3: Configure Settings
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `ecommerce-ai` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && cd frontend && npm install && npm run build` |
| **Start Command** | `cd backend && npm start` |
| **Plan** | Free |

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | `mongodb+srv://Dolby:Dolby2871@cluster0.cmpavar.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `any-random-secret-key-here-change-later` |
| `FRONTEND_URL` | `https://ecommerce-ai.onrender.com` |
| `ADMIN_EMAIL` | `admin@eshop.com` |
| `ADMIN_PASSWORD` | `your-admin-password-here` |

> Replace the URL in `FRONTEND_URL` with whatever Render gives you after deployment.

### Step 5: Deploy
Click **"Create Web Service"**

Wait 3-5 minutes for the build to complete.

### Step 6: Seed the Database
After deployment is live:

**Option A - Render Shell:**
1. In your service dashboard → **Shell** tab
2. Run: `cd backend && node data/seeder.js`

**Option B - Local terminal:**
```powershell
$env:MONGO_URI="mongodb+srv://Dolby:Dolby2871@cluster0.cmpavar.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
cd backend
node data/seeder.js
```

### Step 7: Update Frontend API URL (IMPORTANT)
Your frontend needs to know the backend URL. After deployment:

1. In Render dashboard → your service → **Environment**
2. Add/update:
   - `FRONTEND_URL` = your actual Render URL
   - `REACT_APP_API_URL` = your actual Render URL

3. Trigger a **new deploy**: Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Method 2: Separate Frontend + Backend (Also Free)

If you want frontend and backend on separate free services:

### Backend on Render
1. Create new **Web Service**
2. Repo: same
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add env vars (MONGO_URI, JWT_SECRET, etc.)
7. Get the backend URL (e.g., `https://ecommerce-api.onrender.com`)

### Frontend on Vercel (Free)
1. Go to https://vercel.com
2. Import your GitHub repo
3. **Framework Preset**: React
4. **Root Directory**: `frontend`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL + `/api`
6. Deploy

---

## Method 3: Railway (Alternative Free Tier)
1. Go to https://railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy (free tier available)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check logs in Render dashboard → "Logs" tab |
| MongoDB timeout | Ensure IP whitelist in MongoDB Atlas allows `0.0.0.0/0` |
| CORS errors | Update `FRONTEND_URL` to match actual domain |
| 404 on page refresh | Refresh from homepage, or add hash router |

---

## Free Tier Limits (Render)

| Limit | Value |
|-------|-------|
| Web Services | 1 free |
| Bandwidth | 100GB/month |
| Builds | 500 minutes/month |
| Sleep | Spins down after 15 min inactivity (wakes on next request ~30s delay) |

You're live! 🚀
