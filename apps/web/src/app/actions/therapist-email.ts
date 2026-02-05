'use server';

import { createClient } from '@/lib/platform/supabase/server';
import { TransactionalEmailService, TransactionalEmailType } from '@/lib/platform/services/transactional-email-service';
import { revalidatePath } from 'next/cache';

export async function sendTherapistEmail(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await (supabase.auth as any).getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // TODO: Verify user is a therapist
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  // if (profile?.role !== 'therapist') { return { success: false, error: 'Forbidden' }; }

  const patientId = formData.get('patientId') as string;
  const type = formData.get('type') as TransactionalEmailType;
  const subject = formData.get('subject') as string;
  
  // Parse dynamic data based on type
  const dataStr = formData.get('data') as string;
  let emailData = {};
  try {
      emailData = JSON.parse(dataStr);
  } catch (e) {
      return { success: false, error: 'Invalid data format' };
  }

  if (!patientId || !type || !subject) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const result = await TransactionalEmailService.send({
      userId: patientId,
      type,
      subject,
      data: {
        ...emailData,
        therapistName: user.user_metadata?.full_name || 'Your Therapist', // Fallback or override
      },
      force: true, // Therapist emails are likely important
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath('/therapist/patients'); // Revalidate relevant path
    return { success: true };
  } catch (error) {
    console.error('Error sending therapist email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function previewTherapistEmail(type: TransactionalEmailType, data: any) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();
    
    if (!user) return { html: '' };

    const userName = 'Patient Name'; // Placeholder for preview
    const therapistName = user.user_metadata?.full_name || 'Dr. Therapist';

    try {
        const html = await TransactionalEmailService.renderOnly({
            type,
            data: { ...data, therapistName },
            userName
        });
        return { success: true, html };
    } catch (error) {
        console.error('Preview error:', error);
        return { success: false, error: 'Failed to generate preview' };
    }
}
