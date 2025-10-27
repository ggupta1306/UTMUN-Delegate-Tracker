# Backend Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google Sheets API:**
   - Follow the detailed guide in `../GOOGLE_SHEETS_SETUP.md`
   - Create a `.env` file in this folder with your credentials

3. **Start the server:**
   ```bash
   npm start
   ```

## .env File Template

Create a file called `.env` in this folder with:

```env
SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CLIENT_EMAIL=your_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=3001
```

## Testing the Connection

Once the server is running, you can test the connection by visiting:
- `http://localhost:3001/api/health`

You should see: `{"status":"ok"}`

## API Endpoints

- `GET /api/health` - Check if server is running
- `POST /api/delegate` - Submit delegate number and get data (coming soon)

For detailed setup instructions, see `../GOOGLE_SHEETS_SETUP.md`.

