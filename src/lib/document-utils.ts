
import { supabase } from '@/integrations/supabase/client';

export async function uploadDocument(file: File, userId: string) {
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase.from('documents').insert({
    title: file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    user_id: userId
  });

  if (dbError) throw dbError;

  return filePath;
}

export async function shareDocument(documentId: string, sharedWithEmail: string) {
  const { data: userToShare, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', sharedWithEmail)
    .single();

  if (userError) throw userError;

  const { error: shareError } = await supabase
    .from('document_shares')
    .insert({
      document_id: documentId,
      shared_by: (await supabase.auth.getUser()).data.user?.id,
      shared_with: userToShare.id
    });

  if (shareError) throw shareError;
}

export async function updateDocumentProgress(documentId: string, progress: number, lastPage?: number) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('document_progress')
    .upsert({
      document_id: documentId,
      user_id: user.id,
      progress_percentage: progress,
      last_page_viewed: lastPage || 1,
      last_viewed_at: new Date().toISOString()
    });

  if (error) throw error;
}
