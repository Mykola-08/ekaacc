# Check if Vercel CLI is installed
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Error "Vercel CLI is not installed or not in PATH. Please install it using 'npm i -g vercel'."
    exit 1
}

# Reminder to link project
Write-Host "Ensure you have run 'vercel login' and 'vercel link' before running this script." -ForegroundColor Cyan
Start-Sleep -Seconds 2

$envFile = "$PSScriptRoot/../.env.example"

if (-not (Test-Path $envFile)) {
    Write-Error ".env.example file not found at $envFile"
    exit 1
}

Write-Host "Reading environment variables from $envFile..."
$lines = Get-Content $envFile

foreach ($line in $lines) {
    # Skip comments and empty lines
    if ($line -match "^\s*#" -or $line -match "^\s*$") {
        continue
    }

    # Parse Key=Value
    if ($line -match "^([^=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()

        Write-Host "Processing $key..."

        # Define environments to add to
        $targets = @("production", "preview", "development")

        foreach ($target in $targets) {
            Write-Host "  Adding to $target..."
            
            try {
                $value | vercel env add $key $target 2>&1 | Out-Null
                Write-Host "    Successfully added $key to $target" -ForegroundColor Green
            }
            catch {
                Write-Host "    Failed to add $key to $target (it might already exist)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "Done! You can now go to your Vercel dashboard to update the values."
