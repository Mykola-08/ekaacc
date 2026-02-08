import { createClient } from '@/lib/supabase/server';
import { getZoomClientId, getZoomClientSecret, getZoomAccountId } from '@/lib/config';

interface ZoomMeeting {
  id: string;
  join_url: string;
  start_url: string;
  password?: string;
}

export class ZoomService {
  private static async getAccessToken(): Promise<string> {
    const clientId = await getZoomClientId();
    const clientSecret = await getZoomClientSecret();
    const accountId = await getZoomAccountId();

    if (!clientId || !clientSecret || !accountId) {
      console.warn('Missing Zoom credentials. Returning mock token.');
      return 'mock_token';
    }

    const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Zoom OAuth failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  static async createMeeting(
    topic: string,
    startTime: string,
    durationMinutes: number = 60
  ): Promise<ZoomMeeting | null> {
    const clientId = await getZoomClientId();
    if (!clientId) {
      console.log('Zoom credentials missing. Generating mock meeting link.');
      return {
        id: `mock-${Date.now()}`,
        join_url: `https://zoom.us/j/mock-${Date.now()}?pwd=mock`,
        start_url: `https://zoom.us/s/mock-${Date.now()}?pwd=mock`,
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          type: 2, // Scheduled meeting
          start_time: startTime,
          duration: durationMinutes,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            auto_recording: 'cloud',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Zoom API Error:', error);
        throw new Error('Failed to create Zoom meeting');
      }

      const meeting = await response.json();
      return {
        id: meeting.id,
        join_url: meeting.join_url,
        start_url: meeting.start_url,
        password: meeting.password,
      };
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      return null;
    }
  }
}
