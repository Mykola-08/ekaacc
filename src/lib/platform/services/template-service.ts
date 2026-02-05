// Production-grade templates service with Supabase integration
import { supabase } from '@/lib/platform/supabase'
import { safeSupabaseInsert, safeSupabaseQuery } from '@/lib/platform/supabase/utils'

export const templateService = {
  async listTemplates() {
    try {
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('templates')
          .select('*')
          .order('created_at', { ascending: false })
      );
      
      if (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in listTemplates:', error);
      throw error;
    }
  },
  async createTemplate({ title, content, authorId }: { title: string; content: string; authorId?: string }) {
    try {
      const { data, error } = await safeSupabaseInsert<any>(
        'templates',
        {
          title,
          content,
          author_id: authorId,
          created_at: new Date().toISOString()
        }
      );
      
      if (error) {
        console.error('Error creating template:', error);
        throw new Error('Failed to create template');
      }
      
      return data;
    } catch (error) {
      console.error('Error in createTemplate:', error);
      throw error;
    }
  },
  async deleteTemplate(id: string) {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting template:', error);
        throw new Error('Failed to delete template');
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      throw error;
    }
  }
};

export default templateService;
