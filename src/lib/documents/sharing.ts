
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
  document_vector: any | null; // Using 'any' to avoid complex types
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

  // Use a simpler query approach to avoid complex joins
  const { data, error } = await supabase
    .rpc('get_shared_documents_for_user', { user_id: userData.user.id });

  if (error) {
    // Fallback to simpler query if RPC function doesn't exist
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('documents')
      .select(`
        *,
        document_shares!inner (
          shared_by,
          shared_with
        )
      `)
      .eq('document_shares.shared_with', userData.user.id);

    if (fallbackError) throw fallbackError;
    
    // Transform the data to match our simplified type
    return (fallbackData || []).map(doc => ({
      ...doc,
      shared_by: doc.document_shares?.[0]?.shared_by || null,
      shared_with: doc.document_shares?.[0]?.shared_with || null
    })) as SharedDocument[];
  }

  return data as SharedDocument[];
}
