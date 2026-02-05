import { getConfig } from '@/lib/config';

interface CreateMeetParams {
  summary: string;
  description?: string;
  startTime: string; // ISO string 2024-02-03T10:00:00Z
  endTime: string;   // ISO string
  attendees?: string[]; // email addresses
}

interface MeetResult {
  meetLink: string;
  eventId: string;
}

export class GoogleMeetService {
  private async getAccessToken(): Promise<string> {
    // In a real app, this would fetch from DB for the specific therapist
    // For now, we assume a system-wide or env-var configured token for the "main" calendar
    const token = (await getConfig('GOOGLE_ACCESS_TOKEN')) || process.env.GOOGLE_ACCESS_TOKEN;
    if (!token) {
      throw new Error('Google Access Token not configured');
    }
    return token;
  }

  async createMeeting(params: CreateMeetParams): Promise<MeetResult> {
    const accessToken = await getAccessToken();

    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: params.endTime,
        timeZone: 'UTC',
      },
      attendees: params.attendees?.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('Google Meet Creation Error:', error);
        throw new Error(`Failed to create Google Meet: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract meet link
    const meetLink = data.htmlLink || data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;

    return {
      meetLink: meetLink || '',
      eventId: data.id,
    };
  }
}

// Singleton for easy import
export const googleMeetService = new GoogleMeetService();

async function getAccessToken() {
    // Placeholder for actual OAuth refresh logic
    // This implies we have a valid access token. 
    // Implementing full OAuth flow is outside scope of a single file drop, 
    // but this structure allows "plugging in" the token retrieval.
    const token = process.env.GOOGLE_ACCESS_TOKEN;
    if (!token) throw new Error("Missing GOOGLE_ACCESS_TOKEN");
    return token;
}
