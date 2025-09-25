import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create Usuario A
    const { data: userA, error: errorA } = await supabaseAdmin.auth.admin.createUser({
      email: 'usuario.a@gestion.com',
      password: 'contraeñaa',
      email_confirm: true,
      user_metadata: {
        user_type: 'tipo_a',
        full_name: 'Usuario A'
      }
    })

    if (errorA) {
      console.error('Error creating Usuario A:', errorA)
    } else {
      console.log('Usuario A created successfully:', userA.user?.email)
    }

    // Create Usuario B
    const { data: userB, error: errorB } = await supabaseAdmin.auth.admin.createUser({
      email: 'usuario.b@gestion.com',
      password: 'contraseñab',
      email_confirm: true,
      user_metadata: {
        user_type: 'tipo_b',
        full_name: 'Usuario B'
      }
    })

    if (errorB) {
      console.error('Error creating Usuario B:', errorB)
    } else {
      console.log('Usuario B created successfully:', userB.user?.email)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test users created successfully',
        users: {
          userA: userA?.user?.email,
          userB: userB?.user?.email
        },
        errors: {
          userA: errorA?.message,
          userB: errorB?.message
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})