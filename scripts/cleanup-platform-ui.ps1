# Step 1: Fix internal platform/ui imports to point to @/components/ui/
$platformUiDir = "src\components\platform\ui"
$files = Get-ChildItem "$platformUiDir\*.tsx","$platformUiDir\*.ts"
$totalChanges = 0

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $o = $c
    # Replace platform/ui imports with direct ui imports
    $c = $c -replace "@/components/platform/ui/", "@/components/ui/"
    # Also fix cn imports
    $c = $c -replace "@/lib/platform/utils/css-utils", "@/lib/utils"
    if ($c -ne $o) {
        [System.IO.File]::WriteAllText($f.FullName, $c)
        $totalChanges++
        Write-Host "Fixed: $($f.BaseName)"
    }
}

Write-Host "`nFixed $totalChanges platform/ui files"

# Step 2: Delete re-export proxy files
$reexports = @('accordion','alert-dialog','alert','aspect-ratio','avatar','badge','breadcrumb','button','calendar','card','carousel','checkbox','command','context-menu','dialog','drawer','dropdown-menu','form','hover-card','input','label','menubar','navigation-menu','pagination','popover','progress','radio-group','resizable','scroll-area','select','separator','sheet','slider','sonner','switch','table','tabs','textarea','toggle-group','toggle','tooltip')

$deleted = 0
foreach ($comp in $reexports) {
    $file = Join-Path $platformUiDir "$comp.tsx"
    if (Test-Path $file) {
        # Verify it's actually a re-export (small file)
        $c = [System.IO.File]::ReadAllText($file)
        if ($c -match "export \* from '@/components/ui") {
            Remove-Item $file
            $deleted++
            Write-Host "Deleted proxy: $comp.tsx"
        }
    }
}

Write-Host "`nDeleted $deleted proxy re-export files"

# Step 3: Also delete the sidebar and collapsible that are now in ui/
if (Test-Path "$platformUiDir\sidebar.tsx") {
    # Keep it - it's a unique implementation used by platform sidebar
    Write-Host "KEPT: sidebar.tsx (unique platform implementation)"
}
if (Test-Path "$platformUiDir\collapsible.tsx") {
    Remove-Item "$platformUiDir\collapsible.tsx"
    Write-Host "Deleted: collapsible.tsx (now in ui/)"
}
