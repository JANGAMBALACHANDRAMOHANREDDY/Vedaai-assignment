# Starts backend + frontend (SIMPLE_DEV — no Docker/Mongo/Redis/worker)
$Root = "C:\Users\janga\Downloads\assignment"
if (Test-Path "$PSScriptRoot\..\backend\package.json") {
  $Root = (Resolve-Path "$PSScriptRoot\..").Path
}

Write-Host "Starting Assessment Creator..." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:4000  |  Frontend: http://localhost:3000`n"

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\backend'; Write-Host '=== API (SIMPLE_DEV) ===' -ForegroundColor Green; npm run dev"
)

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\frontend'; Write-Host '=== Frontend ===' -ForegroundColor Green; npm run dev"
)

Write-Host "Two windows opened. Wait ~15s, then open:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000`n"
