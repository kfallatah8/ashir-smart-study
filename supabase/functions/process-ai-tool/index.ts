
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Get task ID from request
    const { taskId } = await req.json()
    if (!taskId) throw new Error('Task ID is required')

    // Get task details
    const { data: task, error: taskError } = await supabaseClient
      .from('ai_tool_tasks')
      .select('*, documents(*)')
      .eq('id', taskId)
      .single()

    if (taskError) throw taskError
    if (!task) throw new Error('Task not found')

    // Update status to processing
    await supabaseClient
      .from('ai_tool_tasks')
      .update({ status: 'processing' })
      .eq('id', taskId)

    // Process based on tool type
    let result
    switch (task.tool_type) {
      case 'mind_map':
        // Implementation for mind map
        break
      case 'flashcards':
        // Implementation for flashcards
        break
      // Add other tool types here
    }

    // Update task with result
    await supabaseClient
      .from('ai_tool_tasks')
      .update({
        status: 'completed',
        result,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: task.user_id,
        title: 'AI Tool Complete',
        message: `Your ${task.tool_type} has been generated successfully!`,
        type: 'ai_tool_complete'
      })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
