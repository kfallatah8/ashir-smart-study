
import { supabase } from '@/integrations/supabase/client';

export async function cleanupStuckTasks() {
  try {
    // Find tasks that are stuck in 'pending' or 'processing' status for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: stuckTasks, error: fetchError } = await supabase
      .from('ai_tool_tasks')
      .select('id, tool_type, status, created_at')
      .in('status', ['pending', 'processing'])
      .lt('created_at', tenMinutesAgo);
    
    if (fetchError) {
      console.error('Error fetching stuck tasks:', fetchError);
      return;
    }
    
    if (stuckTasks && stuckTasks.length > 0) {
      console.log(`Found ${stuckTasks.length} stuck tasks, marking as failed`);
      
      // Mark stuck tasks as failed
      const { error: updateError } = await supabase
        .from('ai_tool_tasks')
        .update({
          status: 'failed',
          result: { error: 'Task timed out' },
          updated_at: new Date().toISOString()
        })
        .in('id', stuckTasks.map(task => task.id));
      
      if (updateError) {
        console.error('Error updating stuck tasks:', updateError);
        return;
      }
      
      console.log('Successfully cleaned up stuck tasks');
    }
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
}

// Auto-cleanup function that can be called periodically
export function startTaskCleanup() {
  // Run cleanup immediately
  cleanupStuckTasks();
  
  // Then run every 5 minutes
  const interval = setInterval(cleanupStuckTasks, 5 * 60 * 1000);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}
