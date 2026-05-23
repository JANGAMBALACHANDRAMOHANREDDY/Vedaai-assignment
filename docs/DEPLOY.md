# Deploy Vedaai Assessment Creator

There is **no live URL until you deploy**. Your code repo:

https://github.com/JANGAMBALACHANDRAMOHANREDDY/Vedaai-assignment

---

## Recommended: Vercel (frontend) + Render (backend)

### 1. Deploy API on Render (~5 min)

1. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect GitHub repo **Vedaai-assignment**
3. Render reads `render.yaml` — creates **vedaai-api**
4. Set environment variable:
   - `CORS_ORIGIN` = your Vercel URL (set after step 2, then redeploy), or `*` for testing only
5. Deploy → copy URL, e.g. `https://vedaai-api.onrender.com`

Or manual: **New Web Service** → repo → Root Directory: `backend` → Build: `npm install --ignore-scripts && npm run build` → Start: `node dist/index.js` → add `SIMPLE_DEV=true`.

### 2. Deploy frontend on Vercel (~3 min)

1. Open [Vercel New Project](https://vercel.com/new)
2. Import **Vedaai-assignment** from GitHub
3. **Root Directory:** `frontend`
4. Environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-RENDER-API.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://YOUR-RENDER-API.onrender.com
   ```
5. Deploy → copy URL, e.g. `https://vedaai-assignment.vercel.app`

### 3. Finish CORS

In Render, set `CORS_ORIGIN` to your Vercel URL (exact, no trailing slash), then **Manual Deploy** → Redeploy.

---

## Your live links (fill in after deploy)

| App | URL |
|-----|-----|
| **Frontend (share this)** | `https://____________.vercel.app` |
| **API** | `https://____________.onrender.com` |
| **Health check** | `https://____________.onrender.com/health` |

---

## Notes

- **SIMPLE_DEV=true** on Render uses file storage in `/data` (fine for demos; data may reset on free tier restarts).
- For production, use MongoDB Atlas + Upstash Redis, set `SIMPLE_DEV=false`, and run a worker service.
- Render free tier sleeps after inactivity — first load may take ~30s.
