import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, email, planName } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response('No authorization header', { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Generate reference
    const reference = `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record in Supabase
    const { error: insertError } = await supabase
      .from('paystack_payments')
      .insert({
        user_id: user.id,
        paystack_reference: reference,
        amount: amount,
        currency: 'NGN',
        status: 'pending',
        customer_email: email,
        metadata: {
          plan_name: planName,
          user_id: user.id
        }
      });

    if (insertError) {
      console.error('Error creating payment record:', insertError);
      return new Response('Error creating payment record', { status: 500, headers: corsHeaders });
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: amount * 100, // Convert to kobo
        reference: reference,
        callback_url: `${req.headers.get('origin')}/thank-you`,
        metadata: {
          user_id: user.id,
          plan_name: planName
        }
      })
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error('Paystack initialization failed:', paystackData.message);
      return new Response('Payment initialization failed', { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      url: paystackData.data.authorization_url,
      reference: reference
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});