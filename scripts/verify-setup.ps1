#!/usr/bin/env pwsh
# GitHub & Vercel Setup Verification Script
# This script checks if all required configurations are in place

Write-Host "`n🔍 GitHub & Vercel Setup Verification" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

$errors = @()
$warnings = @()
$success = @()

# Check GitHub CLI
Write-Host "Checking GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ GitHub CLI installed: $($ghVersion[0])" -ForegroundColor Green
        $success += "GitHub CLI"
    } else {
        throw
    }
} catch {
    Write-Host "  ❌ GitHub CLI not found" -ForegroundColor Red
    $errors += "GitHub CLI not installed. Install from: https://cli.github.com/"
}

# Check if logged in to GitHub
Write-Host "`nChecking GitHub authentication..." -ForegroundColor Yellow
try {
    gh auth status 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Authenticated to GitHub" -ForegroundColor Green
        $success += "GitHub Auth"
    } else {
        throw
    }
} catch {
    Write-Host "  ❌ Not authenticated to GitHub" -ForegroundColor Red
    $errors += "Run: gh auth login"
}

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
    $success += "Node.js"
} catch {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
    $errors += "Node.js required. Install from: https://nodejs.org/"
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm installed: v$npmVersion" -ForegroundColor Green
    $success += "npm"
} catch {
    Write-Host "  ❌ npm not found" -ForegroundColor Red
    $errors += "npm required"
}

# Check Vercel CLI
Write-Host "`nChecking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
        $success += "Vercel CLI"
    } else {
        throw
    }
} catch {
    Write-Host "  ⚠️  Vercel CLI not found (optional)" -ForegroundColor Yellow
    $warnings += "Install Vercel CLI: npm i -g vercel"
}

# Check workflow files
Write-Host "`nChecking workflow files..." -ForegroundColor Yellow
$requiredWorkflows = @(
    "ci.yml",
    "security.yml",
    "code-quality.yml",
    "deploy.yml",
    "vercel-preview.yml",
    "release.yml",
    "auto-label.yml",
    "stale.yml",
    "dependabot-auto-merge.yml",
    "performance.yml"
)

$workflowsPath = ".github\workflows"
$missingWorkflows = @()

foreach ($workflow in $requiredWorkflows) {
    $path = Join-Path $workflowsPath $workflow
    if (Test-Path $path) {
        Write-Host "  ✅ $workflow" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $workflow missing" -ForegroundColor Red
        $missingWorkflows += $workflow
    }
}

if ($missingWorkflows.Count -eq 0) {
    $success += "All workflows present"
} else {
    $errors += "$($missingWorkflows.Count) workflow files missing"
}

# Check configuration files
Write-Host "`nChecking configuration files..." -ForegroundColor Yellow
$configFiles = @{
    "vercel.json" = "Vercel configuration"
    ".github\dependabot.yml" = "Dependabot configuration"
    ".github\CODEOWNERS" = "Code owners"
    ".github\pull_request_template.md" = "PR template"
    ".prettierrc.js" = "Prettier config"
}

foreach ($file in $configFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "  ✅ $($configFiles[$file])" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($configFiles[$file]) missing" -ForegroundColor Red
        $errors += "$file not found"
    }
}

# Check issue templates
Write-Host "`nChecking issue templates..." -ForegroundColor Yellow
$issueTemplates = @(
    ".github\ISSUE_TEMPLATE\bug_report.yml",
    ".github\ISSUE_TEMPLATE\feature_request.yml",
    ".github\ISSUE_TEMPLATE\documentation.yml",
    ".github\ISSUE_TEMPLATE\config.yml"
)

$missingTemplates = @()
foreach ($template in $issueTemplates) {
    if (Test-Path $template) {
        Write-Host "  ✅ $(Split-Path $template -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $(Split-Path $template -Leaf) missing" -ForegroundColor Red
        $missingTemplates += $template
    }
}

if ($missingTemplates.Count -gt 0) {
    $errors += "$($missingTemplates.Count) issue template(s) missing"
}

# Check package.json scripts
Write-Host "`nChecking package.json scripts..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    $requiredScripts = @("lint", "typecheck", "test", "build", "format")
    
    foreach ($script in $requiredScripts) {
        if ($package.scripts.$script) {
            Write-Host "  ✅ $script script" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $script script missing" -ForegroundColor Red
            $errors += "Missing script: $script"
        }
    }
    $success += "Package.json configured"
} else {
    Write-Host "  ❌ package.json not found" -ForegroundColor Red
    $errors += "package.json not found"
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n✅ Successes: $($success.Count)" -ForegroundColor Green
foreach ($item in $success) {
    Write-Host "   - $item" -ForegroundColor Green
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️  Warnings: $($warnings.Count)" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   - $warning" -ForegroundColor Yellow
    }
}

if ($errors.Count -gt 0) {
    Write-Host "`n❌ Errors: $($errors.Count)" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   - $error" -ForegroundColor Red
    }
    Write-Host "`n⚠️  Setup is incomplete. Please address the errors above." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`n🎉 All checks passed! Your setup is complete." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\scripts\setup-github-labels.ps1" -ForegroundColor White
    Write-Host "  2. Apply branch protection rules (see .github\BRANCH_PROTECTION.md)" -ForegroundColor White
    Write-Host "  3. Configure Vercel environment variables" -ForegroundColor White
    Write-Host "  4. Create a test PR to verify workflows" -ForegroundColor White
    Write-Host "`nSee .github\SETUP_SUMMARY.md for complete instructions." -ForegroundColor Gray
    exit 0
}
