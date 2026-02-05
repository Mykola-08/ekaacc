# PowerShell script to install Google Cloud SDK (gcloud CLI) on Windows
$ErrorActionPreference = "Stop"

$SdkUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-windows-x86_64.zip"
$InstallDir = "$env:LOCALAPPDATA\Google\Cloud SDK"
$ZipPath = "$env:TEMP\google-cloud-cli.zip"

Write-Host "Downloading Google Cloud SDK..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $SdkUrl -OutFile $ZipPath

if (Test-Path $InstallDir) {
    Write-Host "Removing existing installation..." -ForegroundColor Yellow
    Remove-Item -Path $InstallDir -Recurse -Force
}

Write-Host "Extracting to $InstallDir..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Expand-Archive -Path $ZipPath -DestinationPath $InstallDir -Force

$ExtractedRoot = Get-ChildItem -Path $InstallDir -Directory | Select-Object -First 1
$BinPath = Join-Path $ExtractedRoot.FullName "bin"

Write-Host "Adding to PATH..." -ForegroundColor Cyan
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($CurrentPath -notlike "*$BinPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$BinPath", "User")
    $env:Path += ";$BinPath"
    Write-Host "Added $BinPath to User PATH." -ForegroundColor Green
} else {
    Write-Host "Already in PATH." -ForegroundColor Green
}

# Clean up
Remove-Item $ZipPath -Force

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Please run 'gcloud init' to configure your account and project." -ForegroundColor Yellow
Write-Host "Then restart VS Code to ensure the PATH changes act for the extension." -ForegroundColor Yellow
