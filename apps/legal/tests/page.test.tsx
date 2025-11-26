import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '@/app/page'

describe('Legal Center Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1, name: /Legal Center/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders links to legal documents', () => {
    render(<Home />)
    
    const termsLink = screen.getByRole('heading', { level: 3, name: /Terms of Service/i })
    expect(termsLink).toBeInTheDocument()

    const privacyLink = screen.getByRole('heading', { level: 3, name: /^Privacy Policy$/i })
    expect(privacyLink).toBeInTheDocument()

    const cookieLink = screen.getByRole('heading', { level: 3, name: /Cookie Policy/i })
    expect(cookieLink).toBeInTheDocument()
  })
})
