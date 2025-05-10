
import { supabase } from '@/integrations/supabase/client';

// Define explicit types for AI tool results to avoid recursive type issues
export type MindMapNode = {
  id: string;
  label: string;
  type?: string;
};

export type MindMapEdge = {
  from: string;
  to: string;
  label?: string;
};

export type MindMapResult = {
  type: 'mindmap';
  nodes: MindMapNode[];
  edges: MindMapEdge[];
};

export type FlashcardItem = {
  id: string;
  question: string;
  answer: string;
};

export type FlashcardsResult = {
  type: 'flashcards';
  cards: FlashcardItem[];
};

// Define base AIToolTask type with non-recursive result type
export type AIToolTask = {
  id: string;
  document_id: string | null;
  tool_type: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  result: Record<string, any> | null;
};

// Type guards for runtime type checking
export function isMindMapResult(result: any): result is MindMapResult {
  return result && 
    result.type === 'mindmap' && 
    Array.isArray(result.nodes) && 
    Array.isArray(result.edges);
}

export function isFlashcardsResult(result: any): result is FlashcardsResult {
  return result && 
    result.type === 'flashcards' && 
    Array.isArray(result.cards);
}

export async function createAIToolTask(documentId: string, toolType: string): Promise<AIToolTask> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('ai_tool_tasks')
    .insert({
      document_id: documentId,
      tool_type: toolType,
      user_id: userData.user.id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data as AIToolTask;
}

export async function getAIToolTasks(documentId?: string): Promise<AIToolTask[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('User not authenticated');

  let query = supabase
    .from('ai_tool_tasks')
    .select('*')
    .eq('user_id', userData.user.id);
    
  // Add document filter if provided
  if (documentId) {
    query = query.eq('document_id', documentId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as AIToolTask[];
}
