export const ROUTES = {
  dashboard: '/dashboard',
  home: '/home',
  therapistDashboard: '/therapist/dashboard',
  sessions: '/sessions',
  wellness: '/wellness',
  settings: '/settings',
  login: '/login',
  signupParam: '/login?tab=signup',
  aiInsights: '/ai-insights',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  privacyControls: '/privacy-controls',
  finances: '/finances',
} as const;

export type RouteKey = keyof typeof ROUTES;
export function route(key: RouteKey): string {
  return ROUTES[key];
}
