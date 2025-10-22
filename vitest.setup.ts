// Minimal test setup: polyfills and global mocks used across tests
// Provide a ResizeObserver shim for libraries like Recharts that rely on it.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

// Simple matchMedia polyfill for tests
// Source: small shim for test environments
// @ts-ignore
if (typeof window !== 'undefined' && !window.matchMedia) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
