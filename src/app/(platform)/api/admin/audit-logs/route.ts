import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/supabase'

// Advanced audit log viewer with filtering and analysis
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const resourceType = searchParams.get('resourceType')
    const severity = searchParams.get('severity')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const ipAddress = searchParams.get('ipAddress')
    const includeDetails = searchParams.get('includeDetails') === 'true'

    const offset = (page - 1) * limit

    // Build query with filters
    let query = supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (action) {
      query = query.ilike('action', `%${action}%`)
    }
    if (resourceType) {
      query = query.eq('resource_type', resourceType)
    }
    if (ipAddress) {
      query = query.eq('ip_address', ipAddress)
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching audit logs:', error)
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
    }

    // Process and categorize logs
    const processedLogs = data?.map(log => {
      let severityLevel = 'info'
      let category = 'general'

      if (log.action?.includes('error') || log.action?.includes('failed')) {
        severityLevel = 'error'
        category = 'error'
      } else if (log.action?.includes('security') || log.action?.includes('auth')) {
        severityLevel = 'warning'
        category = 'security'
      } else if (log.action?.includes('admin') || log.action?.includes('permission')) {
        severityLevel = 'warning'
        category = 'admin'
      } else if (log.action?.includes('create') || log.action?.includes('update') || log.action?.includes('delete')) {
        severityLevel = 'info'
        category = 'data_modification'
      }

      return {
        ...log,
        severity: severityLevel,
        category,
        details: includeDetails ? log.details : null
      }
    }) || []

    // Filter by severity if requested
    let filteredLogs = processedLogs
    if (severity && severity !== 'all') {
      filteredLogs = processedLogs.filter(log => log.severity === severity)
    }

    // Get summary statistics
    const summary = await getAuditSummary(dateFrom || undefined, dateTo || undefined)

    return NextResponse.json({
      logs: filteredLogs,
      summary,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        userId,
        action,
        resourceType,
        severity,
        dateFrom,
        dateTo,
        ipAddress
      }
    })

  } catch (error) {
    console.error('Audit log error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Security analysis endpoint
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { analysisType, timeframe } = await request.json() as any

    if (!analysisType) {
      return NextResponse.json({ error: 'Analysis type is required' }, { status: 400 })
    }

    let results = {}

    switch (analysisType) {
      case 'suspicious_activity':
        results = await analyzeSuspiciousActivity(timeframe)
        break

      case 'failed_logins':
        results = await analyzeFailedLogins(timeframe)
        break

      case 'permission_changes':
        results = await analyzePermissionChanges(timeframe)
        break

      case 'data_access':
        results = await analyzeDataAccess(timeframe)
        break

      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      analysisType,
      results,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Security analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
async function getAuditSummary(dateFrom?: string, dateTo?: string) {
  const query = supabaseAdmin.from('audit_logs').select('*')
  
  if (dateFrom) query.gte('created_at', dateFrom)
  if (dateTo) query.lte('created_at', dateTo)

  const { data } = await query

  const summary = {
    totalEvents: data?.length || 0,
    errors: data?.filter(log => log.action?.includes('error') || log.action?.includes('failed')).length || 0,
    securityEvents: data?.filter(log => log.action?.includes('security') || log.action?.includes('auth')).length || 0,
    adminEvents: data?.filter(log => log.action?.includes('admin')).length || 0,
    uniqueUsers: new Set(data?.map(log => log.user_id).filter(Boolean)).size || 0,
    uniqueIPs: new Set(data?.map(log => log.ip_address).filter(Boolean)).size || 0
  }

  return summary
}

async function analyzeSuspiciousActivity(timeframe: string = '7d') {
  const startDate = getTimeframeStartDate(timeframe)
  
  // Multiple failed login attempts from same IP
  const failedLogins = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%login%failed%')
    .gte('created_at', startDate.toISOString())

  const suspiciousIPs = failedLogins.data?.reduce((acc: any, log) => {
    const ip = log.ip_address
    if (ip) {
      acc[ip] = (acc[ip] || 0) + 1
    }
    return acc
  }, {})

  const highRiskIPs = Object.entries(suspiciousIPs || {})
    .filter(([_, count]) => (count as number) > 5)
    .map(([ip, count]) => ({ ip, attempts: count }))

  // Unusual access patterns
  const unusualAccess = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%access%')
    .gte('created_at', startDate.toISOString())

  const accessPatterns = unusualAccess.data?.reduce((acc: any, log) => {
    const userId = log.user_id
    if (userId) {
      if (!acc[userId]) acc[userId] = { count: 0, resources: new Set() }
      acc[userId].count++
      acc[userId].resources.add(log.resource_type)
    }
    return acc
  }, {})

  const suspiciousUsers = Object.entries(accessPatterns || {})
    .filter(([_, data]: [any, any]) => data.count > 20 || data.resources.size > 5)
    .map(([userId, data]: [any, any]) => ({ userId, accessCount: data.count, resources: Array.from(data.resources) }))

  return {
    highRiskIPs,
    suspiciousUsers,
    totalSuspiciousEvents: highRiskIPs.length + suspiciousUsers.length
  }
}

async function analyzeFailedLogins(timeframe: string = '7d') {
  const startDate = getTimeframeStartDate(timeframe)
  
  const failedLogins = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%login%failed%')
    .gte('created_at', startDate.toISOString())

  const byIP = failedLogins.data?.reduce((acc: any, log) => {
    const ip = log.ip_address || 'unknown'
    acc[ip] = (acc[ip] || 0) + 1
    return acc
  }, {})

  const byUser = failedLogins.data?.reduce((acc: any, log) => {
    const userId = log.user_id || 'unknown'
    acc[userId] = (acc[userId] || 0) + 1
    return acc
  }, {})

  return {
    totalFailedLogins: failedLogins.data?.length || 0,
    byIP: Object.entries(byIP || {}).map(([ip, count]) => ({ ip, count })),
    byUser: Object.entries(byUser || {}).map(([userId, count]) => ({ userId, count })),
    topIPs: Object.entries(byIP || {}).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5),
    topUsers: Object.entries(byUser || {}).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5)
  }
}

async function analyzePermissionChanges(timeframe: string = '7d') {
  const startDate = getTimeframeStartDate(timeframe)
  
  const permissionChanges = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%permission%')
    .gte('created_at', startDate.toISOString())

  const roleChanges = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%role%')
    .gte('created_at', startDate.toISOString())

  const elevatedPermissions = permissionChanges.data?.filter(log => 
    log.details?.includes('admin') || log.details?.includes('superuser')
  ) || []

  return {
    totalPermissionChanges: permissionChanges.data?.length || 0,
    totalRoleChanges: roleChanges.data?.length || 0,
    elevatedPermissions: elevatedPermissions.length,
    recentChanges: [...(permissionChanges.data || []), ...(roleChanges.data || [])]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
  }
}

async function analyzeDataAccess(timeframe: string = '7d') {
  const startDate = getTimeframeStartDate(timeframe)
  
  const dataAccess = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%read%')
    .gte('created_at', startDate.toISOString())

  const bulkAccess = dataAccess.data?.filter(log => 
    log.details?.includes('bulk') || log.details?.includes('export')
  ) || []

  const sensitiveAccess = dataAccess.data?.filter(log => 
    log.resource_type === 'user' || log.resource_type === 'payment' || log.resource_type === 'session'
  ) || []

  return {
    totalDataAccess: dataAccess.data?.length || 0,
    bulkAccess: bulkAccess.length,
    sensitiveAccess: sensitiveAccess.length,
    topResources: dataAccess.data?.reduce((acc: any, log) => {
      const resource = log.resource_type || 'unknown'
      acc[resource] = (acc[resource] || 0) + 1
      return acc
    }, {})
  }
}

function getTimeframeStartDate(timeframe: string): Date {
  const now = new Date()
  const days = parseInt(timeframe.replace('d', '')) || 7
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}
