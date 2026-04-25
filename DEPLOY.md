# Deploy to Render - Step by Step Guide

## Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account (recommended) or email
3. Verify your email if required

## Step 2: Connect GitHub Repo
1. In Render dashboard, click **"New +"** button
2. Select **"Blueprint"** (not Web Service or Static Site)
3. Find your repository: `Dolby-Shekhar/E-commerce_AI`
4. Click **"Connect"**

## Step 3: Render Detects render.yaml
Render will automatically read your `render.yaml` file and:
- Create a **Web Service** called `ecommerce-fullstack`
- Set build commands
- Configure environment variables

Review the settings shown, then click **"Apply"**

## Step 4: Wait for Deployment
- Render will build your app (install dependencies + build React)
- This takes 3-5 minutes
- You'll see logs in real-time
- Status changes from "Building" → "Deploying" → "Live"

## Step 5: Update Frontend API URL
Once deployed, Render gives you a URL like:
```
https://ecommerce-fullstack-xxx.onrender.com
```

You need to update your frontend to use this URL. Add these environment variables in Render dashboard:

1. Go to your service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Add:
   - Key: `FRONTEND_URL` → Value: your Render URL
   - Key: `REACT_APP_API_URL` → Value: your Render URL + `/api`

## Step 6: Seed the Database
After deployment is live, seed sample data:

**Option A - Using Render Shell:**
1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend && node data/seeder.js
   ```

**Option B - Using your local terminal:**
```bash
# Set your production MongoDB URI temporarily
$env:MONGO_URI="mongodb+srv://Dolby:Dolby2871@cluster0.cmpavar.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
cd backend
node data/seeder.js
```

## Step 7: Verify Everything Works
Open your Render URL and check:

| Test | Expected Result |
|------|----------------|
| Homepage loads | See products list |
| Login/Register | Create account works |
| Admin Login | `admin@eshop.com` / `admin123` |
| Add to Cart | Cart updates |
| AI Chatbot | Bottom-right icon works |
| AI Recommendations | Appears after browsing |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check logs in Render dashboard → "Logs" tab |
| MongoDB connection error | Verify `MONGO_URI` is correct in Environment variables |
| CORS errors | Ensure `FRONTEND_URL` matches your actual domain |
| 404 on refresh | Configure React Router fallback in server.js |

## Optional: Custom Domain
1. Buy domain from Namecheap/GoDaddy
2. In Render dashboard → **Settings** → **Custom Domain**
3. Add your domain and follow DNS instructions

You're live! 🚀
