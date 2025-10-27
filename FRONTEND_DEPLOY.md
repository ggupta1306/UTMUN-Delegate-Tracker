# Deploy Frontend on Render

Now that your backend is deployed, deploy the frontend:

1. **Go to your Render dashboard**
2. Click **"New"** → **"Static Site"**
3. **Connect Repository:**
   - Find and select your GitHub repository: `UTMUN-Delegate-Tracker`
4. **Settings:**
   - **Name**: `utmun-delegate-tracker-frontend` (or any name)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click **"Create Static Site"**

That's it! In ~5 minutes, Render will build and deploy your frontend.

**Your app will be live at:** `https://your-app-name.onrender.com`

No environment variables needed for the frontend!

