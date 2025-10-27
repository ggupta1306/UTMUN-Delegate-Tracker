# Deployment Guide for UTMUN Delegate Tracker

## Deploy the Backend

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect it's a Node.js project
5. **Set Environment Variables**:
   - `GOOGLE_CLIENT_EMAIL` - Your service account email
   - `GOOGLE_PRIVATE_KEY` - Your private key (with `\n` kept as is)
   - `SPREADSHEET_ID` - Your Google Sheet ID
   - `PORT` - Railway will set this automatically
6. Railway will provide a URL like `https://your-app.up.railway.app`
7. Copy this URL - you'll need it for the frontend

### Option 2: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. **Set Environment Variables** in the dashboard
8. Render will provide a URL

## Deploy the Frontend

### Option 1: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Import your GitHub repository
3. Set the root directory to `frontend`
4. **Environment Variables**:
   - `VITE_API_URL` - Your backend URL (e.g., `https://your-app.up.railway.app`)
5. Deploy!

**Important**: Update the frontend to use the environment variable for the API URL.

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import from Git"
3. Select your repository
4. Set build command: `cd frontend && npm install && npm run build`
5. Set publish directory: `frontend/dist`
6. Set environment variables in Site settings

## Update Frontend to Use Production API

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.up.railway.app
```

Then update API calls in the frontend to use `import.meta.env.VITE_API_URL` instead of hardcoded URLs.

## Quick Deploy Commands

### For Railway (Backend):
```bash
cd backend
railway login
railway init
railway up
```

### For Vercel (Frontend):
```bash
cd frontend
npm install -g vercel
vercel
```

## Notes

- Make sure your Google Sheet is shared with the service account email
- Keep your `.env` file secure - never commit it to GitHub
- The frontend will auto-refresh data every 30 seconds
- Both services will restart automatically on code updates if connected to GitHub

