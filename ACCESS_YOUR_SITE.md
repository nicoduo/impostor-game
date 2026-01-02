# How to Access Your Deployed Site

## 🎉 Your app is deployed! Here's how to access it:

### Step 1: Get Your Railway URL

1. Go to https://railway.app
2. Click on your project
3. Click on your service (the deployed app)
4. Go to **Settings** tab
5. Scroll down to **Domains** section
6. You'll see a URL like: `impostor-game-production.up.railway.app`
7. **Copy this URL** - this is your live site!

### Step 2: Set Environment Variables (IMPORTANT!)

Your app needs these variables to work correctly:

1. In Railway, go to your service → **Variables** tab
2. Click **+ New Variable** and add:

   **Variable 1:**
   - Name: `NODE_ENV`
   - Value: `production`

   **Variable 2:**
   - Name: `CLIENT_URL`
   - Value: `https://YOUR-RAILWAY-URL.up.railway.app`
   - ⚠️ Replace `YOUR-RAILWAY-URL` with your actual Railway URL from Step 1

   **Variable 3:**
   - Name: `VITE_SOCKET_URL`
   - Value: `https://YOUR-RAILWAY-URL.up.railway.app`
   - ⚠️ Same URL as above

3. Save the variables
4. Railway will automatically redeploy

### Step 3: Access Your Site

1. Open your browser
2. Go to: `https://YOUR-RAILWAY-URL.up.railway.app`
3. You should see the Impostor Game!

### Step 4: Test It

1. **Create a game:**
   - Enter your name
   - Click "Create New Game"
   - You'll get a codeword

2. **Join from another device/browser:**
   - Open the same URL on another device or incognito window
   - Enter your name and the codeword
   - Click "Join Game"

3. **Play!**
   - Test all the features
   - Make sure real-time updates work

### 🎯 Quick Access

Once you have your URL, you can:
- Share it with friends to play together
- Bookmark it for easy access
- Use it on any device (mobile, tablet, desktop)

### 🔧 Troubleshooting

**If the site doesn't load:**
- Make sure you're using `https://` (not `http://`)
- Check that environment variables are set correctly
- Wait a minute after setting variables for redeployment

**If WebSockets don't work:**
- Verify `CLIENT_URL` and `VITE_SOCKET_URL` match your Railway URL exactly
- Make sure they start with `https://`
- Check browser console for errors (F12 → Console)

**If you see connection errors:**
- The environment variables might not be set
- Railway might still be redeploying (wait 1-2 minutes)

---

## 🎮 You're all set!

Your multiplayer Impostor game is now live and accessible from anywhere in the world!

Share your Railway URL with friends and start playing! 🎉

