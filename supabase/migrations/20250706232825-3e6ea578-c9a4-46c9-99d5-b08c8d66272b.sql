
-- First, let's check what the current constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.ai_tool_tasks'::regclass 
AND contype = 'c';

-- Drop the existing check constraint if it exists
ALTER TABLE public.ai_tool_tasks DROP CONSTRAINT IF EXISTS ai_tool_tasks_tool_type_check;

-- Create a new check constraint that includes 'mindmap' as a valid tool type
ALTER TABLE public.ai_tool_tasks 
ADD CONSTRAINT ai_tool_tasks_tool_type_check 
CHECK (tool_type IN ('mindmap', 'flashcards', 'presentation', 'eli5', 'qa_bot', 'video'));
