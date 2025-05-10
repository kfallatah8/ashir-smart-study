
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createAIToolTask, getAIToolTasks, AIToolTask } from '@/lib/documents';
import { supabase } from '@/integrations/supabase/client';

export function useAITools(documentId: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<AIToolTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!documentId) return;
    
    setIsLoading(true);
    try {
      const fetchedTasks = await getAIToolTasks(documentId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching AI tool tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI tool tasks',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!documentId) return;
    
    fetchTasks();

    // Set up real-time subscription for task updates
    const channel = supabase
      .channel(`ai_tool_tasks:document_id=${documentId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'ai_tool_tasks',
        filter: `document_id=eq.${documentId}`
      }, (payload) => {
        console.log('Real-time update received:', payload);
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  const generateTool = async (toolType: string) => {
    try {
      setIsProcessing(true);
      const task = await createAIToolTask(documentId, toolType);
      console.log('Task created:', task);
      
      // Call edge function to process the task
      const { error } = await supabase.functions.invoke('process-ai-tool', {
        body: { taskId: task.id }
      });

      if (error) {
        console.error('Error invoking process-ai-tool function:', error);
        throw error;
      }

      toast({
        title: 'Processing Started',
        description: 'Your request is being processed. You will be notified when it\'s ready.',
      });
      
      // Update the tasks list with the new task
      setTasks(prev => [task, ...prev]);
      
      // Fetch tasks after a delay to ensure we get the updated status
      setTimeout(() => {
        fetchTasks();
      }, 5000);
      
    } catch (error: any) {
      console.error('Error generating tool:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate tool',
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
    isLoading,
    refreshTasks: fetchTasks
  };
}
