#!/usr/bin/env pwsh
# Add Auth0 Environment Variables to Vercel
# This script adds all required Auth0 variables for production deployment

Write-Host "`n🔐 Adding Auth0 Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Known values from Auth0 setup
$AUTH0_CLIENT_ID = "C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n"
$AUTH0_CLIENT_SECRET = "z6ozyNNaE-x2FdeSZpTZYlaftphg0u9Y4hZzKM-XK_SUrccUyBuYw5NNi5DH-uhV"
$AUTH0_DOMAIN = "ekabalance.eu.auth0.com"
$AUTH0_ISSUER = "https://ekabalance.eu.auth0.com"
$AUTH0_AUDIENCE = "https://rbnfyxhewsivofvwdpuk.supabase.co"
$AUTH0_SCOPE = "openid profile email"

# Generate AUTH0_SECRET (32 random bytes as base64)
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$AUTH0_SECRET = [Convert]::ToBase64String($bytes)

Write-Host "Generated AUTH0_SECRET: $($AUTH0_SECRET.Substring(0,20))..." -ForegroundColor Green

# Get production URL
Write-Host "`nEnter your production URL (e.g., https://your-app.vercel.app):" -ForegroundColor Yellow
$AUTH0_BASE_URL = Read-Host "Production URL"

if (-not $AUTH0_BASE_URL) {
    Write-Host "❌ Production URL is required!" -ForegroundColor Red
    exit 1
}

Write-Host "`nAdding environment variables to Vercel..." -ForegroundColor Cyan

# Add each variable
$vars = @{
    "AUTH0_SECRET" = $AUTH0_SECRET
    "AUTH0_BASE_URL" = $AUTH0_BASE_URL
    "AUTH0_ISSUER_BASE_URL" = $AUTH0_ISSUER
    "AUTH0_CLIENT_ID" = $AUTH0_CLIENT_ID
    "AUTH0_CLIENT_SECRET" = $AUTH0_CLIENT_SECRET
    "NEXT_PUBLIC_AUTH0_DOMAIN" = $AUTH0_DOMAIN
    "AUTH0_AUDIENCE" = $AUTH0_AUDIENCE
    "AUTH0_SCOPE" = $AUTH0_SCOPE
}

$successCount = 0
$failCount = 0

foreach ($varName in $vars.Keys) {
    $varValue = $vars[$varName]
    Write-Host "  Adding $varName..." -NoNewline
    
    # Add to production, preview, and development
    $result = echo $varValue | vercel env add $varName production preview development 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "    Error: $result" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Successfully added: $successCount" -ForegroundColor Green
Write-Host "  ❌ Failed: $failCount" -ForegroundColor Red

if ($failCount -eq 0) {
    Write-Host "`n🎉 All Auth0 variables added successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Pull variables: " -NoNewline; Write-Host "vercel env pull" -ForegroundColor White
    Write-Host "  2. Deploy to production: " -NoNewline; Write-Host "vercel --prod" -ForegroundColor White
    Write-Host "  3. Test Auth0 login on your production site" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some variables failed to add. Please check the errors above." -ForegroundColor Yellow
    Write-Host "You may need to add them manually at: https://vercel.com/dashboard" -ForegroundColor Gray
}
