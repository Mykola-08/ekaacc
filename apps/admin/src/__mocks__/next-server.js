const next = jest.fn(() => ({
  headers: new Headers(),
  cookies: { set: jest.fn() },
}));

const redirect = jest.fn((url) => ({
  status: 307,
  headers: new Headers({ Location: url.toString() }),
  cookies: { set: jest.fn() },
}));

class NextRequest {
  constructor(url, init = {}) {
    this.url = url;
    const parsed = new URL(url);
    this.nextUrl = {
      pathname: parsed.pathname,
      searchParams: parsed.searchParams,
      search: parsed.search,
      toString: () => url.toString(),
    };
    this.headers = new Headers(init.headers || {});
    this.cookies = {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };
  }
}

module.exports = {
  NextResponse: {
    next,
    redirect,
  },
  NextRequest,
};
