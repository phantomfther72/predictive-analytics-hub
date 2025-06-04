
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string, maxAttempts = 5, windowMs = 60000): boolean => {
  const now = Date.now();
  const key = `payment_${userId}`;
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxAttempts) {
    return false;
  }
  
  existing.count++;
  return true;
};

const validateAmount = (amount: any): number => {
  if (typeof amount !== 'number' || amount <= 0 || amount > 100000) {
    throw new Error('Invalid payment amount');
  }
  return amount;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check rate limiting
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Too many payment attempts. Please try again later.' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const amount = validateAmount(body.amount);
    const currency = body.currency || 'usd';

    if (!['usd', 'eur', 'gbp'].includes(currency)) {
      throw new Error('Invalid currency');
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Create a payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
        created_at: new Date().toISOString(),
      },
    });

    console.log(`Payment intent created for user ${user.id}: ${paymentIntent.id}`);
    
    // Return the client secret to the frontend
    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    
    // Don't expose internal errors to client
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    const safeMessage = message.includes('Invalid') || message.includes('required') || message.includes('Too many') 
      ? message 
      : "Payment initialization failed";
    
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error instanceof Error && error.message.includes('Too many') ? 429 : 400,
      }
    );
  }
});
