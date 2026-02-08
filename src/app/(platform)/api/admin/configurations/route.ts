import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/supabase'

// System configuration management
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabaseAdmin
      .from('system_configurations')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching configurations:', error)
      return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 })
    }

    // Group by category
    const groupedConfigs = data?.reduce((acc: any, config) => {
      if (!acc[config.category]) {
        acc[config.category] = []
      }
      acc[config.category].push({
        id: config.id,
        key: config.config_key,
        value: config.config_value,
        description: config.description,
        isActive: config.is_active,
        lastModified: config.updated_at,
        modifiedBy: config.modified_by
      })
      return acc
    }, {}) || {}

    return NextResponse.json({
      success: true,
      configurations: groupedConfigs,
      categories: Object.keys(groupedConfigs)
    })

  } catch (error) {
    console.error('Configuration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update system configuration
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { key, value, description, category } = await request.json() as any

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Check if configuration exists
    const { data: existing } = await supabaseAdmin
      .from('system_configurations')
      .select('id')
      .eq('config_key', key)
      .single()

    let result
    if (existing) {
      // Update existing configuration
      result = await supabaseAdmin
        .from('system_configurations')
        .update({
          config_value: value,
          description: description || null,
          modified_by: currentUser.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      // Create new configuration
      result = await supabaseAdmin
        .from('system_configurations')
        .insert({
          config_key: key,
          config_value: value,
          description: description || null,
          category: category || 'general',
          is_active: true,
          modified_by: currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error updating configuration:', result.error)
      return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 })
    }

    // Log configuration change
    await supabaseAdmin.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'admin.config.update',
      resource_type: 'system_configuration',
      resource_id: result.data?.id,
      details: {
        key,
        value,
        description,
        category,
        isNew: !existing
      },
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      configuration: result.data,
      message: existing ? 'Configuration updated successfully' : 'Configuration created successfully'
    })

  } catch (error) {
    console.error('Configuration update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Bulk configuration operations
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { configurations } = await request.json() as any

    if (!Array.isArray(configurations)) {
      return NextResponse.json({ error: 'Configurations must be an array' }, { status: 400 })
    }

    const results = await Promise.all(
      configurations.map(async (config: any) => {
        const { key, value, description, category } = config

        if (!key || value === undefined) {
          return { key, error: 'Key and value are required' }
        }

        try {
          const { data: existing } = await supabaseAdmin
            .from('system_configurations')
            .select('id')
            .eq('config_key', key)
            .single()

          let result
          if (existing) {
            result = await supabaseAdmin
              .from('system_configurations')
              .update({
                config_value: value,
                description: description || null,
                modified_by: currentUser.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)
              .select()
              .single()
          } else {
            result = await supabaseAdmin
              .from('system_configurations')
              .insert({
                config_key: key,
                config_value: value,
                description: description || null,
                category: category || 'general',
                is_active: true,
                modified_by: currentUser.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single()
          }

          return { key, success: true, data: result.data }
        } catch (error) {
          return { key, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })
    )

    // Log bulk configuration change
    await supabaseAdmin.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'admin.config.bulk_update',
      resource_type: 'system_configuration',
      details: {
        configurationCount: configurations.length,
        results: results.map(r => ({ key: r.key, success: r.success, error: r.error }))
      },
      created_at: new Date().toISOString()
    })

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => r.error).length

    return NextResponse.json({
      success: true,
      message: `${successCount} configurations updated successfully, ${errorCount} errors`,
      results,
      summary: {
        successCount,
        errorCount,
        total: configurations.length
      }
    })

  } catch (error) {
    console.error('Bulk configuration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete configuration
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Configuration key is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('system_configurations')
      .delete()
      .eq('config_key', key)
      .select()
      .single()

    if (error) {
      console.error('Error deleting configuration:', error)
      return NextResponse.json({ error: 'Failed to delete configuration' }, { status: 500 })
    }

    // Log configuration deletion
    await supabaseAdmin.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'admin.config.delete',
      resource_type: 'system_configuration',
      resource_id: data?.id,
      details: { key, timestamp: new Date().toISOString() },
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Configuration deleted successfully',
      deletedKey: key
    })

  } catch (error) {
    console.error('Configuration deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
