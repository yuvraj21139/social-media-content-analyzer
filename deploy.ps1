# 🚀 Social Media Content Analyzer - Deployment Script
# This script prepares the project for deployment

Write-Host "🚀 Preparing Social Media Content Analyzer for Deployment..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building Frontend..." -ForegroundColor Yellow
Set-Location "apps/web"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Building Backend..." -ForegroundColor Yellow
Set-Location "../server"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend built successfully" -ForegroundColor Green

Set-Location "../.."

Write-Host ""
Write-Host "🎯 Deployment Preparation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Frontend build: apps/web/dist/" -ForegroundColor Cyan
Write-Host "📁 Backend build: apps/server/dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy backend to Render/Railway"
Write-Host "2. Deploy frontend to Vercel/Netlify"
Write-Host "3. Configure environment variables"
Write-Host "4. Test production deployment"
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
