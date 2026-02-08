// Production-grade assessments service with Supabase integration
import { supabase } from '@/lib/platform/supabase';
import { safeSupabaseInsert, safeSupabaseQuery } from '@/lib/platform/supabase/utils';

export const assessmentService = {
  async saveAssessment(sessionId: string, data: any) {
    try {
      const { data: assessment, error } = await safeSupabaseInsert<any>('assessments', {
        session_id: sessionId,
        data,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error saving assessment:', error);
        throw new Error('Failed to save assessment');
      }

      return assessment;
    } catch (error) {
      console.error('Error in saveAssessment:', error);
      throw error;
    }
  },
  async getAssessmentsForSession(sessionId: string) {
    try {
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('assessments')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
      );

      if (error) {
        console.error('Error fetching assessments for session:', error);
        throw new Error('Failed to fetch assessments for session');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsForSession:', error);
      throw error;
    }
  },
  async deleteAssessment(assessmentId: string) {
    try {
      const { error } = await supabase.from('assessments').delete().eq('id', assessmentId);

      if (error) {
        console.error('Error deleting assessment:', error);
        throw new Error('Failed to delete assessment');
      }

      return { id: assessmentId };
    } catch (error) {
      console.error('Error in deleteAssessment:', error);
      throw error;
    }
  },
};

export default assessmentService;
