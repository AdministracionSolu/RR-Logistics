import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPOT_FEED_ID = '0bHppRKpS6BYcRKPfVlZUkMzVGcToaGm4';
const SPOT_API_URL = `https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/${SPOT_FEED_ID}/message.json`;

// Haversine formula to calculate distance between two points in km
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
        // Get previous position to calculate speed
        const { data: prevPosition } = await supabase
          .from('positions')
          .select('lat, lng, ts')
          .eq('unit_id', unitId)
          .neq('lat', -99999)
          .neq('lng', -99999)
          .order('ts', { ascending: false })
          .limit(1)
          .single();

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

          // Calculate and update speed if we have a previous position
          if (prevPosition && lat !== -99999 && lng !== -99999) {
            const distance = haversine(prevPosition.lat, prevPosition.lng, lat, lng);
            const timeDiff = (new Date(timestamp).getTime() - new Date(prevPosition.ts).getTime()) / 1000 / 3600; // hours
            
            if (timeDiff > 0 && timeDiff < 24) { // Only calculate if time difference is reasonable
              const speedKmh = distance / timeDiff;
              
              // Update truck speed using spot_unit_id
              const { error: updateError } = await supabase
                .from('camiones')
                .update({ 
                  velocidad_actual: Math.round(speedKmh * 10) / 10, // Round to 1 decimal
                  updated_at: timestamp
                })
                .eq('spot_unit_id', unitId);

              if (updateError) {
                console.error('Error updating truck speed:', updateError);
              } else {
                console.log(`Updated speed for unit ${unitId}: ${speedKmh.toFixed(1)} km/h`);
              }
            }
          }
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
