$envVars = @{
    "SQUARE_ACCESS_TOKEN" = "[REDACTED]"
    "SQUARE_APP_ID" = "[REDACTED]"
    "SQUARE_ENVIRONMENT" = "sandbox"
    "STRIPE_SECRET_KEY" = "[REDACTED]"
    "SUPABASE_URL" = "[REDACTED]"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "[REDACTED]"
    "SUPABASE_SERVICE_ROLE_KEY" = "[REDACTED]"
    "RESEND_API_KEY" = "[REDACTED]"
    "RESEND_FROM_EMAIL" = "Ekaacc <noreply@ekaacc.com>"
    "NEXT_PUBLIC_APP_URL" = "https://app.ekabalance.com"
    "AI_GATEWAY_API_KEY" = "[REDACTED]"
    "CRON_SECRET" = "[REDACTED]"
    "NEXT_PUBLIC_SUPABASE_URL" = "[REDACTED]"
    "POSTGRES_URL" = "[REDACTED]"
    "POSTGRES_USER" = "[REDACTED]"
    "POSTGRES_PASSWORD" = "[REDACTED]"
    "POSTGRES_HOST" = "[REDACTED]"
    "POSTGRES_DATABASE" = "postgres"
    "POSTGRES_PRISMA_URL" = "[REDACTED]"
    "POSTGRES_URL_NON_POOLING" = "postgres://postgres.dopkncrqutxnchwqxloa:x6tgW4EsRa1nSK3Q@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"
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
