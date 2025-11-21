#!/usr/bin/env pwsh
# Add Auth0 Environment Variables to Vercel
# This script helps you add all required Auth0 variables

Write-Host "`n🔐 Vercel Auth0 Configuration Script" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Auth0 Configuration from your setup
$auth0Config = @{
    "NEXT_PUBLIC_AUTH0_DOMAIN" = "ekabalance.eu.auth0.com"
    "AUTH0_ISSUER_BASE_URL" = "https://ekabalance.eu.auth0.com"
    "AUTH0_CLIENT_ID" = "C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n"
    "PROD_AUTH0_DOMAIN" = "ekabalance.eu.auth0.com"
    "PROD_AUTH0_AUDIENCE" = "https://rbnfyxhewsivofvwdpuk.supabase.co"
    "AUTH0_SCOPE" = "openid profile email offline_access"
}

# Variables that need user input
$secretVars = @{
    "AUTH0_CLIENT_SECRET" = "Your Auth0 Application Client Secret"
    "AUTH0_SECRET" = "Generate with: openssl rand -base64 32"
    "AUTH0_BASE_URL" = "Your production URL (e.g., https://your-app.vercel.app)"
}

Write-Host "This script will add the following Auth0 variables to Vercel:`n" -ForegroundColor Yellow

# Show what will be added
Write-Host "📝 Variables with known values:" -ForegroundColor Green
foreach ($key in $auth0Config.Keys) {
    Write-Host "  ✓ $key" -ForegroundColor Green
}

Write-Host "`n🔑 Variables that need your input:" -ForegroundColor Yellow
foreach ($key in $secretVars.Keys) {
    Write-Host "  ⚠ $key - $($secretVars[$key])" -ForegroundColor Yellow
}

Write-Host "`n"
$proceed = Read-Host "Do you want to proceed? (y/n)"
if ($proceed -ne 'y') {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Function to add environment variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment = "production,preview,development"
    )
    
    Write-Host "Adding $Name..." -ForegroundColor Cyan
    
    # Create temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $Value -NoNewline
    
    try {
        # Add to Vercel using input from file
        $result = Get-Content $tempFile | vercel env add $Name $Environment 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Added $Name" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ⚠️  $Name may already exist or there was an error" -ForegroundColor Yellow
            return $false
        }
    } finally {
        Remove-Item $tempFile -ErrorAction SilentlyContinue
    }
}

Write-Host "`n📦 Adding variables with known values..." -ForegroundColor Cyan

$added = 0
$skipped = 0

foreach ($key in $auth0Config.Keys) {
    if (Add-VercelEnv -Name $key -Value $auth0Config[$key]) {
        $added++
    } else {
        $skipped++
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "`n🔑 Now adding variables that need your input..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to skip any variable`n" -ForegroundColor Gray

foreach ($key in $secretVars.Keys) {
    Write-Host "`n$key" -ForegroundColor Yellow
    Write-Host "Description: $($secretVars[$key])" -ForegroundColor Gray
    
    if ($key -eq "AUTH0_SECRET") {
        Write-Host "Tip: Generate with: " -NoNewline -ForegroundColor Gray
        Write-Host "openssl rand -base64 32" -ForegroundColor White
        Write-Host "  or just press Enter to auto-generate" -ForegroundColor Gray
    }
    
    $value = Read-Host "Enter value (or press Enter to skip)"
    
    if ([string]::IsNullOrWhiteSpace($value)) {
        if ($key -eq "AUTH0_SECRET") {
            # Auto-generate AUTH0_SECRET
            $bytes = New-Object byte[] 32
            [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
            $value = [Convert]::ToBase64String($bytes)
            Write-Host "  🔐 Auto-generated secret" -ForegroundColor Green
        } else {
            Write-Host "  ⏭️  Skipped $key" -ForegroundColor Yellow
            $skipped++
            continue
        }
    }
    
    if (Add-VercelEnv -Name $key -Value $value) {
        $added++
    } else {
        $skipped++
    }
    Start-Sleep -Milliseconds 500
}

# Add other required variables
Write-Host "`n📋 Adding other application variables..." -ForegroundColor Cyan

$otherVars = @{
    "NODE_ENV" = "production"
    "NEXT_TELEMETRY_DISABLED" = "1"
}

foreach ($key in $otherVars.Keys) {
    if (Add-VercelEnv -Name $key -Value $otherVars[$key]) {
        $added++
    } else {
        $skipped++
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Added: $added" -ForegroundColor Green
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow

Write-Host "`n✅ Auth0 configuration complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Verify variables: " -NoNewline; Write-Host "vercel env ls" -ForegroundColor White
Write-Host "  2. Pull to local: " -NoNewline; Write-Host "vercel env pull .env.local" -ForegroundColor White
Write-Host "  3. Deploy: " -NoNewline; Write-Host "vercel --prod" -ForegroundColor White

Write-Host "`n⚠️  Important:" -ForegroundColor Yellow
Write-Host "  - Get AUTH0_CLIENT_SECRET from: https://manage.auth0.com/" -ForegroundColor Gray
Write-Host "  - Your app will be at: https://ekaacc-1.vercel.app (or custom domain)" -ForegroundColor Gray
Write-Host "  - Update AUTH0_BASE_URL with your actual Vercel URL" -ForegroundColor Gray
