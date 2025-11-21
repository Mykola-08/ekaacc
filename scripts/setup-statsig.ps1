#!/usr/bin/env pwsh
# Setup Statsig API Key in Vercel and Supabase
# Usage:
#   ./scripts/setup-statsig.ps1 -StatsigKey console-xxxx
#   ./scripts/setup-statsig.ps1               # will prompt
#   $env:STATSIG_API_KEY="console-xxxx"; ./scripts/setup-statsig.ps1

param(
  [string]$StatsigKey
)

Write-Host "`n⚙️ Statsig Environment Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if (-not $StatsigKey) {
  if ($env:STATSIG_API_KEY) {
    $StatsigKey = $env:STATSIG_API_KEY
    Write-Host "Using STATSIG_API_KEY from environment." -ForegroundColor Yellow
  } else {
    $StatsigKey = Read-Host "Enter Statsig console API key (console-*)"
  }
}

if (-not $StatsigKey.StartsWith('console-')) {
  Write-Host "❌ Provided key does not appear to be a Statsig console key (should start with 'console-')." -ForegroundColor Red
  exit 1
}

Write-Host "Validating Vercel CLI availability..." -ForegroundColor Yellow
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Red
  exit 1
}

Write-Host "Validating Supabase CLI availability..." -ForegroundColor Yellow
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Supabase CLI not found. Install with: npm i -g supabase" -ForegroundColor Red
  exit 1
}

Write-Host "\n🔐 Adding key to Vercel environments..." -ForegroundColor Cyan
try {
  # Add to production, preview, development scopes
  "production","preview","development" | ForEach-Object {
    Write-Host "  → Scope: $_" -ForegroundColor White
    $scope = $_
    # Vercel env add requires interactive input; we pipe the key
    $keyInput = $StatsigKey + "`n"
    $process = Start-Process vercel -ArgumentList @('env','add','STATSIG_API_KEY', $scope) -NoNewWindow -PassThru -RedirectStandardInput ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($keyInput))) -RedirectStandardOutput vercel_env_add_$scope.out -RedirectStandardError vercel_env_add_$scope.err
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
      Write-Host "    ❌ Failed to add STATSIG_API_KEY for scope $scope (check vercel_env_add_$scope.err)." -ForegroundColor Red
    } else {
      Write-Host "    ✅ Added STATSIG_API_KEY for $scope" -ForegroundColor Green
    }
  }
} catch {
  Write-Host "❌ Error adding Vercel environment variables: $_" -ForegroundColor Red
}

Write-Host "\n🗄 Adding key to Supabase secrets..." -ForegroundColor Cyan
try {
  supabase secrets set STATSIG_API_KEY=$StatsigKey | Out-Null
  Write-Host "  ✅ Supabase secret set." -ForegroundColor Green
} catch {
  Write-Host "  ❌ Failed to set Supabase secret: $_" -ForegroundColor Red
}

Write-Host "\n🔍 Verification summary:" -ForegroundColor Cyan
Write-Host "  Vercel: Run 'vercel env ls | Select-String STATSIG_API_KEY' to confirm (value masked)." -ForegroundColor White
Write-Host "  Supabase: Secrets are not directly listable; re-run this script if unsure." -ForegroundColor White

Write-Host "\n🚀 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Pull Vercel vars locally: vercel env pull .env.local" -ForegroundColor White
Write-Host "  2. Deploy: vercel --prod" -ForegroundColor White
Write-Host "  3. Rotate key every 90 days." -ForegroundColor White

Write-Host "\n✅ Statsig setup complete." -ForegroundColor Green
exit 0
