
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createAIToolTask, getAIToolTasks } from '@/lib/document-utils';
import { supabase } from '@/integrations/supabase/client';

export function useAITools(documentId: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
    } catch (error) {
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
    generateTool
  };
}
