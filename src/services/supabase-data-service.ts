import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Database } from '@/types/supabase'

export type User = Database['public']['Tables']['users']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Referral = Database['public']['Tables']['referrals']['Row']
export type CommunityPost = Database['public']['Tables']['community_posts']['Row']

export class SupabaseDataService {
  // User operations
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return data
  }

  async createUser(userData: Database['public']['Tables']['users']['Insert']): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return data
  }

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      return null
    }
    return data
  }

  // Session operations
  async getUserSessions(userId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching sessions:', error)
      return []
    }
    return data || []
  }

  async createSession(sessionData: Database['public']['Tables']['sessions']['Insert']): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating session:', error)
      return null
    }
    return data
  }

  // Subscription operations
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
    return data
  }

  async createSubscription(subscriptionData: Database['public']['Tables']['subscriptions']['Insert']): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating subscription:', error)
      return null
    }
    return data
  }

  async updateSubscription(subscriptionId: string, updates: Database['public']['Tables']['subscriptions']['Update']): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating subscription:', error)
      return null
    }
    return data
  }

  // Referral operations
  async getReferralsByUser(userId: string): Promise<Referral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .or(`referrer_id.eq.${userId},referred_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching referrals:', error)
      return []
    }
    return data || []
  }

  async createReferral(referralData: Database['public']['Tables']['referrals']['Insert']): Promise<Referral | null> {
    const { data, error } = await supabase
      .from('referrals')
      .insert([referralData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating referral:', error)
      return null
    }
    return data
  }

  // Community posts
  async getApprovedCommunityPosts(): Promise<CommunityPost[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching community posts:', error)
      return []
    }
    return data || []
  }

  async createCommunityPost(postData: Database['public']['Tables']['community_posts']['Insert']): Promise<CommunityPost | null> {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating community post:', error)
      return null
    }
    return data
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all users:', error)
      return []
    }
    return data || []
  }
}

export const supabaseDataService = new SupabaseDataService()