import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from '@/app/(main)/page'
import * as serviceLayer from '@/server/booking/service'

// Mock the service layer
vi.mock('@/server/booking/service', () => ({
  listServices: vi.fn()
}))

// Mock BookingModal component since it might have complex logic
vi.mock('@/components/BookingModal', () => ({
  BookingModal: () => <button>Book Now</button>
}))

describe('Home Page', () => {
  it('renders available services', async () => {
    vi.mocked(serviceLayer.listServices).mockResolvedValue({
      data: [
        { id: '1', name: 'Test Service', description: 'Test Description', price: 100, duration: 60, active: true }
      ],
      error: null
    } as any)

    const page = await Home()
    render(page)
    
    expect(screen.getByText('EKA Booking')).toBeInTheDocument()
    expect(screen.getByText('Available Services')).toBeInTheDocument()
    expect(screen.getByText('Test Service')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
