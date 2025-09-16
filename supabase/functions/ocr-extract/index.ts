// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This is a required step for CORS to work
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Simulate OCR/NER processing. In a real-world scenario, you would
  // process an uploaded image file here using an OCR library.
  // For this demonstration, we return a fixed JSON object based on your example.
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
})