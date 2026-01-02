# Railway Build Fix

## The Problem
Railway was running `npm run build` which only built the TypeScript server code, not the React client.

## The Solution
I've updated `package.json` so that `npm run build` now builds both:
1. Server (TypeScript → JavaScript)
2. Client (React via Vite)

## What Changed
- `npm run build` now runs both `build:server` and `build:client`
- Added `nixpacks.toml` for Railway build configuration
- Updated `railway.json` with correct build command

## Next Steps

1. **Push the changes:**
   ```bash
   git push origin main
   ```

2. **In Railway Dashboard:**
   - Go to your service
   - Go to **Settings** → **Build & Deploy**
   - Make sure **Build Command** is: `npm run build` (or leave empty for auto-detect)
   - Make sure **Start Command** is: `npm start`

3. **Set Environment Variables:**
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = Your Railway URL (get it from Settings → Domains)
   - `VITE_SOCKET_URL` = Same as CLIENT_URL

4. **Redeploy:**
   - Railway should auto-redeploy after you push
   - Or manually trigger: Deployments → Redeploy

The build should work now! 🎉

