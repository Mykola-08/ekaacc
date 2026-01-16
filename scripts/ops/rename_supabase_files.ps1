
$root = "apps/seowebsite/src/lib/platform/supabase"
$renames = @{
    "supabase-utils.ts" = "utils.ts"
    "supabase-admin.ts" = "admin.ts"
    "supabase-auth.ts" = "auth.ts"
    "supabase-middleware.ts" = "middleware.ts"
}

foreach ($old in $renames.Keys) {
    if (Test-Path "$root/$old") {
        Move-Item "$root/$old" "$root/$($renames[$old])" -Force
        Write-Host "Renamed $old to $($renames[$old])"
    }
}
