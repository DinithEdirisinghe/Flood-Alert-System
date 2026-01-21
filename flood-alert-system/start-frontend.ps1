# 🚀 Quick Start - Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "frontend"

if (-Not (Test-Path "node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
Write-Host "📱 Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host ""

npm run dev
