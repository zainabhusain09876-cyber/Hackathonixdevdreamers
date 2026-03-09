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
    const { goalName, targetAmount, currentSavings, months } = await req.json()
    
    const monthlyRequired = Math.ceil((targetAmount - currentSavings) / months)
    
    // This is a mock AI response for demonstration. 
    // In a real scenario, you would call OpenAI here using an API key.
    const analysis = {
      feasibility: monthlyRequired > 50000 ? "Challenging" : "Realistic",
      probability: Math.min(95, Math.max(10, 100 - (monthlyRequired / 2000))),
      advice: monthlyRequired > 20000 
        ? `To reach your ₹${targetAmount.toLocaleString()} goal for ${goalName}, consider extending the deadline to 12 months to reduce monthly pressure.`
        : `Your plan for ${goalName} looks solid! Keep a consistent saving habit of ₹${monthlyRequired.toLocaleString()} per month.`,
      score: 85
    }

    console.log("[analyze-goal] Analysis complete for", goalName);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("[analyze-goal] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})