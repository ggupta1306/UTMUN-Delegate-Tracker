# Super Simple Deployment - 5 Minutes

## Option 1: Render (Easiest - 3 clicks!)

1. Go to https://render.com and sign up with GitHub
2. Push your code to GitHub (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy Backend:**
   - Click "New" → "Web Service"
   - Choose your repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `GOOGLE_CLIENT_EMAIL`
     - `GOOGLE_PRIVATE_KEY` 
     - `SPREADSHEET_ID`
   - Click "Create Web Service"
   - Copy the URL (e.g., `https://your-backend.onrender.com`)

4. **Deploy Frontend:**
   - Click "New" → "Static Site"
   - Choose your repo
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Click "Create Static Site"
   
5. Done! Your app is live!

## Option 2: GitHub Pages (Frontend only, free forever)

The backend needs to stay deployed on Render/Railway.

## Your App URLs:
- Backend: https://your-backend.onrender.com
- Frontend: https://your-frontend.onrender.com

Both update automatically when you push to GitHub!

