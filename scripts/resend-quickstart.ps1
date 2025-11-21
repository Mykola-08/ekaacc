#!/usr/bin/env pwsh
# Quick start script for Resend integration testing

Write-Host "🚀 Resend Integration Quick Start" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if RESEND_API_KEY is set
if (-not $env:RESEND_API_KEY) {
    Write-Host "❌ RESEND_API_KEY not found in environment" -ForegroundColor Red
    Write-Host "Please set it in your .env.local file" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ RESEND_API_KEY is configured" -ForegroundColor Green
Write-Host ""

# Check Node modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Available Commands:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Preview emails in browser:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "   Then visit: http://localhost:3000/api/email/preview?type=notification" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test email sending:" -ForegroundColor White
Write-Host "   npm run test:resend" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check Resend configuration:" -ForegroundColor White
Write-Host "   npm run check:resend" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Apply database migrations:" -ForegroundColor White
Write-Host "   npx supabase db push" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "What would you like to do? (1/2/3/4)"

switch ($choice) {
    "1" {
        Write-Host "🌐 Starting development server..." -ForegroundColor Green
        npm run dev
    }
    "2" {
        Write-Host "📧 Running email tests..." -ForegroundColor Green
        npm run test:resend
    }
    "3" {
        Write-Host "🔍 Checking Resend configuration..." -ForegroundColor Green
        npm run check:resend
    }
    "4" {
        Write-Host "🗄️ Applying database migrations..." -ForegroundColor Green
        npx supabase db push
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        Write-Host "Run this script again and choose 1, 2, 3, or 4" -ForegroundColor Yellow
    }
}
