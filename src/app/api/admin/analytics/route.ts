import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/supabase'

// System analytics and monitoring API
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'
    const metric = searchParams.get('metric') || 'all'

    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const results: any = {}

    if (metric === 'all' || metric === 'users') {
      // User analytics
      const userStats = await supabaseAdmin
        .from('user_profiles')
        .select('created_at, last_active, account_status, role')
        .gte('created_at', startDate.toISOString())

      const totalUsers = await supabaseAdmin
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })

      const activeUsers = userStats.data?.filter(u => 
        u.last_active && new Date(u.last_active) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0

      const newUsers = userStats.data?.filter(u => 
        new Date(u.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0

      results.users = {
        total: totalUsers.count || 0,
        active: activeUsers,
        new: newUsers,
        growthRate: totalUsers.count ? (newUsers / totalUsers.count) * 100 : 0,
        byStatus: {
          active: userStats.data?.filter(u => u.account_status === 'active').length || 0,
          suspended: userStats.data?.filter(u => u.account_status === 'suspended').length || 0,
          pending: userStats.data?.filter(u => u.account_status === 'pending').length || 0
        }
      }
    }

    if (metric === 'all' || metric === 'sessions') {
      // Session analytics
      const sessionStats = await supabaseAdmin
        .from('sessions')
        .select('created_at, status, duration, therapist_id')
        .gte('created_at', startDate.toISOString())

      const totalSessions = sessionStats.data?.length || 0
      const completedSessions = sessionStats.data?.filter(s => s.status === 'completed').length || 0
      const avgDuration = sessionStats.data?.reduce((acc, s) => acc + (s.duration || 0), 0) / totalSessions || 0

      results.sessions = {
        total: totalSessions,
        completed: completedSessions,
        completionRate: totalSessions ? (completedSessions / totalSessions) * 100 : 0,
        averageDuration: Math.round(avgDuration),
        byTherapist: sessionStats.data?.reduce((acc: any, session) => {
          const therapist = session.therapist_id || 'unknown'
          acc[therapist] = (acc[therapist] || 0) + 1
          return acc
        }, {}) || {}
      }
    }

    if (metric === 'all' || metric === 'revenue') {
      // Revenue analytics
      const revenueStats = await supabaseAdmin
        .from('payments')
        .select('amount, status, created_at, currency')
        .gte('created_at', startDate.toISOString())

      const totalRevenue = revenueStats.data?.reduce((acc, p) => 
        p.status === 'succeeded' ? acc + (p.amount || 0) : acc, 0
      ) || 0

      const successfulPayments = revenueStats.data?.filter(p => p.status === 'succeeded').length || 0
      const totalPayments = revenueStats.data?.length || 0

      results.revenue = {
        total: totalRevenue / 100, // Convert from cents
        successfulPayments,
        successRate: totalPayments ? (successfulPayments / totalPayments) * 100 : 0,
        averagePayment: successfulPayments ? (totalRevenue / 100) / successfulPayments : 0
      }
    }

    if (metric === 'all' || metric === 'system') {
      // System health metrics
      const systemStats = await supabaseAdmin
        .from('audit_logs')
        .select('action, created_at, details')
        .gte('created_at', startDate.toISOString())

      const errorLogs = systemStats.data?.filter(log => 
        log.action?.includes('error') || log.action?.includes('failed')
      ).length || 0

      const securityEvents = systemStats.data?.filter(log => 
        log.action?.includes('security') || log.action?.includes('auth')
      ).length || 0

      results.system = {
        totalEvents: systemStats.data?.length || 0,
        errors: errorLogs,
        securityEvents,
        errorRate: systemStats.data?.length ? (errorLogs / systemStats.data.length) * 100 : 0
      }
    }

    if (metric === 'all' || metric === 'performance') {
      // Performance metrics (simplified)
      const performanceStats = await supabaseAdmin
        .from('audit_logs')
        .select('details, created_at')
        .like('action', '%response_time%')
        .gte('created_at', startDate.toISOString())

      const responseTimes = performanceStats.data?.map(log => {
        try {
          return JSON.parse(log.details as string)?.response_time || 0
        } catch {
          return 0
        }
      }).filter(time => time > 0) || []

      const avgResponseTime = responseTimes.length ? 
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0

      results.performance = {
        averageResponseTime: Math.round(avgResponseTime),
        slowRequests: responseTimes.filter(time => time > 1000).length,
        totalRequests: responseTimes.length
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      timeframe,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Real-time monitoring endpoint
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { metric, threshold } = await request.json()

    if (!metric) {
      return NextResponse.json({ error: 'Metric is required' }, { status: 400 })
    }

    // Get current metric value
    let currentValue = 0
    let isAlert = false

    switch (metric) {
      case 'active_users':
        const activeUsers = await supabaseAdmin
          .from('user_profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_active', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        
        currentValue = activeUsers.count || 0
        isAlert = threshold ? currentValue > threshold : false
        break

      case 'error_rate':
        const recentLogs = await supabaseAdmin
          .from('audit_logs')
          .select('action', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
          .like('action', '%error%')
        
        const totalLogs = await supabaseAdmin
          .from('audit_logs')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        
        currentValue = totalLogs.count ? (recentLogs.count || 0) / totalLogs.count * 100 : 0
        isAlert = threshold ? currentValue > threshold : false
        break

      case 'system_load':
        // Simplified system load calculation
        const recentSessions = await supabaseAdmin
          .from('sessions')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()) // Last 10 minutes
        
        currentValue = recentSessions.count || 0
        isAlert = threshold ? currentValue > threshold : false
        break

      default:
        return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      metric,
      currentValue,
      threshold,
      isAlert,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Monitoring error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}