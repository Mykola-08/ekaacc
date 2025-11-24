import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from '@/app/page'

describe('Marketing Page', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', { level: 1, name: /Your Complete Wellness/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the hero description', () => {
    render(<HomePage />)
    expect(screen.getByText(/EKA Account is your centralized wellness platform/i)).toBeInTheDocument()
  })

  it('renders the CTA buttons', () => {
    render(<HomePage />)
    const signInButtons = screen.getAllByRole('link', { name: /Sign In/i })
    expect(signInButtons.length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Create Account/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 2, name: /Everything You Need for Wellness/i })).toBeInTheDocument()
    
    // Use getAllByText because the text might appear in the description as well
    const aiInsights = screen.getAllByText(/AI-Powered Insights/i)
    expect(aiInsights.length).toBeGreaterThan(0)
    
    expect(screen.getByText(/Therapist Connect/i)).toBeInTheDocument()
  })
})
