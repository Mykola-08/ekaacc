import 'dotenv/config'

async function main() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[Resend] RESEND_API_KEY missing')
    process.exitCode = 1
    return
  }
  if (apiKey.startsWith('re_') === false) {
    console.warn('[Resend] API key format unexpected (should start with re_)')
  }
  try {
    // Lightweight auth check: list domains (no mutation)
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` }
    })
    if (res.status === 200) {
      const json = await res.json()
      console.log(`[Resend] OK. Domains: ${json.data?.length ?? 0}`)
    } else if (res.status === 401) {
      console.error('[Resend] Unauthorized. Check key permissions.')
      process.exitCode = 1
    } else {
      console.warn(`[Resend] Received status ${res.status}`)
    }
  } catch (e: any) {
    console.error('[Resend] Connectivity check failed:', e.message)
    process.exitCode = 1
  }
}

main()
