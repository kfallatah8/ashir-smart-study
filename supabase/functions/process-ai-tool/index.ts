
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { taskId } = await req.json();

    console.log('Processing AI tool task:', taskId);

    // Get the task details
    const { data: task, error: taskError } = await supabase
      .from('ai_tool_tasks')
      .select(`
        *,
        documents (
          title,
          document_text,
          file_type
        )
      `)
      .eq('id', taskId)
      .single();

    if (taskError) {
      console.error('Error fetching task:', taskError);
      throw taskError;
    }

    if (!task) {
      throw new Error('Task not found');
    }

    console.log('Task found:', task.tool_type, 'for document:', task.documents?.title);

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      await supabase
        .from('ai_tool_tasks')
        .update({
          status: 'failed',
          result: { error: 'OpenAI API key not configured' },
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Update status to processing
    await supabase
      .from('ai_tool_tasks')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    const documentText = task.documents?.document_text || 'No document text available';
    const documentTitle = task.documents?.title || 'Untitled Document';

    let result;
    let prompt;

    // Generate AI content based on tool type
    switch (task.tool_type) {
      case 'mindmap':
        prompt = `Create a mind map for the document "${documentTitle}". 
        Based on this content: ${documentText.substring(0, 3000)}
        
        Return a JSON object with this exact structure:
        {
          "type": "mindmap",
          "nodes": [
            {"id": "1", "label": "Main Topic", "type": "root"},
            {"id": "2", "label": "Subtopic 1", "type": "topic"},
            {"id": "3", "label": "Subtopic 2", "type": "topic"}
          ],
          "edges": [
            {"from": "1", "to": "2", "label": "relates to"},
            {"from": "1", "to": "3", "label": "connects to"}
          ]
        }`;
        break;

      case 'flashcards':
        prompt = `Create flashcards for the document "${documentTitle}".
        Based on this content: ${documentText.substring(0, 3000)}
        
        Return a JSON object with this exact structure:
        {
          "type": "flashcards",
          "cards": [
            {"id": "1", "question": "What is...?", "answer": "The answer is..."},
            {"id": "2", "question": "How does...?", "answer": "It works by..."}
          ]
        }`;
        break;

      case 'eli5':
        prompt = `Explain the document "${documentTitle}" like I'm 5 years old.
        Based on this content: ${documentText.substring(0, 3000)}
        
        Return a JSON object with this exact structure:
        {
          "type": "eli5",
          "explanation": "Simple explanation here..."
        }`;
        break;

      default:
        throw new Error(`Unknown tool type: ${task.tool_type}`);
    }

    console.log('Calling OpenAI API...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that creates educational content. Always return valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const openAIData = await openAIResponse.json();
    const generatedContent = openAIData.choices[0].message.content;

    console.log('OpenAI response received:', generatedContent.substring(0, 200));

    try {
      result = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      result = {
        type: task.tool_type,
        error: 'Failed to parse AI response',
        raw_response: generatedContent
      };
    }

    // Update task with results
    const { error: updateError } = await supabase
      .from('ai_tool_tasks')
      .update({
        status: 'completed',
        result: result,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (updateError) {
      console.error('Error updating task:', updateError);
      throw updateError;
    }

    console.log('Task completed successfully:', taskId);

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in process-ai-tool function:', error);

    // Try to update task status to failed
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { taskId } = await req.json();
      
      await supabase
        .from('ai_tool_tasks')
        .update({
          status: 'failed',
          result: { error: error.message },
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
    } catch (updateError) {
      console.error('Failed to update task status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
