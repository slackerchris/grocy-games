# Grocy Games - Simple Inventory Manager

A lightweight web UI for managing your Grocy inventory with simple one-tap actions. Built for ease of use by family members who find Grocy's full interface overwhelming.

## Features

✅ **Simple Interface** - Clean, intuitive design for quick inventory updates  
✅ **One-Tap Actions** - Add or remove items in seconds  
✅ **Real-time Sync** - Connected to your Grocy API  
✅ **Responsive Design** - Works on phones, tablets, and desktops  
✅ **No Bloat** - Minimal setup, maximum usability  

## Project Structure

```
grocy-games/
├── backend/                 # Node.js/Express proxy server
│   ├── server.js           # Main server logic
│   ├── package.json
│   └── .env.example
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 16+ installed
- A running Grocy instance (e.g., `http://localhost:81`)
- Your Grocy API token from Settings → Authentication tokens

## Quick Start

### 1. Clone & Navigate
```bash
cd grocy-games
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Grocy details
GROCY_URL=http://localhost:81
GROCY_API_TOKEN=your_token_here
```

Install dependencies and start:
```bash
npm install
npm start
```

The backend runs on **http://localhost:5000**

### 3. Setup Frontend (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:3000**

### 4. Access the App

Open your browser to **http://localhost:3000**

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `GROCY_URL` | Your Grocy instance URL |
| `GROCY_API_TOKEN` | API token from Grocy settings |
| `NODE_ENV` | Set to `production` for deployment |

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check connection status |
| `/api/products` | GET | List all products |
| `/api/products/:id` | GET | Get single product |
| `/api/stock` | GET | Get all stock levels |
| `/api/stock/add` | POST | Add items to stock |
| `/api/stock/remove` | POST | Remove items from stock |

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set `NODE_ENV=production` in backend `.env`

3. Start backend:
```bash
cd backend
npm start
```

The backend will serve the frontend from `frontend/dist/`

## Troubleshooting

### "Cannot connect to Grocy"
- Verify `GROCY_URL` is correct in `.env`
- Check your Grocy instance is running
- Ensure the API token is valid

### Products not showing
- Confirm API token has read access
- Check browser console for errors
- Test API directly: `curl -H "GROCY-API-KEY: your_token" http://localhost:81/api/objects/products`

### Port already in use
- Change `PORT` in backend `.env`
- Change `port` in frontend `vite.config.js`

## Development

Frontend uses:
- **React 18** - UI framework
- **Vite** - Fast dev server & build tool

Backend uses:
- **Express** - Web framework
- **CORS** - Cross-origin requests
- **Node native fetch** - API calls

## License

MIT - Use freely!

## Support

Issues? Check your Grocy instance and API token first. Refer to [Grocy API docs](https://grocy.info/en/documentation/api) for more info.
