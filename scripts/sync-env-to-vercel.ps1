$envVars = @{
    "SQUARE_ACCESS_TOKEN" = "EAAAl0bQ5SWEXDtx7fpkOsQl922HI0vwD3BTyKWF-8W5dTyBtrf-6_oEJ1DkWkFr"
    "SQUARE_APP_ID" = "sandbox-sq0idb-S5dB2M3UZBbtySrULtdMMQ"
    "SQUARE_ENVIRONMENT" = "sandbox"
    "STRIPE_SECRET_KEY" = "sk_test_51PpRJvGpCi2bO2ATqT52wQGfrJ6z4GfBhfiU2vRzT7KqJxBMvhhXB2NBz5o8UoZk5FE8zNoOKDBp0npJANeb4BHN00RB3N24J3"
    "SUPABASE_URL" = "https://rbnfyxhewsivofvwdpuk.supabase.co"
    "SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTYzNDQsImV4cCI6MjA3ODYzMjM0NH0.beEFcpqzV7obLX0McrR-lK7V37RE0RbRTpVEKcub_Ko"
    "SUPABASE_SERVICE_ROLE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1NjM0NCwiZXhwIjoyMDc4NjMyMzQ0fQ.5gzhfCb4GwDII-H6SFjhGegKa-Pk_aDxrOQkVVaGuMA"
    "RESEND_API_KEY" = "re_cBBB93z8_KpM6tFJNFM3naofSfLCi3q5d"
    "RESEND_FROM_EMAIL" = "Ekaacc <noreply@ekaacc.com>"
    "NEXT_PUBLIC_APP_URL" = "https://app.ekabalance.com"
    "AI_GATEWAY_API_KEY" = "vck_3lucTOjuNO1Vb3eOk92bN5g3OVScyRSzuxhTj12JZq6vrzZmSX3u50pr"
    "CRON_SECRET" = "local_cron_secret_123"
    "NEXT_PUBLIC_SUPABASE_URL" = "https://rbnfyxhewsivofvwdpuk.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NjMwNTYzNDQsImV4cCI6MjA3ODYzMjM0NH0.beEFcpqzV7obLX0McrR-lK7V37RE0RbRTpVEKcub_Ko"
    "POSTGRES_URL" = "postgres://postgres.rbnfyxhewsivofvwdpuk:x6tgW4EsRa1nSK3Q@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
    "POSTGRES_USER" = "postgres.rbnfyxhewsivofvwdpuk"
    "POSTGRES_PASSWORD" = "x6tgW4EsRa1nSK3Q"
    "POSTGRES_HOST" = "aws-1-eu-west-3.pooler.supabase.com"
    "POSTGRES_DATABASE" = "postgres"
    "POSTGRES_PRISMA_URL" = "postgres://postgres.rbnfyxhewsivofvwdpuk:x6tgW4EsRa1nSK3Q@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
    "POSTGRES_URL_NON_POOLING" = "postgres://postgres.rbnfyxhewsivofvwdpuk:x6tgW4EsRa1nSK3Q@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=require"
    "PAYLOAD_SECRET" = "your-secret-key-here"
}

Write-Host "Syncing environment variables to Vercel..."

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key..."
    
    # Add to Production
    Write-Host "  - Production"
    $value | vercel env add $key production --force 2>$null
    
    # Add to Preview
    Write-Host "  - Preview"
    $value | vercel env add $key preview --force 2>$null
    
    # Add to Development
    Write-Host "  - Development"
    $value | vercel env add $key development --force 2>$null
}

Write-Host "Done."
