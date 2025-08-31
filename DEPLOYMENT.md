# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### 1. Build the Frontend
```bash
cd apps/web
npm run build
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add environment variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com` (we'll get this after backend deployment)
6. Deploy!

## Backend Deployment (Render)

### 1. Build the Backend
```bash
cd apps/server
npm run build
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `social-media-analyzer-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variables:
   - **PORT**: `10000`
   - **FRONTEND_URL**: `https://your-frontend-url.vercel.app`
6. Deploy!

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### Backend (.env.production)
```env
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Post-Deployment

1. **Test the complete flow** with sample files
2. **Verify CORS** is working between frontend and backend
3. **Take screenshots** for README
4. **Update README** with live URLs

## Quick Test Commands

```bash
# Test backend health
curl https://your-backend-url.onrender.com/api/health

# Test frontend
open https://your-frontend-url.vercel.app
```
