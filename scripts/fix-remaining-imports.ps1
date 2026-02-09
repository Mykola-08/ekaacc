$files = @(
    "src\app\(platform)\minimal-layout.tsx",
    "src\components\platform\layout\dashboard-layout.tsx",
    "src\components\platform\navigation\sidebar-components\nav-main.tsx",
    "src\components\platform\navigation\sidebar-components\nav-user.tsx",
    "src\components\platform\navigation\sidebar-components\team-switcher.tsx",
    "src\components\platform\navigation\app-sidebar.tsx",
    "src\components\platform\navigation\sidebar-07.tsx"
)

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f)
    $c = $c -replace "@/components/platform/ui/sidebar", "@/components/ui/sidebar"
    $c = $c -replace "@/components/platform/ui/collapsible", "@/components/ui/collapsible"
    [System.IO.File]::WriteAllText($f, $c)
    Write-Host "Updated: $f"
}

# Fix toast import
$hookFile = "src\hooks\platform\ui\use-toast.ts"
if (Test-Path $hookFile) {
    $c = [System.IO.File]::ReadAllText($hookFile)
    $c = $c -replace "@/components/platform/ui/toast", "@/components/ui/toast"
    [System.IO.File]::WriteAllText($hookFile, $c)
    Write-Host "Updated: $hookFile"
}

# Also check if toast.tsx needs to move to ui/
if (-not (Test-Path "src\components\ui\toast.tsx")) {
    Copy-Item "src\components\platform\ui\toast.tsx" "src\components\ui\toast.tsx"
    Write-Host "Copied toast.tsx to ui/"
}

Write-Host "Done"
