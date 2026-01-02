# Quick Deployment Guide

## 🚀 Railway (Recommended - Easiest & Free)

### Step 1: Prepare Your Code
1. Make sure your code is in a GitHub repository
2. All files are committed and pushed

### Step 2: Deploy to Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your `impostor` repository
6. Railway will automatically:
   - Detect it's a Node.js project
   - Run `npm install`
   - Build your app
   - Deploy it

### Step 3: Configure Environment Variables
1. In Railway dashboard, go to your service
2. Click on "Variables" tab
3. Add these variables:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://your-app-name.up.railway.app` (Railway will give you the URL)
   - `VITE_SOCKET_URL` = `https://your-app-name.up.railway.app` (same URL)

### Step 4: Update Build Settings (if needed)
1. Go to "Settings" → "Build & Deploy"
2. Build Command: `npm run build:all`
3. Start Command: `npm start`

### Step 5: Get Your URL
- Railway will provide a URL like: `https://impostor-game-production.up.railway.app`
- Share this URL with players!

---

## 🌐 Render (Alternative Free Option)

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `impostor` repository

### Step 3: Configure
- **Name**: `impostor-game`
- **Environment**: `Node`
- **Build Command**: `npm run build:all`
- **Start Command**: `npm start`
- **Plan**: Free

### Step 4: Set Environment Variables
- `NODE_ENV` = `production`
- `CLIENT_URL` = Your Render URL (will be provided)
- `VITE_SOCKET_URL` = Your Render URL

### Step 5: Deploy
- Click "Create Web Service"
- Render will build and deploy automatically
- Your app will be at: `https://impostor-game.onrender.com`

---

## ⚠️ Important Notes

1. **CORS**: The server is configured to accept requests from your production URL
2. **WebSockets**: Socket.io should work automatically on both platforms
3. **Free Tier Limits**:
   - Railway: Free tier available, may sleep after inactivity
   - Render: Free tier sleeps after 15 min of inactivity (wakes on request)

---

## 🔧 Troubleshooting

### If WebSockets don't work:
1. Check that `CLIENT_URL` matches your actual deployment URL
2. Verify `VITE_SOCKET_URL` is set correctly
3. Check browser console for connection errors

### If build fails:
1. Make sure all dependencies are in `package.json`
2. Check that TypeScript compiles: `npm run build`
3. Verify client builds: `npm run build:client`

### If app doesn't start:
1. Check logs in Railway/Render dashboard
2. Verify `PORT` is set (usually auto-set by platform)
3. Make sure `NODE_ENV=production`

---

## 📝 After Deployment

1. Test creating a game
2. Test joining with a codeword
3. Test real-time features (multiple players)
4. Test on mobile devices
5. Share your URL with friends!

---

## 🎯 Quick Test Commands

Before deploying, test locally in production mode:
```bash
# Build everything
npm run build:all

# Start in production mode
NODE_ENV=production npm start
```

Then visit http://localhost:3001 (or whatever PORT is set)

