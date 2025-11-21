import '@testing-library/jest-dom'

// Mock window.matchMedia
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