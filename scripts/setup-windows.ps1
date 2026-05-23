# Run from project root:  powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (-not (Test-Path "$Root\backend\package.json")) {
    $Root = $PSScriptRoot + "\.."
}

Write-Host "=== Assessment Creator - Windows Setup ===" -ForegroundColor Cyan
Write-Host "Project: $Root`n"

# Backend
Write-Host "[1/2] Backend dependencies..." -ForegroundColor Yellow
Set-Location "$Root\backend"
if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }
npm install --ignore-scripts
if ($LASTEXITCODE -ne 0) { throw "Backend npm install failed" }

# Frontend
Write-Host "`n[2/2] Frontend dependencies..." -ForegroundColor Yellow
Set-Location "$Root\frontend"
if (-not (Test-Path ".env.local")) { Copy-Item ".env.example" ".env.local" }
npm install --ignore-scripts
if ($LASTEXITCODE -ne 0) { throw "Frontend npm install failed" }

Set-Location $Root
Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host @"

Open THREE separate PowerShell windows:

  Window 1 (API):
    cd "$Root\backend"
    npm run dev

  Window 2 (Worker):
    cd "$Root\backend"
    npm run worker

  Window 3 (Frontend):
    cd "$Root\frontend"
    npm run dev

Then open http://localhost:3000

MongoDB + Redis (no Docker):
  - MongoDB Atlas free cluster -> set MONGODB_URI in backend\.env
  - Upstash Redis free tier -> set REDIS_HOST, REDIS_PORT in backend\.env
  Or install MongoDB Community + Memurai (Redis for Windows) locally.

"@
