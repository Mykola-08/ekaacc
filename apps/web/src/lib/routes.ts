export const ROUTES = {
  dashboard: '/dashboard',
  home: '/home',
  therapistDashboard: '/therapist/dashboard',
  sessions: '/sessions',
  journal: '/journal',
  settings: '/settings',
  login: '/login',
  signupParam: '/login?tab=signup',
  aiInsights: '/ai-insights',
  privacy: 'http://localhost:9006/privacy',
  terms: 'http://localhost:9006/terms',
  cookies: 'http://localhost:9006/cookies',
  privacyControls: '/privacy-controls',
  subscriptions: '/subscriptions',
} as const;

export type RouteKey = keyof typeof ROUTES;
export function route(key: RouteKey): string {
  return ROUTES[key];
}
