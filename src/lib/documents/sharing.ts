
import { supabase } from '@/integrations/supabase/client';

// Define primitive types without circular references
export type DocumentShare = {
  shared_by: string;
  shared_with: string;
};

// Use a completely flat structure with no nested types
export type SharedDocument = {
  id: string;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_text: string | null;
  document_vector: unknown | null; // Using unknown instead of any for better type safety
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

// Simple function signature with explicit return type
export async function getSharedDocuments(): Promise<SharedDocument[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  // Try a direct query approach first to avoid complex joins and type issues
  const { data: directData, error: directError } = await supabase
    .from('document_shares')
    .select(`
      document_id,
      shared_by,
      shared_with
    `)
    .eq('shared_with', userData.user.id);

  if (directError) throw directError;
  
  // If we have no shared documents, return empty array
  if (!directData || directData.length === 0) {
    return [];
  }
  
  // Get the actual documents using the document IDs
  const documentIds = directData.map(share => share.document_id);
  
  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .in('id', documentIds);
    
  if (docsError) throw docsError;
  
  // Combine the document data with sharing information
  return (documents || []).map(doc => {
    const shareInfo = directData.find(share => share.document_id === doc.id);
    return {
      ...doc,
      shared_by: shareInfo?.shared_by || null,
      shared_with: shareInfo?.shared_with || null
    } as SharedDocument;
  });
}
