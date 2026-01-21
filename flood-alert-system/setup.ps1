# 🌊 Flood Alert System - Quick Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Flood Alert System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is needed
Write-Host "📦 Checking MongoDB connection..." -ForegroundColor Yellow
Write-Host ""

# Navigate to backend
Set-Location -Path "backend"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
npm run seed

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Keep this terminal running for the backend" -ForegroundColor White
Write-Host "  2. Open a NEW terminal and run:" -ForegroundColor White
Write-Host "     cd frontend" -ForegroundColor Cyan
Write-Host "     npm install" -ForegroundColor Cyan
Write-Host "     npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the backend server
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Write-Host ""
npm run dev
