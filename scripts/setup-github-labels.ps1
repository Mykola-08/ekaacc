#!/usr/bin/env pwsh
# GitHub Labels Setup Script
# Run this script to create all necessary labels for the automation workflows

Write-Host "🏷️  GitHub Labels Setup Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if GitHub CLI is installed
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI found: $($ghVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Get repository info
$owner = "Mykola-08"
$repo = "ekaacc"

Write-Host "Repository: $owner/$repo`n" -ForegroundColor Yellow

# Define labels
$labels = @(
    # Type labels
    @{name="feature"; color="0075ca"; description="New feature or request"},
    @{name="enhancement"; color="a2eeef"; description="Enhancement to existing feature"},
    @{name="bug"; color="d73a4a"; description="Something isn't working"},
    @{name="fix"; color="d73a4a"; description="Bug fix"},
    @{name="documentation"; color="0075ca"; description="Documentation improvements"},
    @{name="refactor"; color="fbca04"; description="Code refactoring"},
    @{name="maintenance"; color="fbca04"; description="Maintenance and chores"},
    
    # Priority labels
    @{name="critical"; color="b60205"; description="Critical priority"},
    @{name="high"; color="d93f0b"; description="High priority"},
    @{name="medium"; color="fbca04"; description="Medium priority"},
    @{name="low"; color="ededed"; description="Low priority"},
    
    # Size labels
    @{name="size/XS"; color="ededed"; description="Extra small PR (< 10 lines)"},
    @{name="size/S"; color="ededed"; description="Small PR (< 100 lines)"},
    @{name="size/M"; color="ededed"; description="Medium PR (< 500 lines)"},
    @{name="size/L"; color="ededed"; description="Large PR (< 1000 lines)"},
    @{name="size/XL"; color="ededed"; description="Extra large PR (> 1000 lines)"},
    
    # Category labels
    @{name="auth"; color="5319e7"; description="Authentication/Authorization"},
    @{name="database"; color="1d76db"; description="Database related"},
    @{name="api"; color="0e8a16"; description="API related"},
    @{name="ui"; color="e99695"; description="User interface"},
    @{name="styling"; color="f9d0c4"; description="CSS/Styling"},
    @{name="testing"; color="0052cc"; description="Testing related"},
    @{name="ci"; color="000000"; description="CI/CD related"},
    @{name="dependencies"; color="0366d6"; description="Dependency updates"},
    @{name="email"; color="c5def5"; description="Email system"},
    @{name="ai"; color="7057ff"; description="AI/ML related"},
    
    # Status labels
    @{name="stale"; color="ededed"; description="Stale issue or PR"},
    @{name="breaking"; color="b60205"; description="Breaking change"},
    @{name="security"; color="d93f0b"; description="Security related"},
    @{name="performance"; color="fbca04"; description="Performance improvement"},
    @{name="in-progress"; color="0e8a16"; description="Work in progress"},
    @{name="needs-triage"; color="d876e3"; description="Needs triage"},
    @{name="pinned"; color="0075ca"; description="Pinned issue"},
    
    # Other
    @{name="good first issue"; color="7057ff"; description="Good for newcomers"},
    @{name="help wanted"; color="008672"; description="Extra attention needed"},
    @{name="wontfix"; color="ffffff"; description="This will not be worked on"},
    @{name="duplicate"; color="cfd3d7"; description="Duplicate issue"},
    @{name="invalid"; color="e4e669"; description="Invalid issue"},
    @{name="automated"; color="0366d6"; description="Created by automation"}
)

Write-Host "Creating labels...`n" -ForegroundColor Yellow

$created = 0
$updated = 0
$failed = 0

foreach ($label in $labels) {
    try {
        # Try to create the label
        gh label create $label.name `
            --color $label.color `
            --description $label.description `
            --repo "$owner/$repo" `
            2>$null
        
        Write-Host "  ✅ Created: $($label.name)" -ForegroundColor Green
        $created++
    } catch {
        # If label exists, try to update it
        try {
            gh label edit $label.name `
                --color $label.color `
                --description $label.description `
                --repo "$owner/$repo" `
                2>$null
            
            Write-Host "  🔄 Updated: $($label.name)" -ForegroundColor Yellow
            $updated++
        } catch {
            Write-Host "  ❌ Failed: $($label.name)" -ForegroundColor Red
            $failed++
        }
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Created: $created" -ForegroundColor Green
Write-Host "  Updated: $updated" -ForegroundColor Yellow
Write-Host "  Failed:  $failed" -ForegroundColor Red
Write-Host "`n✅ Label setup complete!" -ForegroundColor Green
