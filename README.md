# Grocy Games v1.1.0

A simple, mobile-first inventory UI for [Grocy](https://grocy.info) — built for family members who find Grocy's full interface overwhelming. Tap to consume, NFC-tag your fridge, and let Grocy handle the tracking.

## Features

- **Tap to consume** — one tap removes stock, no menus needed
- **Only shows in-stock items** — zero-quantity items are hidden automatically
- **NFC support** — tag your fridge, pantry, or snack cabinet; scanning opens a filtered view
- **User tracking** — picks up your Grocy users so each consumption is logged with a name
- **Quick consume amount** — respects the per-product "quick consume" value set in Grocy
- **Restock panel** — hidden by default; tap ⚙ to add arbitrary quantities
- **Health indicator** — collapses to a dot once connected; expands on error
- **Docker-ready** — single container, pull from GHCR and go

## Quick Start (Docker)

```bash
docker run -d \
  -p 5000:5000 \
  -e GROCY_URL=http://your-grocy-host \
  -e GROCY_API_TOKEN=your_token \
  --restart unless-stopped \
  ghcr.io/slackerchris/grocy-games:latest
```

Or with Compose — copy `docker-compose.yml` to your server and create a `.env`:

```bash
GROCY_URL=http://your-grocy-host
GROCY_API_TOKEN=your_token
```

```bash
docker compose up -d
```

Then reverse-proxy port `5000` with Nginx, Caddy, or Traefik.

## NFC Tags

Program NFC stickers with URLs to open filtered views instantly:

| Tag location | URL |
|---|---|
| Fridge door | `http://your-app/?location=<id>` |
| Snack cabinet | `http://your-app/?location=<id>` |
| Specific item | `http://your-app/?product=<id>` |

Find location and product IDs at `http://your-server:5000/api/locations` and `/api/products`.

Use [NFC Tools](https://www.wakdev.com/en/apps/nfc-tools.html) (iOS/Android) to write URL records to your tags.

## Development

### Prerequisites
- Node.js 20+
- A running Grocy instance

### Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your GROCY_URL and GROCY_API_TOKEN
npm install
npm start        # runs on :5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev      # runs on :3000
```

Or use the VSCode task **Run All (Backend + Frontend)**.

### Environment Variables

| Variable | Description |
|---|---|
| `GROCY_URL` | Your Grocy base URL (e.g. `http://grocy.local:81`) — with or without `/api` |
| `GROCY_API_TOKEN` | API token from Grocy → Settings → Manage API keys |
| `PORT` | Backend port (default: `5000`) |
| `NODE_ENV` | Set to `production` to serve the built frontend |

### Production Build

```bash
cd frontend && npm run build
# Set NODE_ENV=production in backend/.env
cd backend && npm start
```

The backend serves `frontend/dist/` when `NODE_ENV=production`.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Grocy connectivity check |
| `/api/products` | GET | All products |
| `/api/stock` | GET | Current stock levels |
| `/api/quantity-units` | GET | Unit names |
| `/api/locations` | GET | Grocy locations |
| `/api/users` | GET | Grocy users |
| `/api/stock/add` | POST | Add stock |
| `/api/stock/remove` | POST | Consume stock |

## License

MIT
