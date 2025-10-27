# Debug Steps

## Step 1: Check Backend Logs
1. Go to "UTMUN-Delegate-Tracker" (backend) on Render
2. Click "Logs" tab
3. Look at the most recent logs (last 2-3 minutes)
4. Is there ANY error? Copy the error if yes.

## Step 2: Test Backend Directly
Go to: `YOUR_BACKEND_URL/api/dashboard`

What do you see?
- Still error JSON?
- Different error?
- Data?

## Step 3: Check Environment Variables
1. Go to "UTMUN-Delegate-Tracker" (backend)
2. Click "Environment" tab
3. Do you see:
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `SPREADSHEET_ID`
4. Are they all filled in?

## Step 4: Check Frontend Environment Variable
1. Go to "UTMUN-Delegate-Tracker-1" (frontend)
2. Click "Environment" tab
3. What is the value of `VITE_API_URL`?
4. It should be: `https://your-backend-url.onrender.com` (no `/api` at the end!)

Tell me what you find!

