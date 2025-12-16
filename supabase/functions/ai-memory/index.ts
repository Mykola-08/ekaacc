import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { action, content, userId, metadata, query, match_threshold, match_count } = await req.json()

    // Create Supabase client
    // Use service role key for writing to user_memory if RLS is tricky with Edge Functions, 
    // but ideally we pass the user's JWT. 
    // For now, let's assume we trust the caller (server-side) or validate the JWT.
    
    const authHeader = req.headers.get('Authorization')
    let supabaseClient;
    
    if (authHeader) {
        supabaseClient = createClient(
            SUPABASE_URL ?? '',
            SUPABASE_ANON_KEY ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )
    } else {
        // Fallback to service role if no auth header (be careful with this in production)
        // For this demo, we'll require auth header or explicit userId for service role usage
        if (!userId && !authHeader) throw new Error('Unauthorized');
        supabaseClient = createClient(
            SUPABASE_URL ?? '',
            SUPABASE_SERVICE_ROLE_KEY ?? ''
        )
    }

    if (action === 'store') {
      if (!content) throw new Error('Content is required for store action')
      
      // Generate Embedding
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small', // or text-embedding-ada-002
          input: content,
        }),
      })

      if (!embeddingResponse.ok) {
        const error = await embeddingResponse.text()
        throw new Error(`OpenAI Embedding error: ${error}`)
      }

      const embeddingData = await embeddingResponse.json()
      const embedding = embeddingData.data[0].embedding

      // Store in DB
      const { data, error } = await supabaseClient
        .from('user_memory')
        .insert({
          user_id: userId, // If using RLS with JWT, this might be redundant or auto-filled
          content,
          embedding,
          metadata: metadata || {},
          memory_type: metadata?.type || 'observation'
        })
        .select()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } 
    
    else if (action === 'retrieve') {
      if (!query) throw new Error('Query is required for retrieve action')

      // Generate Embedding for query
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: query,
        }),
      })

      if (!embeddingResponse.ok) {
        const error = await embeddingResponse.text()
        throw new Error(`OpenAI Embedding error: ${error}`)
      }

      const embeddingData = await embeddingResponse.json()
      const embedding = embeddingData.data[0].embedding

      // Call match_user_memory function
      const { data, error } = await supabaseClient.rpc('match_user_memory', {
        query_embedding: embedding,
        match_threshold: match_threshold || 0.7,
        match_count: match_count || 5,
        p_user_id: userId
      })

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    else {
      throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
