
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

// Get all user documents
export async function getUserDocuments() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get document by ID
export async function getDocumentById(documentId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) throw error;
  return data;
}

export async function searchDocuments(query: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .textSearch('document_vector', query)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
