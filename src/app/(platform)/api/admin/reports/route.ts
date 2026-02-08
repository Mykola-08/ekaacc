import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/supabase'

// Advanced reporting and data export system
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'users'
    const format = searchParams.get('format') || 'json'
    const dateFrom = searchParams.get('dateFrom') ?? undefined
    const dateTo = searchParams.get('dateTo') ?? undefined
    const groupBy = searchParams.get('groupBy') ?? undefined

    let data: any = null
    let reportTitle = ''
    let columns: string[] = []

    switch (reportType) {
      case 'users':
        data = await generateUserReport(dateFrom, dateTo, groupBy)
        reportTitle = 'User Activity Report'
        columns = ['User ID', 'Email', 'Role', 'Status', 'Created Date', 'Last Active', 'Sessions Count', 'Total Revenue']
        break

      case 'sessions':
        data = await generateSessionReport(dateFrom, dateTo, groupBy)
        reportTitle = 'Session Analytics Report'
        columns = ['Session ID', 'User ID', 'Therapist', 'Date', 'Duration', 'Status', 'Revenue', 'Rating']
        break

      case 'revenue':
        data = await generateRevenueReport(dateFrom, dateTo, groupBy)
        reportTitle = 'Revenue Analysis Report'
        columns = ['Date', 'Total Revenue', 'Successful Payments', 'Failed Payments', 'Average Transaction', 'New Customers']
        break

      case 'system_health':
        data = await generateSystemHealthReport(dateFrom, dateTo)
        reportTitle = 'System Health Report'
        columns = ['Date', 'Total Requests', 'Error Rate', 'Average Response Time', 'Active Users', 'System Load']
        break

      case 'security':
        data = await generateSecurityReport(dateFrom, dateTo)
        reportTitle = 'Security Analysis Report'
        columns = ['Date', 'Login Attempts', 'Failed Logins', 'Security Events', 'Suspicious Activities', 'Blocked IPs']
        break

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Log report generation
    await supabaseAdmin.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'admin.report.generated',
      resource_type: 'report',
      details: {
        reportType,
        format,
        dateFrom,
        dateTo,
        groupBy,
        recordCount: Array.isArray(data) ? data.length : 1
      },
      created_at: new Date().toISOString()
    })

    if (format === 'csv') {
      const csvData = convertToCSV(data, columns)
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        report: {
          title: reportTitle,
          generatedAt: new Date().toISOString(),
          parameters: { dateFrom, dateTo, groupBy },
          data,
          columns
        }
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })

  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Report generation functions
async function generateUserReport(dateFrom?: string, dateTo?: string, groupBy?: string | null) {
  let query = supabaseAdmin
    .from('user_profiles')
    .select(`
      *,
      user_role_assignments!inner(
        role_id,
        user_roles!inner(name, description)
      ),
      sessions(count),
      payments!inner(sum: amount)
    `)

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)

  const { data, error } = await query

  if (error) throw error

  return data?.map(user => ({
    userId: user.id,
    email: user.email,
    role: user.user_role_assignments.user_roles.name,
    status: user.account_status || 'active',
    createdDate: user.created_at,
    lastActive: user.last_active,
    sessionsCount: user.sessions?.[0]?.count || 0,
    totalRevenue: (user.payments?.[0]?.sum || 0) / 100 // Convert from cents
  })) || []
}

async function generateSessionReport(dateFrom?: string, dateTo?: string, groupBy?: string | null) {
  let query = supabaseAdmin
    .from('sessions')
    .select(`
      *,
      user_profiles!inner(email, full_name),
      therapist_profiles!inner(full_name)
    `)

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)

  const { data, error } = await query

  if (error) throw error

  return data?.map(session => ({
    sessionId: session.id,
    userId: session.user_id,
    userEmail: session.user_profiles.email,
    therapist: session.therapist_profiles.full_name,
    date: session.created_at,
    duration: session.duration,
    status: session.status,
    revenue: (session.revenue || 0) / 100,
    rating: session.rating
  })) || []
}

