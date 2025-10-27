# How to Add Environment Variable on Render

## Step 1: Get Your Backend URL
1. Go to https://render.com
2. Log in to your dashboard
3. Click on your **backend service** (the one you deployed first)
4. Look at the top - you'll see a URL like: `https://utmun-backend-xxxx.onrender.com`
5. **Copy this entire URL** (including https://)

## Step 2: Add to Frontend Static Site
1. Still in Render dashboard
2. Click on your **Static Site** (the frontend)
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Enter:
   - **Key**: `VITE_API_URL`
   - **Value**: paste your backend URL (from step 1)
6. Click **"Save Changes"**

## Step 3: Rebuild
- Render will automatically rebuild your site
- Wait 2-3 minutes for it to finish
- You'll see "Deploy succeeded"

## Step 4: Test
- Click the URL to your frontend
- It should now load data from your backend!

That's it! Your app is now fully working. 🎉

