import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify Paystack webhook signature
async function verifyPaystackSignature(body: string, signature: string): Promise<boolean> {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY')!;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(body);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  
  const signature_bytes = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
  const expected_signature = Array.from(new Uint8Array(signature_bytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return expected_signature === signature;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    
    if (!signature) {
      console.error('No signature provided');
      return new Response('No signature provided', { status: 400, headers: corsHeaders });
    }

    // Verify webhook signature
    const isValid = await verifyPaystackSignature(body, signature);
    if (!isValid) {
      console.error('Invalid signature');
      return new Response('Invalid signature', { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { data } = event;
      const { reference, customer, amount, metadata } = data;

      console.log('Processing successful payment:', reference);

      // Update payment record
      const { error: paymentError } = await supabase
        .from('paystack_payments')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
          metadata: data
        })
        .eq('paystack_reference', reference);

      if (paymentError) {
        console.error('Error updating payment:', paymentError);
        return new Response('Error updating payment', { status: 500, headers: corsHeaders });
      }

      // Get user ID from metadata
      const userId = metadata?.user_id;
      if (!userId) {
        console.error('No user_id in metadata');
        return new Response('No user_id in metadata', { status: 400, headers: corsHeaders });
      }

      // Determine role based on plan name or amount
      const planName = metadata?.plan_name || 'Pro';
      const role = planName.toLowerCase() === 'investor' ? 'investor' : 'pro';

      // Upgrade user role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: role,
          paystack_customer_code: customer?.customer_code,
          subscription_status: 'active',
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return new Response('Error updating profile', { status: 500, headers: corsHeaders });
      }

      console.log(`User upgraded to ${role} successfully:`, userId);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});