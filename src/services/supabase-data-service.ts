import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import type { IDataService } from './data-service'
import type { User as AppUser, Session as AppSession, CommunityPost as AppCommunityPost } from '@/lib/types'

// Database types
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbSession = Database['public']['Tables']['sessions']['Row']
export type DbSubscription = Database['public']['Tables']['subscriptions']['Row']
export type DbReferral = Database['public']['Tables']['referrals']['Row']
export type DbCommunityPost = Database['public']['Tables']['community_posts']['Row']

export class SupabaseDataService implements IDataService {
  isMock = false;

  // Mapping functions
  private mapDbUserToAppUser(dbUser: DbUser): AppUser {
    const profileData = (dbUser.profile_data as any) || {}
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      uid: dbUser.id,
      name: profileData.name || profileData.displayName || dbUser.email.split('@')[0],
      displayName: profileData.displayName || profileData.name || dbUser.email.split('@')[0],
      phoneNumber: profileData.phoneNumber || profileData.phone,
      avatarUrl: profileData.avatarUrl || profileData.photoURL,
      role: profileData.role || 'Patient',
      initials: this.generateInitials(profileData.name || profileData.displayName || dbUser.email),
      createdAt: dbUser.created_at,
      
      // Profile Information
      bio: profileData.bio,
      location: profileData.location,
      dateOfBirth: profileData.dateOfBirth || profileData.birthday,
      gender: profileData.gender,
      emergencyContact: profileData.emergencyContact,
      
      // Additional Profile Info
      birthday: profileData.birthday || profileData.dateOfBirth,
      preferences: profileData.preferences,
      
      // Settings
      settings: profileData.settings,
      
      // Therapist Profile
      therapistProfile: profileData.therapistProfile,
      
      // Privacy & Visibility
      profileVisibility: profileData.profileVisibility,
      
      // Account Status
      accountStatus: profileData.accountStatus || 'active',
      suspendedReason: profileData.suspendedReason,
      suspendedUntil: profileData.suspendedUntil,
      lastLoginAt: profileData.lastLoginAt,
      profileCompleteness: profileData.profileCompleteness || 0,
      
      // Goals
      goal: profileData.goal,
      personalizationCompleted: profileData.personalizationCompleted || false,
      personalization: profileData.personalization,
      
      // Activity Data
      activityData: profileData.activityData,
      
      // Recommendations
      recommendations: profileData.recommendations,
      
      // Personalized Content
      personalizedContent: profileData.personalizedContent,
      dashboardWidgets: profileData.dashboardWidgets,
      
      // Subscription Status
      subscriptionType: (dbUser.subscription_status as any) || profileData.subscriptionType || 'Free',
      
      // Loyal Subscription
      isLoyal: profileData.isLoyal || false,
      loyalTier: profileData.loyalTier,
      loyalSince: profileData.loyalSince,
      loyalExpiresAt: profileData.loyalExpiresAt,
      loyalBenefits: profileData.loyalBenefits,
      
      // VIP Status
      isVip: dbUser.is_premium || profileData.isVip || false,
      vipTier: profileData.vipTier,
      vipSince: profileData.vipSince,
      vipExpiresAt: profileData.vipExpiresAt,
      vipBenefits: profileData.vipBenefits,
      
      // Donation Related
      isDonor: profileData.isDonor || false,
      isDonationSeeker: profileData.isDonationSeeker || false,
      isDonationSeekerApplicationPending: profileData.isDonationSeekerApplicationPending || false,
      totalDonated: profileData.totalDonated || 0,
      totalReceived: profileData.totalReceived || 0,
      donationSeekerApproved: profileData.donationSeekerApproved || false,
      donationSeekerReason: profileData.donationSeekerReason,
      
      // Loyalty Points
      loyaltyPoints: profileData.loyaltyPoints,
      
      // Relationships
      linkedChildren: profileData.linkedChildren,
      linkedParent: profileData.linkedParent,
      linkedTherapist: profileData.linkedTherapist,
      
      // Additional metadata
      squareCustomerId: profileData.squareCustomerId,
      preferredLanguage: profileData.preferredLanguage,
      timezone: profileData.timezone
    }
  }

  private mapAppUserToDbUser(appUser: Partial<AppUser>): Partial<DbUser> {
    const profileData: any = {
      name: appUser.name,
      displayName: appUser.displayName,
      phoneNumber: appUser.phoneNumber,
      avatarUrl: appUser.avatarUrl,
      role: appUser.role,
      bio: appUser.bio,
      location: appUser.location,
      dateOfBirth: appUser.dateOfBirth,
      gender: appUser.gender,
      emergencyContact: appUser.emergencyContact,
      birthday: appUser.birthday,
      preferences: appUser.preferences,
      settings: appUser.settings,
      therapistProfile: appUser.therapistProfile,
      profileVisibility: appUser.profileVisibility,
      accountStatus: appUser.accountStatus,
      suspendedReason: appUser.suspendedReason,
      suspendedUntil: appUser.suspendedUntil,
      lastLoginAt: appUser.lastLoginAt,
      profileCompleteness: appUser.profileCompleteness,
      goal: appUser.goal,
      personalizationCompleted: appUser.personalizationCompleted,
      personalization: appUser.personalization,
      activityData: appUser.activityData,
      recommendations: appUser.recommendations,
      personalizedContent: appUser.personalizedContent,
      dashboardWidgets: appUser.dashboardWidgets,
      subscriptionType: appUser.subscriptionType,
      isLoyal: appUser.isLoyal,
      loyalTier: appUser.loyalTier,
      loyalSince: appUser.loyalSince,
      loyalExpiresAt: appUser.loyalExpiresAt,
      loyalBenefits: appUser.loyalBenefits,
      isVip: appUser.isVip,
      vipTier: appUser.vipTier,
      vipSince: appUser.vipSince,
      vipExpiresAt: appUser.vipExpiresAt,
      vipBenefits: appUser.vipBenefits,
      isDonor: appUser.isDonor,
      isDonationSeeker: appUser.isDonationSeeker,
      isDonationSeekerApplicationPending: appUser.isDonationSeekerApplicationPending,
      totalDonated: appUser.totalDonated,
      totalReceived: appUser.totalReceived,
      donationSeekerApproved: appUser.donationSeekerApproved,
      donationSeekerReason: appUser.donationSeekerReason,
      loyaltyPoints: appUser.loyaltyPoints,
      linkedChildren: appUser.linkedChildren,
      linkedParent: appUser.linkedParent,
      linkedTherapist: appUser.linkedTherapist,
      squareCustomerId: appUser.squareCustomerId,
      preferredLanguage: appUser.preferredLanguage,
      timezone: appUser.timezone
    }

    return {
      id: appUser.id,
      email: appUser.email,
      profile_data: profileData,
      subscription_status: (appUser as any).subscription_status,
      subscription_end_date: (appUser as any).subscription_end_date,
      is_premium: (appUser as any).is_premium,
      referral_code: (appUser as any).referral_code,
      referred_by: (appUser as any).referred_by,
      onboarding_completed: (appUser as any).onboarding_completed
    }
  }

  private mapDbSessionToAppSession(dbSession: DbSession): AppSession {
    const sessionData = (dbSession.session_data as any) || {}
    
    return {
      id: dbSession.id,
      userId: dbSession.user_id,
      date: sessionData.date || new Date(dbSession.created_at).toISOString().split('T')[0],
      time: sessionData.time || new Date(dbSession.created_at).toLocaleTimeString(),
      type: sessionData.type || 'Therapy Session',
      therapist: sessionData.therapist || sessionData.therapistName || 'Unknown Therapist',
      therapistAvatarUrl: sessionData.therapistAvatarUrl,
      location: sessionData.location,
      status: sessionData.status || (dbSession.mood_rating ? 'Completed' : 'Upcoming'),
      notes: dbSession.notes || sessionData.notes,
      duration: dbSession.duration || sessionData.duration || 60,
      squareAppointmentId: sessionData.squareAppointmentId
    }
  }

  private mapAppSessionToDbSession(appSession: Partial<AppSession>): Partial<DbSession> {
    const sessionData: any = {
      date: appSession.date,
      time: appSession.time,
      type: appSession.type,
      therapist: appSession.therapist,
      therapistAvatarUrl: appSession.therapistAvatarUrl,
      location: appSession.location,
      status: appSession.status,
      notes: appSession.notes,
      duration: appSession.duration,
      squareAppointmentId: appSession.squareAppointmentId
    }

    return {
      id: appSession.id,
      user_id: appSession.userId,
      session_data: sessionData,
      mood_rating: null, // This would need to be handled separately
      notes: appSession.notes,
      duration: appSession.duration
    }
  }

  private mapDbCommunityPostToAppCommunityPost(dbPost: DbCommunityPost): AppCommunityPost {
    // This would need to be implemented based on how user data is stored
    // For now, return a basic mapping
    return {
      id: dbPost.id,
      author: 'Unknown User', // Would need to fetch user data
      authorAvatar: '',
      title: 'Community Post',
      content: dbPost.content,
      category: 'General',
      likes: dbPost.likes_count,
      replies: 0,
      createdAt: dbPost.created_at,
      tags: []
    }
  }

  private generateInitials(name?: string, email?: string): string {
    if (!name && !email) return 'U'
    
    const displayName = name || email!.split('@')[0]
    const words = displayName.split(' ')
    
    if (words.length === 1) {
      return displayName.substring(0, 2).toUpperCase()
    }
    
    return words.map(word => word[0]).join('').toUpperCase().substring(0, 2)
  }

  // User Management
  async getCurrentUser(): Promise<AppUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return this.mapDbUserToAppUser(data as DbUser)
  }

  async getAllUsers(): Promise<AppUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    return (data as DbUser[]).map(user => this.mapDbUserToAppUser(user))
  }

  async updateUser(userId: string, updates: Partial<AppUser>): Promise<void> {
    const dbUpdates = this.mapAppUserToDbUser(updates)
    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
    
    if (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AppUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    if (!data.user) throw new Error('No user returned')
    
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not found')
    return user
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Sessions
  async getSessions(userId?: string): Promise<AppSession[]> {
    const currentUser = await this.getCurrentUser()
    const targetUserId = userId || currentUser?.id
    
    if (!targetUserId) return []
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching sessions:', error)
      return []
    }
    return (data as DbSession[]).map(session => this.mapDbSessionToAppSession(session))
  }

  async createSession(session: Omit<AppSession, 'id'>): Promise<AppSession> {
    const dbSession = this.mapAppSessionToDbSession(session)
    const { data, error } = await supabase
      .from('sessions')
      .insert([dbSession])
      .select()
      .single()
    
    if (error) throw error
    return this.mapDbSessionToAppSession(data as DbSession)
  }

  async updateSession(sessionId: string, updates: Partial<AppSession>): Promise<void> {
    const dbUpdates = this.mapAppSessionToDbSession(updates)
    const { error } = await supabase
      .from('sessions')
      .update(dbUpdates)
      .eq('id', sessionId)
    
    if (error) throw error
  }

  async cancelSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, { status: 'Canceled' })
  }

  // Reports
  async getReports(userId?: string): Promise<any[]> {
    const currentUser = await this.getCurrentUser()
    const targetUserId = userId || currentUser?.id
    
    if (!targetUserId) return []
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reports:', error)
      return []
    }
    return data || []
  }

  async createReport(report: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Services/Therapies
  async getServices(): Promise<any[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching services:', error)
      return []
    }
    return data || []
  }

  async createService(service: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateService(serviceId: string, updates: Partial<any>): Promise<void> {
    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', serviceId)
    
    if (error) throw error
  }

  // Journal Entries
  async getJournalEntries(userId?: string): Promise<any[]> {
    const currentUser = await this.getCurrentUser()
    const targetUserId = userId || currentUser?.id
    
    if (!targetUserId) return []
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching journal entries:', error)
      return []
    }
    return data || []
  }

  async createJournalEntry(entry: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entry])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Goals
  async getGoals(userId?: string): Promise<any[]> {
    const currentUser = await this.getCurrentUser()
    const targetUserId = userId || currentUser?.id
    
    if (!targetUserId) return []
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching goals:', error)
      return []
    }
    return data || []
  }

  async createGoal(goal: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('goals')
      .insert([goal])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
    
    if (error) throw error
  }

  // Exercises
  async getExercises(): Promise<any[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching exercises:', error)
      return []
    }
    return data || []
  }

  // Community
  async getCommunityPosts(): Promise<AppCommunityPost[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching community posts:', error)
      return []
    }
    return (data as DbCommunityPost[]).map(post => this.mapDbCommunityPostToAppCommunityPost(post))
  }

  async createCommunityPost(post: Omit<AppCommunityPost, 'id'>): Promise<AppCommunityPost> {
    const dbPost: Omit<DbCommunityPost, 'id'> = {
      user_id: post.author,
      title: post.title || 'Untitled Post',
      content: post.content,
      category: post.category || null,
      tags: post.tags || [],
      is_published: post.isPublished || false,
      published_at: post.isPublished ? new Date().toISOString() : null,
      likes_count: 0,
      comments_count: 0,
      views_count: 0,
      is_featured: false,
      is_anonymous: post.isAnonymous || false,
      metadata: post.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert([dbPost])
      .select()
      .single()
    
    if (error) throw error
    return this.mapDbCommunityPostToAppCommunityPost(data as DbCommunityPost)
  }

  // AI Features
  async getAIChatResponse(prompt: string, history: any[]): Promise<string> {
    throw new Error('AI chat response not implemented')
  }

  async getAIRecommendations(): Promise<any[]> {
    throw new Error('AI recommendations not implemented')
  }

  async getAIReportSummary(reportId: string): Promise<string> {
    throw new Error('AI report summary not implemented')
  }

  // Donations
  async getDonations(userId?: string): Promise<any[]> {
    const currentUser = await this.getCurrentUser()
    const targetUserId = userId || currentUser?.id
    
    if (!targetUserId) return []
    
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .or(`donor_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching donations:', error)
      return []
    }
    return data || []
  }

  async addDonation(donation: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('donations')
      .insert([donation])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Messages
  async getMessages(conversationId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }
    return data || []
  }

  async sendMessage(conversationId: string, message: Omit<any, 'id'>): Promise<any> {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ ...message, conversation_id: conversationId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Initialization
  async isReady(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1)
      return !error
    } catch (error) {
      return false
    }
  }
}

export const supabaseDataService = new SupabaseDataService()