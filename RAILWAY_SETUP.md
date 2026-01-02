# Railway Deployment Steps

## ✅ Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `impostor-game` (or any name you prefer)
3. Make it **Public** (required for Railway free tier) or Private (if you have Railway Pro)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## ✅ Step 2: Push Code to GitHub

After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/impostor-game.git

# Push to GitHub
git push -u origin master
```

Or if you prefer SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/impostor-game.git
git push -u origin master
```

## ✅ Step 3: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login**: Click "Login" → "Login with GitHub"
3. **Authorize Railway**: Allow Railway to access your GitHub repositories
4. **Create New Project**:
   - Click "New Project" or "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Find and select your `impostor-game` repository
   - Click "Deploy Now"

## ✅ Step 4: Configure Build Settings

Railway should auto-detect Node.js, but let's verify:

1. Click on your service (the deployed app)
2. Go to **Settings** tab
3. Scroll to **Build & Deploy**
4. Verify:
   - **Build Command**: `npm run build:all` (or leave empty, Railway will auto-detect)
   - **Start Command**: `npm start`
   - **Root Directory**: `.` (root)

## ✅ Step 5: Set Environment Variables

1. In your Railway service, go to **Variables** tab
2. Click **+ New Variable** and add:

   **Variable 1:**
   - Name: `NODE_ENV`
   - Value: `production`

   **Variable 2:**
   - Name: `CLIENT_URL`
   - Value: `https://YOUR-APP-NAME.up.railway.app` 
   - ⚠️ **Wait!** Railway will give you a URL after deployment. Come back and update this.

   **Variable 3:**
   - Name: `VITE_SOCKET_URL`
   - Value: `https://YOUR-APP-NAME.up.railway.app`
   - ⚠️ **Same as above** - use your Railway URL

## ✅ Step 6: Get Your App URL

1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Scroll to **Domains**
4. You'll see a URL like: `impostor-game-production.up.railway.app`
5. Click on it or copy it

## ✅ Step 7: Update Environment Variables with Real URL

1. Go back to **Variables** tab
2. Update `CLIENT_URL` with your actual Railway URL
3. Update `VITE_SOCKET_URL` with your actual Railway URL
4. Railway will automatically redeploy when you save

## ✅ Step 8: Test Your App

1. Visit your Railway URL
2. Try creating a game
3. Open in another browser/device and join with the codeword
4. Test the multiplayer features

## 🎉 Done!

Your app is now live! Share the Railway URL with your friends.

---

## 🔧 Troubleshooting

### Build Fails?
- Check the **Deployments** tab for error logs
- Make sure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run build`

### WebSockets Not Working?
- Check that `CLIENT_URL` and `VITE_SOCKET_URL` match your Railway URL exactly
- Make sure the URL starts with `https://`
- Check browser console for connection errors

### App Shows "Cannot GET /"?
- Make sure `NODE_ENV=production` is set
- Verify the build completed successfully
- Check that `dist/client` folder exists after build

### Need Help?
- Check Railway logs in the **Deployments** tab
- Railway has great documentation: https://docs.railway.app

