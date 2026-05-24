# Get your permanent deployed link (2 minutes)

## Step 1 — Open this link

**https://vercel.com/new/clone?repository-url=https://github.com/JANGAMBALACHANDRAMOHANREDDY/Vedaai-assignment&project-name=vedaai-assignment&root-directory=frontend**

## Step 2 — Deploy

1. Sign in with **GitHub**
2. Leave all settings as default
3. **Do NOT add** `NEXT_PUBLIC_API_URL` (leave empty)
4. Click **Deploy**
5. Wait ~2 minutes

## Step 3 — Copy your link

Vercel shows a URL like:

**https://vedaai-assignment.vercel.app**

That is your **permanent deployed link** for submission.

---

## Temporary link (works now, PC must stay on)

Run in PowerShell if link stops working:

```powershell
cd C:\Users\janga\Downloads\assignment\frontend
node node_modules/next/dist/bin/next start -p 3001
```

New terminal:

```powershell
npx localtunnel --port 3001
```

Use the `https://....loca.lt` URL it prints.
