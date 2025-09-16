// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // The frontend now sends a FormData object. We can access it here.
    // In a real-world scenario, you would process the uploaded file.
    const formData = await req.formData();
    const file = formData.get('document'); // 'document' is the key we used in the frontend

    // You can add logic here to check if a file was uploaded
    if (!file) {
      return new Response(JSON.stringify({ error: 'No document uploaded.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // For this demonstration, we will still return a fixed JSON object,
    // but we've shown how to receive the file.
    const extractedData = {
      holderName: "Mangal Singh",
      village: "Kothari",
      area: 5.19, // 2.1 Hectares converted to acres
      state: "Madhya Pradesh",
      district: "Betul",
      coordinates: '{"type":"Polygon","coordinates":[[[78.456, 22.123],[78.457, 22.123],[78.457, 22.124],[78.456, 22.124],[78.456, 22.123]]]}',
    };

    // Simulate a delay to mimic processing time
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