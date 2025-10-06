import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPOT_FEED_ID = '0bHppRKpS6BYcRKPfVlZUkMzVGcToaGm4';
const SPOT_API_URL = `https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/${SPOT_FEED_ID}/message.json`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching SPOT feed data...');
    
    // Fetch data from SPOT API
    const spotResponse = await fetch(SPOT_API_URL);
    
    if (!spotResponse.ok) {
      throw new Error(`SPOT API returned ${spotResponse.status}`);
    }

    const spotData = await spotResponse.json();
    
    if (!spotData.response?.feedMessageResponse?.messages?.message) {
      console.log('No messages in SPOT feed');
      return new Response(JSON.stringify({ inserted: 0, message: 'No messages' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messages = spotData.response.feedMessageResponse.messages.message;
    const messageArray = Array.isArray(messages) ? messages : [messages];

    console.log(`Processing ${messageArray.length} messages`);

    let insertedCount = 0;

    for (const msg of messageArray) {
      // Extract position data
      const unitId = msg.messengerId || msg.messengerName;
      const lat = msg.latitude;
      const lng = msg.longitude;
      const altitude = msg.altitude;
      const timestamp = new Date(msg.unixTime * 1000).toISOString();

      // Check if this position already exists
      const { data: existing } = await supabase
        .from('positions')
        .select('id')
        .eq('unit_id', unitId)
        .eq('ts', timestamp)
        .single();

      if (!existing) {
        // Insert new position
        const { error } = await supabase
          .from('positions')
          .insert({
            unit_id: unitId,
            lat,
            lng,
            altitude,
            ts: timestamp,
            raw: msg,
            processed: false,
          });

        if (error) {
          console.error('Error inserting position:', error);
        } else {
          insertedCount++;
        }
      }
    }

    console.log(`Inserted ${insertedCount} new positions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: insertedCount,
        total: messageArray.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in spot-feed-poller:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
