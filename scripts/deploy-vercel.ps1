# Deploy script for monorepo apps to Vercel
# This script uses Remote Build (vercel deploy) to ensure security compliance and environment consistency.

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('web', 'api', 'booking-app', 'legal', 'docs', 'seowebsite', 'all')]
    [string]$App = 'all',
    
    [Parameter(Mandatory=$false)]
    [switch]$Production = $false,

    [Parameter(Mandatory=$false)]
    [switch]$Force = $false,

    [Parameter(Mandatory=$false)]
    [switch]$SyncEnv = $false,

    [Parameter(Mandatory=$false)]
    [string]$Scope = 'eka-balance'
)

$apps = @('web', 'api', 'booking-app', 'legal', 'docs', 'seowebsite')

# Mapping of app names to Vercel project names
# Assumes project names are ekaacc-1-$appName
# You can customize this mapping if needed
$projectMapping = @{
    "web" = "web"
    "api" = "api"
    "booking-app" = "booking"
    "legal" = "legal"
    "docs" = "docs"
    "seowebsite" = "seowebsite"
}

function Deploy-App {
    param([string]$appName)
    
    $projectName = $projectMapping[$appName]
    if (-not $projectName) {
        $projectName = "ekaacc-$appName"
    }

    Write-Host "`n[*] Deploying $appName (Project: $projectName)..." -ForegroundColor Cyan
    
    # Generate vercel.json for this app
    $vercelConfig = @{
        "buildCommand" = "npx turbo run build --filter=$appName"
        "outputDirectory" = "apps/$appName/.next"
        "framework" = "nextjs"
        "installCommand" = "npm install --legacy-peer-deps"
    }
    
    $vercelJsonContent = $vercelConfig | ConvertTo-Json -Depth 2
    Set-Content -Path "vercel.json" -Value $vercelJsonContent
    
    try {
        # Link to the project
        Write-Host "[*] Linking to Vercel project..." -ForegroundColor Gray
        # We use --yes to skip confirmation, assuming the user has access
        # We set NODE_TLS_REJECT_UNAUTHORIZED=1 to ensure security during CLI operations
        $env:NODE_TLS_REJECT_UNAUTHORIZED = '1'
        
        # Run vercel link
        $linkOutput = vercel link --project $projectName --scope $Scope --yes 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to link project: $linkOutput"
        }

        if ($SyncEnv) {
            Write-Host "[*] Syncing Environment Variables..." -ForegroundColor Cyan
            ./scripts/sync-env-to-vercel.ps1
        }

        # Deploy
        if ($Production) {
            Write-Host "[*] Triggering Remote Build for PRODUCTION..." -ForegroundColor Yellow
            if ($Force) {
                vercel deploy --prod --force --scope $Scope
            } else {
                vercel deploy --prod --scope $Scope
            }
        } else {
            Write-Host "[*] Triggering Remote Build for PREVIEW..." -ForegroundColor Blue
            if ($Force) {
                vercel deploy --force --scope $Scope
            } else {
                vercel deploy --scope $Scope
            }
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[+] $appName deployed successfully!" -ForegroundColor Green
            $result = $true
        } else {
            Write-Host "[-] Failed to deploy $appName" -ForegroundColor Red
            $result = $false
        }
    } catch {
        $err = $_.Exception.Message
        Write-Host "[-] Error deploying ${appName}: $err" -ForegroundColor Red
        $result = $false
    }
    
    return $result
}

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   Vercel Monorepo Deployment Script   " -ForegroundColor Magenta
Write-Host "   (Remote Build Mode)                 " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

if ($App -eq 'all') {
    Write-Host "`n[*] Deploying all apps..." -ForegroundColor Cyan
    
    $results = @{}
    foreach ($appName in $apps) {
        $results[$appName] = Deploy-App -appName $appName
    }
    
    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "           Deployment Summary           " -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    
    foreach ($appName in $apps) {
        $status = if ($results[$appName]) { "Success" } else { "Failed" }
        $color = if ($results[$appName]) { "Green" } else { "Red" }
        Write-Host "$appName : $status" -ForegroundColor $color
    }
} else {
    Deploy-App -appName $App
}

Write-Host "`n========================================`n" -ForegroundColor Magenta
