import '@testing-library/jest-dom'
// import 'whatwg-fetch' // Remove whatwg-fetch

// Polyfill Request and Response for Next.js server components using Node.js natives
if (typeof global.Request === 'undefined' && typeof globalThis.Request !== 'undefined') {
  global.Request = globalThis.Request
}
if (typeof global.Response === 'undefined' && typeof globalThis.Response !== 'undefined') {
  global.Response = globalThis.Response
}
if (typeof global.Headers === 'undefined' && typeof globalThis.Headers !== 'undefined') {
  global.Headers = globalThis.Headers
}
if (typeof global.fetch === 'undefined' && typeof globalThis.fetch !== 'undefined') {
  global.fetch = globalThis.fetch
}

// Set test environment variables
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_testing'
process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true'
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock-supabase-publishable-key'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-supabase-anon-key'
process.env.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://mock-redis.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-redis-token'

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Polyfill TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill TransformStream for AI SDK
if (typeof TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {
    constructor() {
      this.readable = {};
      this.writable = {};
    }
  };
}

// Minimal fetch polyfill for libraries (e.g., Stripe) expecting global fetch in Jest/jsdom.
// Provides a jest mock so tests can override implementation per suite when needed.
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
  }));
}