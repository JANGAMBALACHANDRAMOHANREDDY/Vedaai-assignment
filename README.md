# AI Assessment Creator

Production-ready platform for teachers to create assignments and generate structured AI exam papers with real-time status updates.

## Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Zustand, Socket.IO client |
| Backend | Node.js, Express, TypeScript, MongoDB, Redis, BullMQ, Socket.IO |
| AI | OpenAI (optional — mock generator without API key) |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder structure, API flow, BullMQ, WebSocket, and database schemas.

## Prerequisites

- Node.js 20+
- Docker (for MongoDB & Redis) or local installs
- OpenAI API key (optional)

## Quick Start

### Windows (no Docker)

See **[docs/WINDOWS-SETUP.md](./docs/WINDOWS-SETUP.md)** for full steps.

```powershell
# From project root — one-time setup
powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1
```

Then open **3 separate terminals** (do not paste all commands into one):

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd backend
npm run worker

# Terminal 3
cd frontend
npm run dev
```

Use **MongoDB Atlas** + **Upstash Redis** (free tiers) if Docker is not installed. Set `MONGODB_URI` and `REDIS_*` in `backend\.env`.

If `npm install` fails with `ERR_INVALID_ARG_TYPE`, run:

```powershell
npm install --ignore-scripts
```

### Linux / macOS (with Docker)

```bash
docker compose up -d
```

### Backend

```bash
cd backend
cp .env.example .env
npm install --ignore-scripts   # use if plain npm install fails on Windows
npm run dev                    # API on :4000
```

In a **second terminal**:

```bash
cd backend
npm run worker                 # BullMQ worker
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install --ignore-scripts
npm run dev                    # http://localhost:3000
```

## Environment Variables

**Backend** (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_HOST` / `REDIS_PORT` | Redis for BullMQ & pub/sub |
| `PORT` | API port (default 4000) |
| `CORS_ORIGIN` | Frontend URL |
| `OPENAI_API_KEY` | Optional — uses mock if empty |
| `OPENAI_MODEL` | e.g. `gpt-4o-mini` |
| `UPLOAD_DIR` | File upload directory |

**Frontend** (`frontend/.env.local`):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend REST URL |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL |

## API Endpoints

- `POST /api/assignments` — Create assignment (multipart: `file` optional)
- `GET /api/assignments` — List assignments
- `GET /api/assignments/:id` — Assignment + latest paper
- `POST /api/assignments/:id/generate` — Queue generation
- `POST /api/assignments/:id/regenerate` — New paper version
- `GET /api/papers/:id` — Get paper with assignment
- `GET /health` — Health check

## WebSocket

Connect to the API server, emit `join` with `{ assignmentId }`, listen for `generation:update`.

## Deployment

### Backend

1. Build: `npm run build`
2. Run API: `npm start`
3. Run worker separately: `npm run start:worker`
4. Set production env vars; use managed MongoDB, Redis, and secure `CORS_ORIGIN`.

### Frontend

1. Set `NEXT_PUBLIC_*` to production API URLs.
2. `npm run build && npm start` (or deploy to Vercel).

### Process manager (example)

Use PM2 or similar with two processes: `api` and `worker`.

## Features

- Assignment form with validation, file upload, question types
- BullMQ async AI generation with retries
- Real-time progress via Redis pub/sub → Socket.IO
- Structured JSON exam output (never raw LLM text in UI)
- Professional exam paper layout with PDF export
- Regenerate, toasts, skeleton loaders

## License

MIT
<img width="942" height="839" alt="image" src="https://github.com/user-attachments/assets/408385f3-c1f5-4b9e-9bdc-c31737e2f209" />

