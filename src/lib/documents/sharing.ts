
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use Supabase-generated types to avoid circular references
type DocumentRow = Database['public']['Tables']['documents']['Row'];

// Extended document type with sharing metadata
export type SharedDocument = DocumentRow & {
  shared_by?: string;
  shared_with?: string;
};

export async function shareDocument(documentId: string, sharedWithName: string) {
  // Get the user ID from the full name
  const { data, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('full_name', sharedWithName)
    .maybeSingle();
    
  if (userError) throw userError;
  if (!data) throw new Error('User not found with that name. Please use the exact full name from their profile.');
  
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
    } as SharedDocument;
  });
}
