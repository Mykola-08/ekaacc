import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

describe('Marketing Page', () => {
  it('renders the main heading', () => {
    render(<Page />)
    expect(screen.getByText(/Your Complete Wellness/i)).toBeDefined()
  })
})
