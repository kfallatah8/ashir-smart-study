
import { supabase } from '@/integrations/supabase/client';

// Simple type definitions to avoid circular references
export type SharedDocument = {
  id: string;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_text: string | null;
  document_vector: any;
  created_at: string;
  updated_at: string;
  user_id: string;
  shared_by?: string;
  shared_with?: string;
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

export async function getSharedDocuments(): Promise<SharedDocument[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  // Get document shares for the current user
  const { data: shareData, error: shareError } = await supabase
    .from('document_shares')
    .select(`
      document_id,
      shared_by,
      shared_with
    `)
    .eq('shared_with', userData.user.id);

  if (shareError) throw shareError;
  
  if (!shareData || shareData.length === 0) {
    return [];
  }
  
  // Get the actual documents
  const documentIds = shareData.map(share => share.document_id);
  
  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .in('id', documentIds);
    
  if (docsError) throw docsError;
  
  // Combine document data with sharing info
  return (documents || []).map(doc => {
    const shareInfo = shareData.find(share => share.document_id === doc.id);
    return {
      ...doc,
      shared_by: shareInfo?.shared_by,
      shared_with: shareInfo?.shared_with
    };
  });
}
