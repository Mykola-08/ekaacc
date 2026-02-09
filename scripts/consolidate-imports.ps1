$reexports = @('accordion','alert-dialog','alert','aspect-ratio','avatar','badge','breadcrumb','button','calendar','card','carousel','checkbox','command','context-menu','dialog','drawer','dropdown-menu','form','hover-card','input','label','menubar','navigation-menu','pagination','popover','progress','radio-group','resizable','scroll-area','select','separator','sheet','slider','sonner','switch','table','tabs','textarea','toggle-group','toggle','tooltip')

$files = Get-ChildItem -Recurse -Include "*.ts","*.tsx" -Path "src" | Where-Object { $_.FullName -notlike "*\platform\ui\*" }
$totalChanges = 0

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $original = $content
    foreach ($comp in $reexports) {
        $content = $content -replace "@/components/platform/ui/$comp", "@/components/ui/$comp"
    }
    # Also consolidate cn() imports
    $content = $content -replace "@/lib/platform/utils/css-utils", "@/lib/utils"
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($f.FullName, $content)
        $totalChanges++
        Write-Host "Updated: $($f.FullName -replace '.*\\ekaacc\\','')"
    }
}

Write-Host "`nTotal files updated: $totalChanges"
