/**
 * Comprehensive Unit Tests for Enhanced Data Service (DAL)
 * Tests all CRUD operations, error handling, validation, and transaction support
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { enhancedDataService } from '@/services/enhanced-data-service'
import { supabase } from '@/lib/supabase'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(() => ({ data: null, error: null })),
          range: jest.fn(() => ({ data: null, error: null }))
        })),
        in: jest.fn(() => ({
          single: jest.fn()
        })),
        order: jest.fn(() => ({ data: null, error: null }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({ error: null }))
      }))
    })),
    sql: jest.fn((template) => template)
  }
}))

describe('EnhancedDataService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Services Management', () => {
    const mockService = {
      id: 'service-1',
      name: 'Test Service',
      description: 'Test Description',
      price: 100,
      currency: 'EUR',
      duration: 60,
      category: 'Therapy',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    describe('getServiceById', () => {
      it('should fetch service by ID successfully', async () => {
        const mockSingle = jest.fn().mockResolvedValue({ data: mockService, error: null })
        const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: mockSelect,
          insert: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.getServiceById('service-1')
        
        expect(result).toEqual(mockService)
        expect(supabase.from).toHaveBeenCalledWith('services')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(mockEq).toHaveBeenCalledWith('id', 'service-1')
        expect(mockSingle).toHaveBeenCalled()
      })

      it('should handle error when fetching service', async () => {
        const mockError = new Error('Service not found')
        const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError })
        const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: mockSelect,
          insert: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        await expect(enhancedDataService.getServiceById('invalid-id')).rejects.toThrow('Service not found')
      })
    })

    describe('getServicesByCategory', () => {
      it('should fetch services by category successfully', async () => {
        const mockData = [mockService]
        const mockOrder = jest.fn().mockReturnValue({ data: mockData, error: null })
        const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: mockSelect,
          insert: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.getServicesByCategory('Therapy')
        
        expect(result).toEqual(mockData)
        expect(supabase.from).toHaveBeenCalledWith('services')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(mockEq).toHaveBeenCalledWith('category', 'Therapy')
        expect(mockOrder).toHaveBeenCalledWith('name')
      })
    })

    describe('createServiceWithValidation', () => {
      it('should create service with validation successfully', async () => {
        const newService = {
          name: 'New Service',
          price: 150,
          currency: 'EUR',
          category: 'Therapy'
        }

        const mockSingle = jest.fn().mockResolvedValue({ data: { ...mockService, ...newService }, error: null })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: mockInsert,
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.createServiceWithValidation(newService as any)
        
        expect(result).toMatchObject(newService)
        expect(mockInsert).toHaveBeenCalledWith([newService])
        expect(mockSelect).toHaveBeenCalled()
        expect(mockSingle).toHaveBeenCalled()
      })

      it('should validate service name is required', async () => {
        const invalidService = {
          name: '',
          price: 100
        }

        await expect(enhancedDataService.createServiceWithValidation(invalidService as any))
          .rejects.toThrow('Service name is required')
      })

      it('should validate service price cannot be negative', async () => {
        const invalidService = {
          name: 'Test Service',
          price: -100
        }

        await expect(enhancedDataService.createServiceWithValidation(invalidService as any))
          .rejects.toThrow('Service price cannot be negative')
      })
    })

    describe('updateServiceWithValidation', () => {
      it('should update service with validation successfully', async () => {
        const updates = { price: 200, name: 'Updated Service' }
        const mockSingle = jest.fn().mockResolvedValue({ data: { ...mockService, ...updates }, error: null })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: jest.fn(),
          update: mockUpdate,
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.updateServiceWithValidation('service-1', updates)
        
        expect(result).toMatchObject(updates)
        expect(mockUpdate).toHaveBeenCalledWith(updates)
        expect(mockEq).toHaveBeenCalledWith('id', 'service-1')
      })

      it('should validate price update cannot be negative', async () => {
        const invalidUpdates = { price: -50 }

        await expect(enhancedDataService.updateServiceWithValidation('service-1', invalidUpdates))
          .rejects.toThrow('Service price cannot be negative')
      })
    })

    describe('deleteService', () => {
      it('should delete service successfully', async () => {
        const mockEq = jest.fn().mockReturnValue({ error: null })
        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: jest.fn(),
          update: jest.fn(),
          delete: mockDelete
        } as any)

        await enhancedDataService.deleteService('service-1')
        
        expect(mockDelete).toHaveBeenCalled()
        expect(mockEq).toHaveBeenCalledWith('id', 'service-1')
      })
    })
  })

  describe('User Preferences Management', () => {
    const mockUserPreferences = {
      id: 'pref-1',
      user_id: 'user-1',
      session_preferences: { duration: 60, type: 'individual' },
      practitioner_preferences: { gender: 'female', experience: 5 },
      health_goals: ['stress relief', 'better sleep'],
      biases: [],
      preferred_time: 'morning',
      preferred_duration: '60',
      intensity_preference: 'moderate',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    describe('getUserPreferences', () => {
      it('should fetch user preferences successfully', async () => {
        const mockSingle = jest.fn().mockResolvedValue({ data: mockUserPreferences, error: null })
        const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: mockSelect,
          insert: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.getUserPreferences('user-1')
        
        expect(result).toEqual(mockUserPreferences)
        expect(supabase.from).toHaveBeenCalledWith('user_preferences')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1')
      })

      it('should return null when no preferences found', async () => {
        const mockError = { code: 'PGRST116' }
        const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError })
        const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: mockSelect,
          insert: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.getUserPreferences('user-1')
        
        expect(result).toBeNull()
      })
    })

    describe('createUserPreferences', () => {
      it('should create user preferences successfully', async () => {
        const newPreferences = {
          session_preferences: { duration: 45 },
          practitioner_preferences: { gender: 'male' }
        }

        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { ...mockUserPreferences, ...newPreferences }, 
          error: null 
        })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: mockInsert,
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.createUserPreferences('user-1', newPreferences)
        
        expect(result).toMatchObject(newPreferences)
        expect(mockInsert).toHaveBeenCalledWith([{ user_id: 'user-1', ...newPreferences }])
      })
    })

    describe('updateUserPreferences', () => {
      it('should update user preferences successfully', async () => {
        const updates = { preferred_time: 'evening', intensity_preference: 'high' }

        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { ...mockUserPreferences, ...updates }, 
          error: null 
        })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: jest.fn(),
          update: mockUpdate,
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.updateUserPreferences('user-1', updates)
        
        expect(result).toMatchObject(updates)
        expect(mockUpdate).toHaveBeenCalledWith(updates)
        expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1')
      })
    })
  })

  describe('Subscription Management', () => {
    const mockSubscription = {
      id: 'sub-1',
      user_id: 'user-1',
      type: 'vip' as const,
      status: 'active' as const,
      interval: 'monthly' as const,
      price: 99.99,
      currency: 'EUR',
      stripe_customer_id: 'cus_123',
      stripe_subscription_id: 'sub_123',
      stripe_price_id: 'price_123',
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-02-01T00:00:00Z',
      current_period_start: '2024-01-01T00:00:00Z',
      current_period_end: '2024-02-01T00:00:00Z',
      cancelled_at: null,
      trial_end_date: null,
      cancel_at_period_end: false,
      created_by: null,
      notes: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      tier_id: 'tier-1',
      payment_method: 'card',
      payment_status: 'paid',
      auto_renew: true,
      renewal_reminder_sent: false,
      metadata: {}
    }

    describe('getSubscriptionById', () => {
      it('should fetch subscription by ID successfully', async () => {
        const mockSingle = jest.fn().mockResolvedValue({ data: mockSubscription, error: null })
        const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: mockSelect,
          insert: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.getSubscriptionById('sub-1')
        
        expect(result).toEqual(mockSubscription)
        expect(supabase.from).toHaveBeenCalledWith('subscriptions')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(mockEq).toHaveBeenCalledWith('id', 'sub-1')
      })
    })

    describe('createSubscriptionWithValidation', () => {
      it('should create subscription with validation successfully', async () => {
        const newSubscription = {
          user_id: 'user-1',
          type: 'vip' as const,
          status: 'active' as const,
          interval: 'monthly' as const,
          price: 99.99,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-02-01T00:00:00Z'
        }

        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { ...mockSubscription, ...newSubscription }, 
          error: null 
        })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: mockInsert,
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.createSubscriptionWithValidation(newSubscription)
        
        expect(result).toMatchObject(newSubscription)
        expect(mockInsert).toHaveBeenCalledWith([newSubscription])
      })

      it('should validate user ID is required', async () => {
        const invalidSubscription = {
          type: 'vip' as const,
          status: 'active' as const,
          interval: 'monthly' as const,
          price: 99.99,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-02-01T00:00:00Z'
        }

        await expect(enhancedDataService.createSubscriptionWithValidation(invalidSubscription as any))
          .rejects.toThrow('User ID is required')
      })

      it('should validate subscription type', async () => {
        const invalidSubscription = {
          user_id: 'user-1',
          type: 'invalid' as any,
          status: 'active' as const,
          interval: 'monthly' as const,
          price: 99.99,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-02-01T00:00:00Z'
        }

        await expect(enhancedDataService.createSubscriptionWithValidation(invalidSubscription))
          .rejects.toThrow('Valid subscription type is required')
      })

      it('should validate subscription price cannot be negative', async () => {
        const invalidSubscription = {
          user_id: 'user-1',
          type: 'vip' as const,
          status: 'active' as const,
          interval: 'monthly' as const,
          price: -99.99,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-02-01T00:00:00Z'
        }

        await expect(enhancedDataService.createSubscriptionWithValidation(invalidSubscription))
          .rejects.toThrow('Subscription price cannot be negative')
      })
    })

    describe('cancelSubscription', () => {
      it('should cancel subscription successfully', async () => {
        const cancelledSubscription = { ...mockSubscription, status: 'cancelled' as const, cancelled_at: '2024-01-15T00:00:00Z' }
        const mockSingle = jest.fn().mockResolvedValue({ data: cancelledSubscription, error: null })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: jest.fn(),
          update: mockUpdate,
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.cancelSubscription('sub-1')
        
        expect(result.status).toBe('cancelled')
        expect(result.cancelled_at).toBeDefined()
        expect(mockUpdate).toHaveBeenCalled()
      })
    })
  })

  describe('Community Posts Management', () => {
    const mockCommunityPost = {
      id: 'post-1',
      user_id: 'user-1',
      title: 'Test Post',
      content: 'This is a test post content',
      category: 'General',
      tags: ['test', 'community'],
      is_published: true,
      published_at: '2024-01-01T00:00:00Z',
      likes_count: 5,
      comments_count: 2,
      views_count: 100,
      is_featured: false,
      is_anonymous: false,
      metadata: {},
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    describe('createCommunityPostWithValidation', () => {
      it('should create community post with validation successfully', async () => {
        const newPost = {
          user_id: 'user-1',
          title: 'New Post',
          content: 'New post content',
          category: 'General'
        }

        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { ...mockCommunityPost, ...newPost }, 
          error: null 
        })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: mockInsert,
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.createCommunityPostWithValidation(newPost)
        
        expect(result).toMatchObject(newPost)
        expect(result.likes_count).toBe(0)
        expect(result.comments_count).toBe(0)
        expect(result.views_count).toBe(0)
        expect(mockInsert).toHaveBeenCalled()
      })

      it('should validate post title is required', async () => {
        const invalidPost = {
          user_id: 'user-1',
          content: 'Post content',
          category: 'General'
        }

        await expect(enhancedDataService.createCommunityPostWithValidation(invalidPost as any))
          .rejects.toThrow('Post title is required')
      })

      it('should validate post content is required', async () => {
        const invalidPost = {
          user_id: 'user-1',
          title: 'Post Title',
          category: 'General'
        }

        await expect(enhancedDataService.createCommunityPostWithValidation(invalidPost as any))
          .rejects.toThrow('Post content is required')
      })

      it('should validate user ID is required', async () => {
        const invalidPost = {
          title: 'Post Title',
          content: 'Post content',
          category: 'General'
        }

        await expect(enhancedDataService.createCommunityPostWithValidation(invalidPost as any))
          .rejects.toThrow('User ID is required')
      })
    })

    describe('incrementPostViews', () => {
      it('should increment post views successfully', async () => {
        const mockSingleSelect = jest.fn().mockResolvedValue({ data: { views_count: 5 }, error: null })
        const mockEqSelect = jest.fn().mockReturnValue({ single: mockSingleSelect })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEqSelect })

        const mockEqUpdate = jest.fn().mockReturnValue({ error: null })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqUpdate })

        (supabase.from as jest.Mock).mockImplementation((table: string) => {
          if (table === 'community_posts') {
            return {
              select: mockSelect,
              insert: jest.fn(),
              update: mockUpdate,
              delete: jest.fn(),
            } as any
          }
          return {} as any
        })

        await enhancedDataService.incrementPostViews('post-1')

        expect(supabase.from).toHaveBeenCalledWith('community_posts')
        expect(mockSelect).toHaveBeenCalledWith('views_count')
        expect(mockEqSelect).toHaveBeenCalledWith('id', 'post-1')
        expect(mockSingleSelect).toHaveBeenCalled()
        expect(mockUpdate).toHaveBeenCalledWith({ views_count: 6 })
        expect(mockEqUpdate).toHaveBeenCalledWith('id', 'post-1')
      })
    })

    describe('incrementPostLikes', () => {
      it('should increment post likes successfully', async () => {
        const mockSingleSelect = jest.fn().mockResolvedValue({ data: { likes_count: 2 }, error: null })
        const mockEqSelect = jest.fn().mockReturnValue({ single: mockSingleSelect })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEqSelect })

        const mockEqUpdate = jest.fn().mockReturnValue({ error: null })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqUpdate })

        (supabase.from as jest.Mock).mockImplementation((table: string) => {
          if (table === 'community_posts') {
            return {
              select: mockSelect,
              insert: jest.fn(),
              update: mockUpdate,
              delete: jest.fn(),
            } as any
          }
          return {} as any
        })

        await enhancedDataService.incrementPostLikes('post-1')

        expect(supabase.from).toHaveBeenCalledWith('community_posts')
        expect(mockSelect).toHaveBeenCalledWith('likes_count')
        expect(mockEqSelect).toHaveBeenCalledWith('id', 'post-1')
        expect(mockSingleSelect).toHaveBeenCalled()
        expect(mockUpdate).toHaveBeenCalledWith({ likes_count: 3 })
        expect(mockEqUpdate).toHaveBeenCalledWith('id', 'post-1')
      })
    })

    describe('decrementPostLikes', () => {
      it('should decrement post likes successfully', async () => {
        const mockSingleSelect = jest.fn().mockResolvedValue({ data: { likes_count: 1 }, error: null })
        const mockEqSelect = jest.fn().mockReturnValue({ single: mockSingleSelect })
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEqSelect })

        const mockEqUpdate = jest.fn().mockReturnValue({ error: null })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqUpdate })

        (supabase.from as jest.Mock).mockImplementation((table: string) => {
          if (table === 'community_posts') {
            return {
              select: mockSelect,
              insert: jest.fn(),
              update: mockUpdate,
              delete: jest.fn(),
            } as any
          }
          return {} as any
        })

        await enhancedDataService.decrementPostLikes('post-1')

        expect(supabase.from).toHaveBeenCalledWith('community_posts')
        expect(mockSelect).toHaveBeenCalledWith('likes_count')
        expect(mockEqSelect).toHaveBeenCalledWith('id', 'post-1')
        expect(mockSingleSelect).toHaveBeenCalled()
        expect(mockUpdate).toHaveBeenCalledWith({ likes_count: 0 })
        expect(mockEqUpdate).toHaveBeenCalledWith('id', 'post-1')
      })
    })
  })

  describe('Transaction Support', () => {
    describe('executeTransaction', () => {
      it('should execute transaction successfully', async () => {
        const mockOperation = jest.fn().mockResolvedValue('success')
        
        const result = await enhancedDataService.executeTransaction(mockOperation)
        
        expect(result).toBe('success')
        expect(mockOperation).toHaveBeenCalled()
      })

      it('should handle transaction failure', async () => {
        const mockError = new Error('Transaction failed')
        const mockOperation = jest.fn().mockRejectedValue(mockError)
        
        await expect(enhancedDataService.executeTransaction(mockOperation))
          .rejects.toThrow('Transaction failed')
      })
    })

    describe('batchUpdateServices', () => {
      it('should batch update services successfully', async () => {
        const updates = [
          { id: 'service-1', data: { price: 150 } },
          { id: 'service-2', data: { price: 200 } }
        ]

        const mockSingle = jest.fn().mockResolvedValue({ data: mockService, error: null })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: jest.fn(),
          update: mockUpdate,
          delete: jest.fn()
        } as any)

        await enhancedDataService.batchUpdateServices(updates)
        
        expect(mockUpdate).toHaveBeenCalledTimes(2)
        expect(mockEq).toHaveBeenCalledTimes(2)
      })
    })

    describe('batchCreateCommunityPosts', () => {
      it('should batch create community posts successfully', async () => {
        const posts = [
          {
            user_id: 'user-1',
            title: 'Post 1',
            content: 'Content 1',
            category: 'General'
          },
          {
            user_id: 'user-2',
            title: 'Post 2',
            content: 'Content 2',
            category: 'Discussion'
          }
        ]

        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { id: 'post-1', ...posts[0], likes_count: 0, comments_count: 0, views_count: 0 }, 
          error: null 
        })
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
        
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn(),
          insert: mockInsert,
          update: jest.fn(),
          delete: jest.fn()
        } as any)

        const result = await enhancedDataService.batchCreateCommunityPosts(posts)
        
        expect(result).toHaveLength(2)
        expect(mockInsert).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      const connectionError = new Error('Database connection failed')
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: connectionError })
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      } as any)

      await expect(enhancedDataService.getServiceById('service-1'))
        .rejects.toThrow('Database connection failed')
    })

    it('should handle validation errors with detailed messages', async () => {
      const invalidService = {
        name: '',
        price: -100
      }

      await expect(enhancedDataService.createServiceWithValidation(invalidService as any))
        .rejects.toThrow('Service name is required')
    })
  })

  describe('Performance Tests', () => {
    it('should handle large batch operations efficiently', async () => {
      const largeBatch = Array.from({ length: 100 }, (_, i) => ({
        id: `service-${i}`,
        data: { price: 100 + i }
      }))

      const mockSingle = jest.fn().mockResolvedValue({ data: mockService, error: null })
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
      const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(),
        insert: jest.fn(),
        update: mockUpdate,
        delete: jest.fn()
      } as any)

      const startTime = Date.now()
      await enhancedDataService.batchUpdateServices(largeBatch)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(5000) // Should complete within 5 seconds
      expect(mockUpdate).toHaveBeenCalledTimes(100)
    })
  })
})