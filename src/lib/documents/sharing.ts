
import { supabase } from '@/integrations/supabase/client';

// Define specific types to avoid excessive type instantiation
type DocumentShare = {
  shared_by: string;
  shared_with: string;
};

type SharedDocument = {
  id: string;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_text: string | null;
  document_vector: unknown | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  document_shares: DocumentShare[];
};

export async function shareDocument(documentId: string, sharedWithEmail: string) {
  // Get the user ID from the email
  const { data, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', sharedWithEmail)
    .maybeSingle();
    
  if (userError) throw userError;
  if (!data) throw new Error('User not found');
  
  // Create the share record
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('User not authenticated');

  const { error: shareError } = await supabase
    .from('document_shares')
    .insert({
      document_id: documentId,
      shared_by: authData.user.id,
      shared_with: data.id
    });

  if (shareError) throw shareError;
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
  return (data || []) as SharedDocument[];
}
