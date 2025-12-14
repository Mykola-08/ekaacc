import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from '@/app/page'

// Mock the supabase client
vi.mock('@/lib/supabaseClient', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', name: 'Test Service', description: 'Test Description', price: 100, duration: 60, is_active: true }
          ],
          error: null
        }))
      }))
    }))
  }))
}))

// Mock BookingModal component since it might have complex logic
vi.mock('@/components/BookingModal', () => ({
  BookingModal: () => <button>Book Now</button>
}))

describe('Home Page', () => {
  it('renders available services', async () => {
    const page = await Home()
    render(page)
    
    expect(screen.getByText('Eka Booking')).toBeInTheDocument()
    expect(screen.getByText('Available Services')).toBeInTheDocument()
    expect(screen.getByText('Test Service')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
