# Deploy script for monorepo apps to Vercel
# This script allows you to deploy each app separately

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('web', 'api', 'booking', 'admin', 'marketing', 'legal', 'therapist', 'docs', 'all')]
    [string]$App = 'all',
    
    [Parameter(Mandatory=$false)]
    [switch]$Production = $false
)

$apps = @('web', 'api', 'booking', 'admin', 'marketing', 'legal', 'therapist', 'docs')

function Deploy-App {
    param([string]$appName)
    
    $appPath = "apps\$appName"
    
    if (-not (Test-Path $appPath)) {
        Write-Host "❌ App '$appName' not found at $appPath" -ForegroundColor Red
        return $false
    }
    
    Write-Host "`n🚀 Deploying $appName..." -ForegroundColor Cyan
    Write-Host "📁 Path: $appPath" -ForegroundColor Gray
    
    Push-Location $appPath
    
    try {
        # Check if project is linked
        if (-not (Test-Path ".vercel/project.json")) {
            Write-Host "⚠️  Project not linked. Running 'vercel link'..." -ForegroundColor Yellow
            # This requires interaction if not linked
            vercel link
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to link Vercel project"
            }
        }

        if ($Production) {
            Write-Host "🏗️  Building for PRODUCTION..." -ForegroundColor Yellow
            vercel build --prod
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "🌍 Deploying to PRODUCTION..." -ForegroundColor Yellow
                vercel deploy --prebuilt --prod
            } else {
                throw "Build failed"
            }
        } else {
            Write-Host "🏗️  Building for PREVIEW..." -ForegroundColor Blue
            vercel build
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "🔧 Deploying to PREVIEW..." -ForegroundColor Blue
                vercel deploy --prebuilt
            } else {
                throw "Build failed"
            }
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $appName deployed successfully!" -ForegroundColor Green
            $result = $true
        } else {
            Write-Host "❌ Failed to deploy $appName" -ForegroundColor Red
            $result = $false
        }
    } catch {
        Write-Host "❌ Error deploying $appName: $_" -ForegroundColor Red
        $result = $false
    } finally {
        Pop-Location
    }
    
    return $result
}

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   Vercel Monorepo Deployment Script   " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

if ($App -eq 'all') {
    Write-Host "`n📦 Deploying all apps..." -ForegroundColor Cyan
    
    $results = @{}
    foreach ($appName in $apps) {
        $results[$appName] = Deploy-App -appName $appName
    }
    
    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "           Deployment Summary           " -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    
    foreach ($appName in $apps) {
        $status = if ($results[$appName]) { "✅ Success" } else { "❌ Failed" }
        $color = if ($results[$appName]) { "Green" } else { "Red" }
        Write-Host "$appName : $status" -ForegroundColor $color
    }
} else {
    Deploy-App -appName $App
}

Write-Host "`n========================================`n" -ForegroundColor Magenta
