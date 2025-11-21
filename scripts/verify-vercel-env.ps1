#!/usr/bin/env pwsh
# Verify Vercel Environment Variables

Write-Host "`n🔍 Vercel Environment Variables Verification" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

Write-Host "Fetching environment variables from Vercel..." -ForegroundColor Yellow
$envList = vercel env ls 2>&1 | Out-String

# Define required variables
$auth0Vars = @(
    "AUTH0_SECRET",
    "AUTH0_BASE_URL",
    "AUTH0_ISSUER_BASE_URL",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
    "NEXT_PUBLIC_AUTH0_DOMAIN"
)

$supabaseVars = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
)

$stripeVars = @(
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET"
)

$emailVars = @(
    "RESEND_API_KEY"
)

$recommendedVars = @(
    "NODE_ENV",
    "NEXT_PUBLIC_APP_URL",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY"
)

$optionalVars = @(
    "SQUARE_ACCESS_TOKEN",
    "SQUARE_ENVIRONMENT",
    "GOOGLE_GENERATIVE_AI_API_KEY",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID"
)

$totalMissing = 0
$totalFound = 0

function CheckVariables {
    param(
        [string]$Category,
        [array]$Variables
    )
    
    Write-Host "`n📋 $Category Variables:" -ForegroundColor Cyan
    
    $missing = @()
    
    foreach ($var in $Variables) {
        if ($envList -match $var) {
            Write-Host "  ✅ $var" -ForegroundColor Green
            $script:totalFound++
        } else {
            Write-Host "  ❌ $var" -ForegroundColor Red
            $missing += $var
            $script:totalMissing++
        }
    }
    
    if ($missing.Count -gt 0 -and $Category -match "Critical") {
        Write-Host "  ⚠️  Missing critical variables!" -ForegroundColor Yellow
    }
}

# Check each category
CheckVariables -Category "Critical Auth0" -Variables $auth0Vars
CheckVariables -Category "Critical Supabase" -Variables $supabaseVars
CheckVariables -Category "Critical Stripe" -Variables $stripeVars
CheckVariables -Category "Critical Email" -Variables $emailVars
CheckVariables -Category "Recommended" -Variables $recommendedVars
CheckVariables -Category "Optional" -Variables $optionalVars

# Summary
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Found: $totalFound" -ForegroundColor Green
Write-Host "  ❌ Missing: $totalMissing" -ForegroundColor Red

if ($totalMissing -gt 0) {
    Write-Host "`n⚠️  Action Required:" -ForegroundColor Yellow
    Write-Host "  Run: .\scripts\setup-vercel-auth0.ps1" -ForegroundColor White
    Write-Host "  Or add variables manually at: https://vercel.com/dashboard" -ForegroundColor Gray
    exit 1
} else {
    Write-Host "`n🎉 All critical variables are configured!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Pull variables: vercel env pull" -ForegroundColor White
    Write-Host "  2. Deploy: vercel --prod" -ForegroundColor White
    Write-Host "  3. Check deployment: vercel ls" -ForegroundColor White
    exit 0
}
