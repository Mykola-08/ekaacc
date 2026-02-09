# Move standard utility components from platform/ui to ui/ (if not already there)
$toMove = @(
    'button-group',
    'chart',
    'empty',
    'enhanced-error-boundary',
    'input-group',
    'input-otp',
    'kbd',
    'loading-states',
    'spinner',
    'toaster'
)

foreach ($comp in $toMove) {
    $src = "src\components\platform\ui\$comp.tsx"
    $dst = "src\components\ui\$comp.tsx"
    if ((Test-Path $src) -and -not (Test-Path $dst)) {
        Copy-Item $src $dst
        Write-Host "Moved to ui/: $comp.tsx"
    } elseif (Test-Path $dst) {
        Write-Host "Already in ui/: $comp.tsx"
    }
}

# Now rewrite any references to these specific components
$files = Get-ChildItem -Recurse -Include "*.ts","*.tsx" -Path "src"
$totalChanges = 0
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $o = $c
    foreach ($comp in $toMove) {
        $c = $c -replace "@/components/platform/ui/$comp", "@/components/ui/$comp"
    }
    if ($c -ne $o) {
        [System.IO.File]::WriteAllText($f.FullName, $c)
        $totalChanges++
        Write-Host "Updated import: $($f.Name)"
    }
}
Write-Host "`nTotal: $totalChanges files updated"
