import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { documentId } = await req.json();

    console.log('Extracting text for document:', documentId);

    // Get document details
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      console.error('Error fetching document:', docError);
      throw new Error('Document not found');
    }

    console.log('Document found:', doc.title, 'Type:', doc.file_type);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(doc.file_path);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw downloadError;
    }

    let extractedText = '';

    // Extract text based on file type
    if (doc.file_type === 'application/pdf') {
      console.log('Processing PDF file...');
      // For PDFs, we'll use a simple approach
      // In a production app, you'd use a proper PDF parser
      extractedText = `PDF content from ${doc.title}. This is a placeholder text extraction.`;
    } else if (doc.file_type === 'text/plain' || doc.file_type.includes('text')) {
      console.log('Processing text file...');
      extractedText = await fileData.text();
    } else if (doc.file_type.includes('word') || doc.file_type.includes('document')) {
      console.log('Processing Word document...');
      // For Word docs, placeholder extraction
      extractedText = `Word document content from ${doc.title}. This is a placeholder text extraction.`;
    } else {
      console.log('Unsupported file type, using filename as text');
      extractedText = `Document: ${doc.title}`;
    }

    console.log('Extracted text length:', extractedText.length);

    // Update the document with extracted text
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        document_text: extractedText,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document:', updateError);
      throw updateError;
    }

    console.log('Document text extraction completed successfully');

    return new Response(
      JSON.stringify({ success: true, textLength: extractedText.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in extract-document-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
