# UTMUN 2026 Delegate Tracker

A modern, mobile-first web application for tracking delegate registrations and data.

## Features

- 📊 **Dashboard**: View real-time statistics, registration phases, and sparkline graphs
- 📈 **Charts**: Advanced analytics with committee assignments and registration trends
- 🔍 **Delegate Search**: Look up individual delegate information instantly
- 🎨 **Glassmorphic UI**: Beautiful iOS-style frosted glass design with tablecloth background

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Backend**: Node.js, Express
- **Data**: Google Sheets API
- **Styling**: CSS with glassmorphism effects

## Setup

### Prerequisites

- Node.js and npm installed
- Google Sheets API credentials

### Installation

1. Clone the repository
```bash
git clone YOUR_REPO_URL
cd UTMUN-APP
```

2. Set up Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your Google Sheets credentials to .env
npm start
```

3. Set up Frontend
```bash
cd ../frontend
npm install
npm run dev
```

## Deployment

See `DEPLOY.md` for detailed deployment instructions.

## Environment Variables

### Backend (.env)
- `GOOGLE_CLIENT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Private key from service account JSON
- `SPREADSHEET_ID` - Your Google Sheet ID

## Usage

Visit `http://localhost:3000` to access the application.

- **Dashboard**: View daily statistics and registration trends
- **Charts**: See committee assignments and registration analytics
- **Search**: Enter a delegate number to retrieve their information

## License

Private project for UTMUN 2026
