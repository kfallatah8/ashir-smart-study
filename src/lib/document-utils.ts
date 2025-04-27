import { supabase } from '@/integrations/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface ProfileData {
  id: string;
}

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
  // First, get the user ID from the email - fixed type instantiation issue
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', sharedWithEmail)
    .single();
    
  if (userError) throw userError;
  
  if (!userData) throw new Error('User not found');
  
  // Then create the share record
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('User not authenticated');

  const { error: shareError } = await supabase
    .from('document_shares')
    .insert({
      document_id: documentId,
      shared_by: authData.user.id,
      shared_with: userData.id
    });

  if (shareError) throw shareError;
}

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

export async function searchDocuments(query: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  // Search in documents owned by the user or shared with the user
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .textSearch('document_vector', query)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSharedDocuments() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_shares!inner (
        shared_by,
        shared_with
      )
    `)
    .eq('document_shares.shared_with', userData.user.id);

  if (error) throw error;
  return data;
}

export async function getDocumentProgress(documentId: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('document_progress')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', userData.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is the error code for "no rows returned"
    throw error;
  }

  return data;
}
