# Test Your Backend

## Step 1: Check if Backend is Awake
1. Go to your Render dashboard
2. Click on "UTMUN-Delegate-Tracker" (the Node backend)
3. Click the **"Logs"** tab
4. Look for recent activity

## Step 2: Test Backend URL
1. Copy your backend URL from Render (e.g., `https://utmun-delegate-tracker.onrender.com`)
2. Open a new browser tab
3. Go to: `YOUR_BACKEND_URL/api/health`
4. You should see: `{"status":"ok"}`

If you get an error or "not found" - the backend is sleeping. Click "Manual Deploy" → "Deploy latest commit" to wake it up.

## Step 3: Verify Environment Variable
1. Click on "UTMUN-Delegate-Tracker-1" (Static site)
2. Go to "Environment" 
3. Check that `VITE_API_URL` exists
4. Value should be your backend URL

## Step 4: Test Full URL
Go to: `YOUR_FRONTEND_URL/api/dashboard`
- If you see data = frontend has wrong backend URL
- If you see "not found" = frontend not configured correctly
- If you see error = backend issue

Tell me what you see!

