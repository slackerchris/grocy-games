# Quick Setup Guide

## Prerequisites
- Node.js 16+ installed
- A running Grocy instance
- Your Grocy API token

## Step 1: Configure Environment

Create `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your Grocy details:
```
GROCY_URL=http://localhost:81
GROCY_API_TOKEN=your_api_token_here
PORT=5000
NODE_ENV=development
```

## Step 2: Run the App

### Option A: Using VS Code Tasks
1. Press `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)
2. Select "Run All (Backend + Frontend)"
3. Wait for both servers to start
4. Open http://localhost:3000

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open http://localhost:3000

## Verify It Works

1. Check the green status indicator at the top
2. It should show "✓ Connected to Grocy at {your_grocy_url}"
3. Select an item and use Add/Remove buttons

## Troubleshooting

### "Cannot connect to Grocy"
```bash
# Test your Grocy API endpoint directly
curl -H "GROCY-API-KEY: your_token" http://localhost:81/api/objects/products
```

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Edit `frontend/vite.config.js` and change `port: 3000`

### No products showing
- Ensure Grocy has products created
- Verify API token has read permissions

## Next Steps

- Customize the UI colors in `frontend/src/index.css`
- Add more endpoints in `backend/server.js`
- Deploy to your server (see README.md)
