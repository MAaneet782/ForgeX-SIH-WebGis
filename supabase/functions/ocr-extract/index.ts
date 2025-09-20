/// <reference lib="deno.env" />
/// <reference types="npm:@supabase/supabase-js/v2" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // --- JWT Authentication ---
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized: Missing Authorization header', { status: 401, headers: corsHeaders })
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

  if (authError || !user) {
    return new Response('Unauthorized: Invalid or expired token', { status: 401, headers: corsHeaders })
  }
  // --- End JWT Authentication ---

  try {
    const formData = await req.formData();
    const file = formData.get('document');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No document uploaded.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const extractedData = {
      holderName: "Mangal Singh",
      village: "Kothari",
      area: 5.19, // 2.1 Hectares converted to acres
      state: "Madhya Pradesh",
      district: "Betul",
      coordinates: '{"type":"Polygon","coordinates":[[[78.456, 22.123],[78.457, 22.123],[78.457, 22.124],[78.456, 22.124],[78.456, 22.123]]]}',
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    return new Response(
      JSON.stringify({ data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})