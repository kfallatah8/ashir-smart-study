
import { supabase } from '@/integrations/supabase/client';

// Define specific result type interfaces for different AI tools
export interface MindMapNode {
  id: string;
  label: string;
  type: string;
}

export interface MindMapEdge {
  source: string;
  target: string;
}

export interface MindMapResult {
  nodes: MindMapNode[];
  edges?: MindMapEdge[];
}

export interface FlashcardItem {
  question: string;
  answer: string;
}

// Define the AIToolTask interface with a simple non-recursive type
export interface AIToolTask {
  id: string;
  document_id: string;
  user_id: string;
  tool_type: string;
  status: string;
  result: Record<string, any>; // Using Record<string, any> to avoid recursive type issues
  created_at: string;
  updated_at: string;
}

// Helper functions to type-check results
export function isMindMapResult(result: any): result is MindMapResult {
  return (
    typeof result === 'object' && 
    result !== null && 
    'nodes' in result && 
    Array.isArray(result.nodes)
  );
}

export function isFlashcardsResult(result: any): result is FlashcardItem[] {
  return (
    Array.isArray(result) && 
    result.length > 0 && 
    typeof result[0] === 'object' && 
    result[0] !== null &&
    'question' in result[0] && 
    'answer' in result[0]
  );
}

// Create a new AI tool task
export async function createAIToolTask(documentId: string, toolType: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('ai_tool_tasks')
    .insert({
      document_id: documentId,
      user_id: userData.user.id,
      tool_type: toolType,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data as AIToolTask;
}

// Get AI tool tasks for a document
export async function getAIToolTasks(documentId: string): Promise<AIToolTask[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('ai_tool_tasks')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as AIToolTask[] || [];
}
