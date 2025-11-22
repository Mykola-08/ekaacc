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
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  privacyControls: '/privacy-controls',
  subscriptions: '/subscriptions',
} as const;

export type RouteKey = keyof typeof ROUTES;
export function route(key: RouteKey): string {
  return ROUTES[key];
}
