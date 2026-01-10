const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
import { getAccessToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/make-server-1ccf6811` 
  : `https://${projectId}.supabase.co/functions/v1/make-server-1ccf6811`;

async function fetchAPI<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Get access token if user is authenticated
    const accessToken = getAccessToken();
    const authHeader = accessToken ? `Bearer ${accessToken}` : `Bearer ${publicAnonKey}`;
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' })) as any;
      console.error('API Error:', error);
      throw new Error(error.error || 'Request failed');
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Fetch API Error:', endpoint, error);
    throw error;
  }
}

export const api = {
  // Appointments
  getAppointments: (userId: string) => fetchAPI(`/appointments/${userId}`),
  getUpcomingAppointment: (userId: string) => fetchAPI(`/appointments/${userId}/upcoming`),
  getPastAppointments: (userId: string) => fetchAPI(`/appointments/${userId}/past`),
  createAppointment: (data: any) => fetchAPI('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAppointment: (userId: string, appointmentId: string, data: any) => 
    fetchAPI(`/appointments/${userId}/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteAppointment: (userId: string, appointmentId: string) => 
    fetchAPI(`/appointments/${userId}/${appointmentId}`, {
      method: 'DELETE',
    }),

  // Goals
  getGoals: (userId: string) => fetchAPI(`/goals/${userId}`),
  createGoal: (data: any) => fetchAPI('/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateGoal: (userId: string, goalId: string, data: any) => 
    fetchAPI(`/goals/${userId}/${goalId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Feedback
  submitFeedback: (data: any) => fetchAPI('/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Stats
  getStats: (userId: string) => fetchAPI(`/stats/${userId}`),

  // Recommendations
  getRecommendations: (userId: string) => fetchAPI(`/recommendations/${userId}`),
  refreshRecommendations: (userId: string) => fetchAPI(`/recommendations/${userId}/refresh`, {
    method: 'POST',
  }),

  // Profile
  getProfile: (userId: string) => fetchAPI(`/profile/${userId}`),
  updateProfile: (userId: string, data: any) => fetchAPI(`/profile/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Preferences
  getPreferences: (userId: string) => fetchAPI(`/preferences/${userId}`),
  updatePreferences: (userId: string, data: any) => fetchAPI(`/preferences/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Notifications
  getNotifications: (userId: string) => fetchAPI(`/notifications/${userId}`),
  updateNotifications: (userId: string, data: any) => fetchAPI(`/notifications/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  sendNotification: (data: any) => fetchAPI('/notifications/send', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Guest booking link
  linkGuestBookings: (data: any) => fetchAPI('/link-guest-bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  // Profile Image Upload
  uploadProfileImage: async (userId: string, formData: FormData) => {
    // Note: This needs a separate handling as it sends FormData, not JSON.
    // Assuming backend logic. For now, creating a placeholder or adapting fetchAPI isn't straightforward
    // without `Content-Type: undefined` (to let browser set boundary).
    
    // Quick fix: mocking or implementing basic fetch wrapper logic for files if needed.
    // For now, let's assume we can use fetch directly or adjust fetchAPI slightly?
    // Let's create a custom call here for simplicity.
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/make-server-1ccf6811` 
      : `https://${projectId}.supabase.co/functions/v1/make-server-1ccf6811`;
      
    const accessToken = getAccessToken();
    const authHeader = accessToken ? `Bearer ${accessToken}` : `Bearer ${publicAnonKey}`;

    const response = await fetch(`${API_BASE}/profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // 'Content-Type': 'multipart/form-data' // Do NOT set this manually for FormData
      },
      body: formData
    });
    
    if (!response.ok) {
         const error = await response.json().catch(() => ({ error: 'Upload failed' }));
         throw new Error(error.error || 'Upload failed');
    }
    return response.json();
  }
};