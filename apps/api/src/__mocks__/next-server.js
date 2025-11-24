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
  constructor(url) {
    this.url = url;
    const parsed = new URL(url);
    this.nextUrl = {
      pathname: parsed.pathname,
      searchParams: parsed.searchParams,
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
