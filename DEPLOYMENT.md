# Deployment Guide

This guide covers deploying the Impostor Game to various platforms.

## Prerequisites

1. Build the application:
```bash
npm run build
npm run build:client
```

2. Ensure all environment variables are set (if needed)

## Option 1: Railway (Recommended - Easiest)

### Steps:

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select this repository

3. **Configure Build Settings**
   - Railway will auto-detect Node.js
   - Build command: `npm run build && npm run build:client`
   - Start command: `npm start`

4. **Set Environment Variables** (if needed)
   - PORT will be automatically set by Railway
   - Add any other required variables in the Variables tab

5. **Deploy**
   - Railway will automatically deploy on every push to main/master
   - Your app will be available at: `https://your-app-name.up.railway.app`

### Update CORS and Socket.io settings:

After deployment, update the client to use the production URL:

1. Update `src/client/App.tsx`:
   - Change `io('http://localhost:3001')` to use environment variable
   - Or update `vite.config.ts` to handle production URLs

## Option 2: Render

### Steps:

1. **Sign up for Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select this repository

3. **Configure Service**
   - **Name**: impostor-game (or your choice)
   - **Environment**: Node
   - **Build Command**: `npm run build && npm run build:client`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your app will be at: `https://your-app-name.onrender.com`

## Option 3: Google Cloud Platform (App Engine)

### Steps:

1. **Install Google Cloud SDK**
   ```bash
   # macOS
   brew install google-cloud-sdk
   ```

2. **Create app.yaml**
   ```yaml
   runtime: nodejs20
   env: standard
   instance_class: F1
   automatic_scaling:
     min_instances: 0
     max_instances: 2
   ```

3. **Deploy**
   ```bash
   gcloud app deploy
   ```

## Option 4: Vercel + Railway (Frontend/Backend Split)

### For Frontend (Vercel):
1. Sign up at https://vercel.com
2. Import your GitHub repo
3. Set build command: `npm run build:client`
4. Set output directory: `dist/client`

### For Backend (Railway):
1. Deploy backend to Railway (see Option 1)
2. Update frontend to point to Railway backend URL

## Important Notes:

1. **CORS Configuration**: Update server.ts to allow your production domain
2. **Socket.io**: Ensure WebSocket connections work through your hosting provider
3. **Environment Variables**: Set PORT and any other needed variables
4. **Build Process**: Make sure both frontend and backend are built before deployment

## Post-Deployment Checklist:

- [ ] Update CORS settings in server.ts
- [ ] Update Socket.io client URL in App.tsx
- [ ] Test game creation and joining
- [ ] Test real-time features (WebSocket connections)
- [ ] Verify all languages work correctly
- [ ] Test on mobile devices

