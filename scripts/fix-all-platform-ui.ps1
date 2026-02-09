# Fix ALL remaining @/components/platform/ui/ to @/components/ui/
# For any component that doesn't already exist in ui/, copy it first

$uiDir = "src\components\ui"
$platformUiDir = "src\components\platform\ui"

# First pass: find all unique platform/ui components still imported
$allFiles = Get-ChildItem -Recurse -Include "*.ts","*.tsx" -Path "src" | Where-Object { $_.FullName -notlike "*platform\ui*" }
$components = @{}

foreach ($f in $allFiles) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $matches = [regex]::Matches($c, "@/components/platform/ui/([\w-]+)")
    foreach ($m in $matches) {
        $comp = $m.Groups[1].Value
        $components[$comp] = $true
    }
}

Write-Host "=== Components still imported from platform/ui ==="
$components.Keys | Sort-Object

# Copy any missing components to ui/
foreach ($comp in $components.Keys) {
    $targetTs = Join-Path $uiDir "$comp.tsx"
    $targetTs2 = Join-Path $uiDir "$comp.ts"
    if (-not (Test-Path $targetTs) -and -not (Test-Path $targetTs2)) {
        $sourceTs = Join-Path $platformUiDir "$comp.tsx"
        $sourceTs2 = Join-Path $platformUiDir "$comp.ts"
        if (Test-Path $sourceTs) {
            Copy-Item $sourceTs $targetTs
            Write-Host "Copied: $comp.tsx -> ui/"
        } elseif (Test-Path $sourceTs2) {
            Copy-Item $sourceTs2 $targetTs2
            Write-Host "Copied: $comp.ts -> ui/"
        }
    }
}

# Now rewrite all imports
$totalChanges = 0
foreach ($f in $allFiles) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $original = $c
    $c = $c -replace "@/components/platform/ui/", "@/components/ui/"
    if ($c -ne $original) {
        [System.IO.File]::WriteAllText($f.FullName, $c)
        $totalChanges++
        Write-Host "Updated: $($f.FullName -replace '.*\\ekaacc\\','')"
    }
}

Write-Host "`nTotal files updated: $totalChanges"
