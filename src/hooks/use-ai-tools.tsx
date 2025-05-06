
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createAIToolTask, getAIToolTasks, AIToolTask } from '@/lib/document-utils';
import { supabase } from '@/integrations/supabase/client';

export function useAITools(documentId: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<AIToolTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!documentId) return;
    
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await getAIToolTasks(documentId);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching AI tool tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Set up real-time subscription for task updates
    const subscription = supabase
      .channel(`ai_tool_tasks:document_id=eq.${documentId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'ai_tool_tasks',
        filter: `document_id=eq.${documentId}`
      }, (payload) => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);

  const generateTool = async (toolType: string) => {
    try {
      setIsProcessing(true);
      const task = await createAIToolTask(documentId, toolType);
      
      // Call edge function to process the task
      const { error } = await supabase.functions.invoke('process-ai-tool', {
        body: { taskId: task.id }
      });

      if (error) throw error;

      toast({
        title: 'Processing Started',
        description: 'Your request is being processed. You will be notified when it\'s ready.',
      });
      
      // Update the tasks list with the new task
      setTasks(prev => [task, ...prev]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    generateTool,
    tasks,
    isLoading
  };
}
