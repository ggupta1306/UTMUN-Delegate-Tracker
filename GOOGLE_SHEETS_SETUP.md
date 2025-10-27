# Google Sheets API Setup Guide

Follow these steps to get your Google Sheets API working:

## Step 1: Create a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Create Project" or select an existing one
3. Name it something like "UTMUN Delegate Tracker"
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Give it a name like "utmun-sheet-reader"
4. Click "Create and Continue"
5. Skip the optional step (click "Continue")
6. Click "Done"

## Step 4: Create and Download JSON Key

1. In the Credentials page, find your new service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON" and click "Create"
6. The JSON file will download automatically
7. **Save this file** - you'll need it next!

## Step 5: Copy Information from JSON

Open the downloaded JSON file. You'll see something like:

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  ...
}
```

Copy these values (we'll use them in a moment):
- `client_email`
- `private_key`

## Step 6: Share Your Google Sheet

1. Open your Google Sheet
2. Click "Share" (top right)
3. Enter the email address from `client_email` in your JSON file
4. Give it "Editor" permissions
5. Click "Share" or "Send"
6. This allows the service account to read/write your sheet

## Step 7: Get Your Spreadsheet ID

1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
3. Copy the `SPREADSHEET_ID_HERE` part

## Step 8: Create .env File

1. Navigate to the `backend` folder
2. Create a file called `.env`
3. Paste this content:

```env
SPREADSHEET_ID=paste_your_spreadsheet_id_here
GOOGLE_CLIENT_EMAIL=paste_your_client_email_here
GOOGLE_PRIVATE_KEY="paste_your_private_key_here"
PORT=3001
```

4. Replace the values with your actual data:
   - `SPREADSHEET_ID`: The ID you copied in Step 7
   - `GOOGLE_CLIENT_EMAIL`: The `client_email` from your JSON file
   - `GOOGLE_PRIVATE_KEY`: The `private_key` from your JSON file (keep the quotes!)

## Step 9: Test It!

1. Make sure you're in the `backend` folder
2. Run:
   ```bash
   npm install
   npm start
   ```
3. You should see: "Server running on port 3001"

## Troubleshooting

### Error: "The caller does not have permission"
- Make sure you shared the Google Sheet with the service account email
- Double-check that the email matches exactly

### Error: "Invalid credentials"
- Check that your `.env` file is in the `backend` folder
- Make sure the private key has the `\n` characters (keep the quotes!)
- Verify all three values (SPREADSHEET_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY)

### Can't find .env file
- Create it in the `backend` folder, not the root
- Make sure it's named exactly `.env` (not `.env.txt`)

## Quick Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created service account
- [ ] Downloaded JSON key file
- [ ] Shared Google Sheet with service account email
- [ ] Got Spreadsheet ID from URL
- [ ] Created `.env` file in `backend` folder
- [ ] Filled in all values in `.env`
- [ ] Installed dependencies (`npm install`)
- [ ] Started backend server (`npm start`)

Once you see "Server running on port 3001", you're ready to go! 🎉

