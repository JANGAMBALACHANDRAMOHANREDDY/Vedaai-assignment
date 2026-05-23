# Windows Setup (no Docker)

## What went wrong?

1. **All commands in one block** — After `cd backend`, another `cd backend` fails. Run each terminal separately.
2. **Docker not installed** — Use cloud MongoDB/Redis or local Windows installs instead.
3. **`npm install` esbuild error** — Caused by `tsx` + npm 11 on Windows. This project uses `ts-node` + `nodemon` instead. Use `npm install --ignore-scripts` if install still fails.

## One-time setup

From project root (`assignment`):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1
```

Or manually:

```powershell
cd C:\Users\janga\Downloads\assignment\backend
copy .env.example .env
npm install --ignore-scripts

cd C:\Users\janga\Downloads\assignment\frontend
copy .env.example .env.local
npm install --ignore-scripts
```

## Database without Docker

### Option A — Free cloud (easiest)

1. **MongoDB Atlas** — https://www.mongodb.com/cloud/atlas  
   Create a free cluster → Connect → copy connection string.

2. **Upstash Redis** — https://upstash.com  
   Create Redis database → copy host and port.

Edit `backend\.env` in **Cursor/Notepad** (do not paste these lines into PowerShell — that is bash syntax and will error):

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/assessment_creator
REDIS_HOST=your-upstash-host.upstash.io
REDIS_PORT=6379
```

PowerShell does **not** support `VAR=value` on the command line. The app loads `backend\.env` automatically when you run `npm run dev`.

(Upstash may use TLS; if connection fails, use their REST URL or enable TLS in ioredis.)

### Option B — Local Windows

- Install [MongoDB Community](https://www.mongodb.com/try/download/community)
- Install [Memurai](https://www.memurai.com/) (Redis-compatible) or Redis on WSL

Default `backend\.env`:

```env
MONGODB_URI=mongodb://localhost:27017/assessment_creator
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Run the app (3 terminals)

**Terminal 1 — API**

```powershell
cd C:\Users\janga\Downloads\assignment\backend
npm run dev
```

**Terminal 2 — Worker** (required for AI generation)

```powershell
cd C:\Users\janga\Downloads\assignment\backend
npm run worker
```

**Terminal 3 — Frontend**

```powershell
cd C:\Users\janga\Downloads\assignment\frontend
npm run dev
```

Open http://localhost:3000

## Node version

Use **Node 20 LTS** if you see odd npm errors (`node -v` should be v20.x or v22.x). Node 24 can cause toolchain issues.

```powershell
# If using nvm-windows:
nvm install 20
nvm use 20
```

## Still failing on npm install?

```powershell
npm cache clean --force
cd backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install --ignore-scripts
```
