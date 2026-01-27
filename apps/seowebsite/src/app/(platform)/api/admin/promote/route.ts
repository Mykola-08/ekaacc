import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const tokenHeader = req.headers.get('x-admin-promo-token') || ''
    const expected = process.env.ADMIN_PROMOTE_TOKEN

    if (!expected) {
      return NextResponse.json({ error: 'Server misconfigured: ADMIN_PROMOTE_TOKEN missing' }, { status: 500 })
    }
    if (tokenHeader !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email } = await req.json().catch(() => ({})) as { email?: string }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured: Supabase env missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1) Find user by email (simple scan; acceptable for temporary endpoint)
    const { data: users, error: userErr } = await supabase.auth.admin.listUsers()
    if (userErr) {
      return NextResponse.json({ error: `Failed to list users: ${userErr.message}` }, { status: 500 })
    }
    const user = users?.users?.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2) Fetch admin role id
    const { data: roleRow, error: roleErr } = await supabase
      .from('user_roles')
      .select('id')
      .eq('name', 'admin')
      .single()

    if (roleErr || !roleRow) {
      return NextResponse.json({ error: `Failed to fetch admin role: ${roleErr?.message || 'not found'}` }, { status: 500 })
    }

    // 3) Upsert assignment
    const { error: assignErr } = await supabase
      .from('user_role_assignments')
      .upsert({ user_id: user.id, role_id: roleRow.id }, { onConflict: 'user_id, role_id' })

    if (assignErr) {
      return NextResponse.json({ error: `Failed to assign role: ${assignErr.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, promoted: email })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: e?.message }, { status: 500 })
  }
}
