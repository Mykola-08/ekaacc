$replacements = @{
    '@/components/' = '@/components/marketing/';
    '@/contexts/' = '@/context/marketing/';
    '@/hooks/' = '@/hooks/marketing/';
    '@/lib/' = '@/lib/marketing/';
    '@/types/' = '@/types/marketing/';
    '@/shared/' = '@/shared/marketing/';
    '"./globals.css"' = '"./marketing.css"';
    "'./globals.css'" = "'./marketing.css'"
}

$dirs = @(
    "src/app/(marketing)",
    "src/components/marketing",
    "src/context/marketing",
    "src/hooks/marketing",
    "src/lib/marketing",
    "src/types/marketing",
    "src/shared/marketing"
)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "Processing $dir"
        Get-ChildItem -Path $dir -Recurse -Include *.tsx,*.ts,*.css,*.js,*.jsx | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            if ($null -ne $content) {
                $newContent = $content
                foreach ($key in $replacements.Keys) {
                    $newContent = $newContent.Replace($key, $replacements[$key])
                }
                
                if ($_.Name -eq "marketing.css") {
                    $newContent = $newContent.Replace("@tailwind base;", "/* @tailwind base; */")
                    $newContent = $newContent.Replace("@tailwind components;", "/* @tailwind components; */")
                    $newContent = $newContent.Replace("@tailwind utilities;", "/* @tailwind utilities; */")
                }

                if ($content -ne $newContent) {
                    Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
                    Write-Host "Updated $($_.Name)"
                }
            }
        }
    } else {
        Write-Host "Skipping $dir (NotFound)"
    }
}
