# How to Push to GitHub

You need to authenticate with GitHub. Here are your options:

## Option 1: Personal Access Token (Recommended)

1. **Create a token:**
   - Go to: https://github.com/settings/tokens/new
   - Name: `Railway Deployment`
   - Expiration: `90 days` (or your choice)
   - Check the box: **`repo`** (this gives full repository access)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (starts with `ghp_...`) - you won't see it again!

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   
   When prompted:
   - **Username**: `nicoduo`
   - **Password**: Paste your token (NOT your GitHub password)

## Option 2: Use GitHub Desktop (Easiest)

1. Download GitHub Desktop: https://desktop.github.com
2. Install and sign in with your GitHub account
3. In GitHub Desktop:
   - Click "File" → "Add Local Repository"
   - Navigate to: `/Users/pghloanerc-5461/Desktop/impostor`
   - Click "Add Repository"
   - Click "Publish repository" button
   - Make sure "Keep this code private" is unchecked (if you want it public)
   - Click "Publish Repository"

## Option 3: Use SSH (If you have SSH keys set up)

If you have SSH keys configured with GitHub:

```bash
git remote set-url origin git@github.com:nicoduo/impostor-game.git
git push -u origin main
```

## After Pushing Successfully

Once your code is on GitHub, you can deploy to Railway:

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `nicoduo/impostor-game`
5. Railway will automatically deploy!

---

**Quick Test:** After pushing, you should see your files at:
https://github.com/nicoduo/impostor-game

