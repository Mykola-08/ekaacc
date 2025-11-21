import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/login-form'
import { SignupFormEnhanced } from '@/components/signup-form-enhanced'

jest.setTimeout(15000)

// Simple Next.js mocks
const mockPush = jest.fn()
const mockGet = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}))

// Auth hook mocks (overridden per-test)
const mockSignIn = jest.fn()
const mockSignUp = jest.fn()
const mockSignInWithOAuth = jest.fn()
jest.mock('@/hooks/use-simple-auth', () => ({
  useSimpleAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: jest.fn(),
    signInWithOAuth: mockSignInWithOAuth,
    isLoading: false,
    isAuthenticated: false,
    user: null,
  }),
}))

// Next/Image mock for RTL compatibility
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt || 'image'} />
})

describe('Auth forms', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockReturnValue(null)
  })

  describe('LoginForm', () => {
    it('submits credentials and redirects on success', async () => {
      mockSignIn.mockResolvedValueOnce({ error: null })

      render(<LoginForm />)

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } })
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
      await userEvent.click(screen.getByRole('button', { name: /login/i }))

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('shows an error message when sign in fails', async () => {
      mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid login credentials' } })

      render(<LoginForm />)

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@example.com' } })
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } })
      await userEvent.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument()
      })
    })
  })

  describe('SignupFormEnhanced', () => {
    it('submits signup data and redirects to onboarding', async () => {
      mockSignUp.mockResolvedValueOnce({ error: null })

      render(<SignupFormEnhanced />)

      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'jane@example.com' } })
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass!2' } })
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass!2' } })
      await userEvent.click(screen.getByRole('button', { name: /create account/i }))

      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'jane@example.com',
          password: 'StrongPass!2',
          fullName: 'Jane Doe',
        })
      )
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/onboarding')
      })
    })
  })
})
