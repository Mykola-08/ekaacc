import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/context/auth-context'

// POST /api/admin/notifications/templates - Create notification template
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const templateData = await request.json()
    
    // Validate required fields
    if (!templateData.name || !templateData.title || !templateData.message) {
      return NextResponse.json({ error: 'Name, title, and message are required' }, { status: 400 })
    }

    const { data: template, error } = await supabase
      .from('notification_templates')
      .insert({
        name: templateData.name,
        title: templateData.title,
        message: templateData.message,
        type: templateData.type || 'info',
        priority: templateData.priority || 'medium',
        created_by: currentUser.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
    }

    return NextResponse.json({ template })

  } catch (error) {
    console.error('Error in POST /api/admin/notifications/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}