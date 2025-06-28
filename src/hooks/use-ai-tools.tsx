
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
      console.log(`Fetched ${fetchedTasks.length} AI tool tasks for document ${documentId}`);
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
        console.log('Real-time AI tool task update:', payload);
        
        // Show success notification when task completes
        if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
          toast({
            title: 'AI Tool Ready',
            description: `Your ${payload.new.tool_type} has been generated successfully!`,
          });
        }
        
        // Show error notification when task fails
        if (payload.eventType === 'UPDATE' && payload.new.status === 'failed') {
          toast({
            title: 'AI Tool Failed',
            description: `Failed to generate ${payload.new.tool_type}. Please try again.`,
            variant: "destructive"
          });
        }
        
        // Refresh tasks list
        fetchTasks();
      })
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  const generateTool = async (toolType: string) => {
    try {
      setIsProcessing(true);
      console.log(`Generating ${toolType} for document ${documentId}`);
      
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
        description: `Your ${toolType} is being generated. You'll be notified when it's ready.`,
      });
      
      // Update the tasks list immediately with the new task
      setTasks(prev => [task, ...prev]);
      
    } catch (error: any) {
      console.error('Error generating tool:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to generate ${toolType}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to retry stuck tasks
  const retryTask = async (taskId: string) => {
    try {
      console.log('Retrying task:', taskId);
      
      const { error } = await supabase.functions.invoke('process-ai-tool', {
        body: { taskId }
      });

      if (error) {
        console.error('Error retrying task:', error);
        throw error;
      }

      toast({
        title: 'Retry Started',
        description: 'Retrying to process your request...',
      });
      
    } catch (error: any) {
      console.error('Error retrying task:', error);
      toast({
        title: 'Retry Failed',
        description: error.message || 'Failed to retry task',
        variant: "destructive"
      });
    }
  };

  return {
    isProcessing,
    generateTool,
    tasks,
    isLoading,
    refreshTasks: fetchTasks,
    retryTask
  };
}
