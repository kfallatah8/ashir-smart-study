
import { supabase } from '@/integrations/supabase/client';

export async function updateDocumentProgress(documentId: string, progress: number, lastPage?: number) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('document_progress')
    .upsert({
      document_id: documentId,
      user_id: userData.user.id,
      progress_percentage: progress,
      last_page_viewed: lastPage || 1,
      last_viewed_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function getDocumentProgress(documentId: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('document_progress')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
    throw error;
  }

  return data;
}
