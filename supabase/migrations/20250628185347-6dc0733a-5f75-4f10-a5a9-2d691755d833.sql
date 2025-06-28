
-- Enable RLS on tables that don't have it yet (skip if already enabled)
DO $$ 
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'ai_tool_tasks') THEN
        ALTER TABLE public.ai_tool_tasks ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'notifications') THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'document_shares') THEN
        ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'document_progress') THEN
        ALTER TABLE public.document_progress ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'documents') THEN
        ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- AI Tool Tasks policies (create only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_tool_tasks' AND policyname = 'Users can view their own ai tool tasks') THEN
        CREATE POLICY "Users can view their own ai tool tasks" 
          ON public.ai_tool_tasks 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_tool_tasks' AND policyname = 'Users can create their own ai tool tasks') THEN
        CREATE POLICY "Users can create their own ai tool tasks" 
          ON public.ai_tool_tasks 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_tool_tasks' AND policyname = 'Users can update their own ai tool tasks') THEN
        CREATE POLICY "Users can update their own ai tool tasks" 
          ON public.ai_tool_tasks 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Notifications policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
        CREATE POLICY "Users can view their own notifications" 
          ON public.notifications 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can create notifications') THEN
        CREATE POLICY "Users can create notifications" 
          ON public.notifications 
          FOR INSERT 
          WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
        CREATE POLICY "Users can update their own notifications" 
          ON public.notifications 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Document shares policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_shares' AND policyname = 'Users can view shares they created or received') THEN
        CREATE POLICY "Users can view shares they created or received" 
          ON public.document_shares 
          FOR SELECT 
          USING (auth.uid() = shared_by OR auth.uid() = shared_with);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_shares' AND policyname = 'Users can create document shares') THEN
        CREATE POLICY "Users can create document shares" 
          ON public.document_shares 
          FOR INSERT 
          WITH CHECK (auth.uid() = shared_by);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_shares' AND policyname = 'Users can delete shares they created') THEN
        CREATE POLICY "Users can delete shares they created" 
          ON public.document_shares 
          FOR DELETE 
          USING (auth.uid() = shared_by);
    END IF;
END $$;

-- Document progress policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_progress' AND policyname = 'Users can view their own progress') THEN
        CREATE POLICY "Users can view their own progress" 
          ON public.document_progress 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_progress' AND policyname = 'Users can manage their own progress') THEN
        CREATE POLICY "Users can manage their own progress" 
          ON public.document_progress 
          FOR ALL 
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Enable real-time updates for AI tool tasks (safe to run multiple times)
ALTER TABLE public.ai_tool_tasks REPLICA IDENTITY FULL;

-- Add to realtime publication (safe to run multiple times)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'ai_tool_tasks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_tool_tasks;
    END IF;
END $$;