async function generateRevenueReport(dateFrom?: string, dateTo?: string, groupBy?: string | null) {
  let query = supabaseAdmin
    .from('payments')
    .select(`
      *,
      user_profiles!inner(email)
    `)

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)

  const { data, error } = await query

  if (error) throw error

  // Group by date
  const groupedData = data?.reduce((acc: any, payment) => {
    const date = payment.created_at.split('T')[0]
    if (!acc[date]) {
      acc[date] = {
        date,
        totalRevenue: 0,
        successfulPayments: 0,
        failedPayments: 0,
        newCustomers: new Set()
      }
    }

    acc[date].totalRevenue += payment.amount
    if (payment.status === 'succeeded') {
      acc[date].successfulPayments++
    } else {
      acc[date].failedPayments++
    }
    acc[date].newCustomers.add(payment.user_id)

    return acc
  }, {}) || {}

  return Object.values(groupedData).map((day: any) => ({
    date: day.date,
    totalRevenue: day.totalRevenue / 100,
    successfulPayments: day.successfulPayments,
    failedPayments: day.failedPayments,
    averageTransaction: day.totalRevenue / 100 / (day.successfulPayments + day.failedPayments),
    newCustomers: day.newCustomers.size
  }))
}

async function generateSystemHealthReport(dateFrom?: string, dateTo?: string) {
  let query = supabaseAdmin
    .from('audit_logs')
    .select('*')
    .like('action', '%response_time%')

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)

  const { data, error } = await query

  if (error) throw error

  // Group by date
  const groupedData = data?.reduce((acc: any, log) => {
    const date = log.created_at.split('T')[0]
    if (!acc[date]) {
      acc[date] = {
        date,
        totalRequests: 0,
        errorCount: 0,
        responseTimes: [],
        uniqueUsers: new Set()
      }
    }

    acc[date].totalRequests++
    if (log.action?.includes('error')) {
      acc[date].errorCount++
    }

    try {
      const details = JSON.parse(log.details as string)
      if (details.response_time) {
        acc[date].responseTimes.push(details.response_time)
      }
    } catch {
      // Ignore parsing errors
    }

    if (log.user_id) {
      acc[date].uniqueUsers.add(log.user_id)
    }

    return acc
  }, {}) || {}

  return Object.values(groupedData).map((day: any) => {
    const avgResponseTime = day.responseTimes.length ? 
      day.responseTimes.reduce((a: number, b: number) => a + b, 0) / day.responseTimes.length : 0

    return {
      date: day.date,
      totalRequests: day.totalRequests,
      errorRate: day.totalRequests ? (day.errorCount / day.totalRequests) * 100 : 0,
      averageResponseTime: Math.round(avgResponseTime),
      activeUsers: day.uniqueUsers.size,
      systemLoad: Math.min(100, (day.totalRequests / 1000) * 100) // Simplified load calculation
    }
  })
}

async function generateSecurityReport(dateFrom?: string, dateTo?: string) {
  let query = supabaseAdmin
    .from('audit_logs')
    .select('*')
    .or('action.like.%login%,action.like.%auth%,action.like.%security%')

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)

  const { data, error } = await query

  if (error) throw error

  // Group by date
  const groupedData = data?.reduce((acc: any, log) => {
    const date = log.created_at.split('T')[0]
    if (!acc[date]) {
      acc[date] = {
        date,
        loginAttempts: 0,
        failedLogins: 0,
        securityEvents: 0,
        suspiciousActivities: 0,
        blockedIPs: new Set()
      }
    }

    if (log.action?.includes('login')) {
      acc[date].loginAttempts++
      if (log.action?.includes('failed')) {
        acc[date].failedLogins++
        if (log.ip_address) {
          acc[date].blockedIPs.add(log.ip_address)
        }
      }
    }

    if (log.action?.includes('security')) {
      acc[date].securityEvents++
    }

    if (log.action?.includes('suspicious') || log.details?.includes('suspicious')) {
      acc[date].suspiciousActivities++
    }

    return acc
  }, {}) || {}

  return Object.values(groupedData).map((day: any) => ({
    date: day.date,
    loginAttempts: day.loginAttempts,
    failedLogins: day.failedLogins,
    securityEvents: day.securityEvents,
    suspiciousActivities: day.suspiciousActivities,
    blockedIPs: day.blockedIPs.size
  }))
}

// Utility function to convert data to CSV
function convertToCSV(data: any[], columns: string[]): string {
  if (!data || data.length === 0) {
    return columns.join(',') + '\n'
  }

  const csvRows = [columns.join(',')]
  
  for (const row of data) {
    const values = columns.map(col => {
      // Handle nested properties and convert to string
      const value = row[Object.keys(row).find(key => key.toLowerCase().replace(/_/g, '') === col.toLowerCase().replace(/\s+/g, '')) || '']
      const stringValue = value === null || value === undefined ? '' : String(value)
      // Escape quotes and wrap in quotes if contains comma or quote
      return stringValue.includes(',') || stringValue.includes('"') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}
