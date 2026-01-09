import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIPersonalizationService } from '@ekaacc/ai-services';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { onboardingData } = body;

    const aiService = new AIPersonalizationService();
    const profile = await aiService.generateInitialProfile(user.id, onboardingData);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error generating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
