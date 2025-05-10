
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default when deployed
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default when deployed
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the function
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the data from the request
    const { taskId } = await req.json()

    if (!taskId) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get the task from the database
    const { data: task, error: taskError } = await supabaseClient
      .from('ai_tool_tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (taskError || !task) {
      return new Response(JSON.stringify({ error: taskError?.message || 'Task not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get the document
    const { data: document, error: documentError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', task.document_id)
      .single()

    if (documentError || !document) {
      return new Response(JSON.stringify({ error: documentError?.message || 'Document not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Process the task - this is a simulation since we don't have actual AI processing
    // In a real application, you would call an AI service here
    const processTask = async () => {
      try {
        console.log(`Processing ${task.tool_type} task for document ${task.document_id}`)
        
        // Wait a bit to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Different results based on tool type
        let result
        switch (task.tool_type) {
          case 'mind_map':
            result = {
              type: 'mindmap',
              nodes: [
                { id: '1', label: document.title, type: 'root' },
                { id: '2', label: 'Key Concept 1', type: 'concept' },
                { id: '3', label: 'Key Concept 2', type: 'concept' },
                { id: '4', label: 'Sub-concept 1.1', type: 'subconcept' },
                { id: '5', label: 'Sub-concept 2.1', type: 'subconcept' },
              ],
              edges: [
                { from: '1', to: '2' },
                { from: '1', to: '3' },
                { from: '2', to: '4' },
                { from: '3', to: '5' },
              ]
            }
            break
          case 'flashcards':
            result = {
              type: 'flashcards',
              cards: [
                { id: '1', question: 'Question 1?', answer: 'Answer 1' },
                { id: '2', question: 'Question 2?', answer: 'Answer 2' },
                { id: '3', question: 'Question 3?', answer: 'Answer 3' },
              ]
            }
            break
          default:
            result = { type: task.tool_type, message: `${task.tool_type} processed successfully` }
        }
        
        // Update the task with the result
        const { error: updateError } = await supabaseClient
          .from('ai_tool_tasks')
          .update({
            status: 'completed',
            result: result,
            updated_at: new Date().toISOString(),
          })
          .eq('id', task.id)
        
        if (updateError) {
          console.error('Error updating task:', updateError)
          throw updateError
        }
        
        // Create a notification for the user
        const { error: notificationError } = await supabaseClient
          .from('notifications')
          .insert({
            user_id: task.user_id,
            type: 'ai_tool_complete',
            title: `${task.tool_type.replace('_', ' ')} is ready`,
            message: `Your ${task.tool_type.replace('_', ' ')} for ${document.title} has been generated.`,
            related_entity_id: task.id,
            related_entity_type: 'ai_tool_tasks',
          })
        
        if (notificationError) {
          console.error('Error creating notification:', notificationError)
        }
        
        console.log(`Task ${task.id} processed successfully`)
      } catch (error) {
        console.error('Error processing task:', error)
        
        // Update task status to failed
        await supabaseClient
          .from('ai_tool_tasks')
          .update({
            status: 'failed',
            result: { error: error.message },
            updated_at: new Date().toISOString(),
          })
          .eq('id', task.id)
      }
    }

    // Process the task in the background
    EdgeRuntime.waitUntil(processTask())

    return new Response(JSON.stringify({ success: true, message: 'Task processing started' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
