#!/usr/bin/env pwsh
# Batch Add Auth0 Variables to Vercel
# This script uses Vercel CLI to add all Auth0 environment variables

$ErrorActionPreference = "Continue"

Write-Host "`n🔐 Batch Adding Auth0 Variables to Vercel" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Generate AUTH0_SECRET
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$AUTH0_SECRET = [Convert]::ToBase64String($bytes)

# Define all variables
$variables = @{
    "AUTH0_SECRET" = $AUTH0_SECRET
    "AUTH0_BASE_URL" = "https://app.ekabalance.com"
    "AUTH0_ISSUER_BASE_URL" = "https://ekabalance.eu.auth0.com"
    "AUTH0_CLIENT_ID" = "C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n"
    "AUTH0_CLIENT_SECRET" = "z6ozyNNaE-x2FdeSZpTZYlaftphg0u9Y4hZzKM-XK_SUrccUyBuYw5NNi5DH-uhV"
    "NEXT_PUBLIC_AUTH0_DOMAIN" = "ekabalance.eu.auth0.com"
}

$count = 0
$total = $variables.Count

foreach ($key in $variables.Keys) {
    $count++
    $value = $variables[$key]
    
    Write-Host "[$count/$total] Adding $key..." -ForegroundColor Cyan
    
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value -NoNewline
    
    try {
        # Use the temp file as input to vercel env add
        $output = Get-Content $tempFile | vercel env add $key production 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Added to production" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Failed: $output" -ForegroundColor Red
        }
        
        # Add to preview
        $output = Get-Content $tempFile | vercel env add $key preview 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Added to preview" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Preview: $output" -ForegroundColor Yellow
        }
        
        # Add to development
        $output = Get-Content $tempFile | vercel env add $key development 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Added to development" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Development: $output" -ForegroundColor Yellow
        }
        
    } finally {
        Remove-Item $tempFile -ErrorAction SilentlyContinue
    }
    
    Write-Host ""
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "✅ Auth0 variables configuration complete!" -ForegroundColor Green
Write-Host "`nGenerated AUTH0_SECRET:" -ForegroundColor Cyan
Write-Host "  $AUTH0_SECRET" -ForegroundColor Yellow
Write-Host "`n⚠️  IMPORTANT: Save this secret! You may need it later." -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Verify variables: vercel env ls" -ForegroundColor White
Write-Host "  2. Pull to .env: vercel env pull" -ForegroundColor White  
Write-Host "  3. Deploy: vercel --prod" -ForegroundColor White
Write-Host "  4. Test login at: https://app.ekabalance.com" -ForegroundColor White
