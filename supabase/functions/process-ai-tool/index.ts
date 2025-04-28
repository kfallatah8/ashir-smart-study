
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

    // Get document content
    const { data: document } = task.documents
    if (!document) throw new Error('Document not found')

    // Download document content if needed
    let documentContent = document.document_text
    if (!documentContent && document.file_path) {
      const { data: fileData, error: fileError } = await supabaseClient
        .storage
        .from('documents')
        .download(document.file_path)

      if (fileError) throw fileError
      
      // For demo purposes, we'll just extract text from PDF or assume plain text
      // In a real app, you would use a library to parse different file types
      const text = "This is sample text extracted from the document: " + document.title
      documentContent = text
    }

    // Process based on tool type
    let result
    switch (task.tool_type) {
      case 'mind_map':
        console.log("Generating mind map for document:", document.title)
        result = await generateMindMap(openai, documentContent || document.title)
        break
      case 'flashcards':
        console.log("Generating flashcards for document:", document.title)
        result = await generateFlashcards(openai, documentContent || document.title)
        break
      case 'presentations':
        console.log("Generating presentation for document:", document.title)
        result = await generatePresentation(openai, documentContent || document.title)
        break
      case 'eli5':
        console.log("Generating ELI5 explanation for document:", document.title)
        result = await generateELI5(openai, documentContent || document.title)
        break
      default:
        throw new Error(`Unsupported tool type: ${task.tool_type}`)
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
        message: `Your ${task.tool_type.replace('_', ' ')} has been generated successfully!`,
        type: 'ai_tool_complete'
      })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing AI tool:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// AI Tool generation functions
async function generateMindMap(openai: OpenAIApi, text: string) {
  const prompt = `
Create a mind map structure based on the following text. The mind map should:
1. Identify the main topic
2. Have 3-5 main branches (key concepts)
3. Have 2-3 sub-branches under each main branch
4. Be formatted as JSON with the following structure:
{
  "topic": "Main Topic",
  "branches": [
    {
      "name": "Branch 1",
      "children": [
        {"name": "Sub-branch 1.1"},
        {"name": "Sub-branch 1.2"}
      ]
    },
    ...more branches
  ]
}

Text to analyze: ${text.substring(0, 3000)}
`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are an expert educator that creates helpful mind maps from educational content."},
      {role: "user", content: prompt}
    ],
  });

  const content = response.data.choices[0]?.message?.content
  try {
    return JSON.parse(content ?? '{}')
  } catch (e) {
    console.error("Error parsing mind map JSON:", e)
    return { topic: "Error parsing mind map", branches: [] }
  }
}

async function generateFlashcards(openai: OpenAIApi, text: string) {
  const prompt = `
Create a set of 10 flashcards based on the following text. Each flashcard should:
1. Have a clear question on the front
2. Have a concise answer on the back
3. Cover an important concept from the text
4. Be formatted as JSON with the following structure:
[
  {
    "front": "Question 1",
    "back": "Answer 1"
  },
  ...more flashcards
]

Text to analyze: ${text.substring(0, 3000)}
`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are an expert educator that creates effective flashcards from educational content."},
      {role: "user", content: prompt}
    ],
  });

  const content = response.data.choices[0]?.message?.content
  try {
    return JSON.parse(content ?? '[]')
  } catch (e) {
    console.error("Error parsing flashcards JSON:", e)
    return []
  }
}

async function generatePresentation(openai: OpenAIApi, text: string) {
  const prompt = `
Create a presentation outline based on the following text. The presentation should:
1. Have an introduction slide
2. Have 5-7 content slides
3. Have a conclusion slide
4. Each slide should have a title and bullet points
5. Be formatted as JSON with the following structure:
[
  {
    "title": "Slide 1 Title",
    "type": "introduction",
    "content": ["Bullet point 1", "Bullet point 2"]
  },
  ...more slides
]

Text to analyze: ${text.substring(0, 3000)}
`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are an expert educator that creates engaging presentations from educational content."},
      {role: "user", content: prompt}
    ],
  });

  const content = response.data.choices[0]?.message?.content
  try {
    return JSON.parse(content ?? '[]')
  } catch (e) {
    console.error("Error parsing presentation JSON:", e)
    return []
  }
}

async function generateELI5(openai: OpenAIApi, text: string) {
  const prompt = `
Create a simplified "Explain Like I'm 5" explanation of the concepts in this text:

${text.substring(0, 3000)}

The explanation should:
1. Use simple language a child could understand
2. Use analogies to explain complex concepts
3. Be engaging and fun
4. Cover the main topics from the text
5. Be formatted as JSON with the following structure:
{
  "title": "Simple title",
  "summary": "One paragraph summary",
  "explanations": [
    {
      "concept": "Concept name",
      "explanation": "Simple explanation",
      "analogy": "Helpful analogy"
    },
    ...more concepts
  ]
}
`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are an expert educator that simplifies complex topics for children."},
      {role: "user", content: prompt}
    ],
  });

  const content = response.data.choices[0]?.message?.content
  try {
    return JSON.parse(content ?? '{}')
  } catch (e) {
    console.error("Error parsing ELI5 JSON:", e)
    return { title: "Error parsing explanation", summary: "Could not generate explanation", explanations: [] }
  }
}
