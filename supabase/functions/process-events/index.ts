import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Haversine distance formula
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Check if point is inside polygon (simple ray casting algorithm)
function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting event processing...');

    // Get unprocessed positions
    const { data: positions, error: posError } = await supabase
      .from('positions')
      .select('*')
      .eq('processed', false)
      .order('ts', { ascending: true })
      .limit(100);

    if (posError) throw posError;

    if (!positions || positions.length === 0) {
      console.log('No unprocessed positions found');
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing ${positions.length} positions`);

    // Get active checkpoints
    const { data: checkpoints } = await supabase
      .from('checkpoints')
      .select('*')
      .eq('enabled', true);

    // Get active sectors
    const { data: sectors } = await supabase
      .from('sectors')
      .select('*')
      .eq('enabled', true);

    let eventsCreated = 0;

    for (const pos of positions) {
      // Process checkpoints
      if (checkpoints) {
        for (const checkpoint of checkpoints) {
          const distance = haversine(
            parseFloat(pos.lat),
            parseFloat(pos.lng),
            parseFloat(checkpoint.lat),
            parseFloat(checkpoint.lng)
          );

          const isInside = distance <= checkpoint.radius_m;

          // Get current state
          const { data: state } = await supabase
            .from('unit_states')
            .select('*')
            .eq('unit_id', pos.unit_id)
            .eq('ref_type', 'checkpoint')
            .eq('ref_id', checkpoint.id)
            .single();

          if (isInside && (!state || !state.is_inside)) {
            // Enter event
            await supabase.from('events').insert({
              unit_id: pos.unit_id,
              type: 'checkpoint_enter',
              ref_id: checkpoint.id,
              ref_type: 'checkpoint',
              lat: pos.lat,
              lng: pos.lng,
              ts: pos.ts,
              meta: { checkpoint_name: checkpoint.name, distance },
            });

            // Update state
            await supabase.from('unit_states').upsert({
              unit_id: pos.unit_id,
              ref_type: 'checkpoint',
              ref_id: checkpoint.id,
              is_inside: true,
              entered_at: pos.ts,
              last_seen: pos.ts,
            });

            eventsCreated++;
            console.log(`Created checkpoint_enter for ${pos.unit_id} at ${checkpoint.name}`);
          } else if (!isInside && state?.is_inside) {
            // Exit event
            await supabase.from('events').insert({
              unit_id: pos.unit_id,
              type: 'checkpoint_exit',
              ref_id: checkpoint.id,
              ref_type: 'checkpoint',
              lat: pos.lat,
              lng: pos.lng,
              ts: pos.ts,
              meta: { checkpoint_name: checkpoint.name, distance },
            });

            // Update state
            await supabase.from('unit_states').upsert({
              unit_id: pos.unit_id,
              ref_type: 'checkpoint',
              ref_id: checkpoint.id,
              is_inside: false,
              entered_at: null,
              last_seen: pos.ts,
            });

            eventsCreated++;
            console.log(`Created checkpoint_exit for ${pos.unit_id} from ${checkpoint.name}`);
          } else if (isInside && state?.is_inside && state.entered_at) {
            // Check for dwell
            const dwellMinutes =
              (new Date(pos.ts).getTime() - new Date(state.entered_at).getTime()) / 60000;

            if (dwellMinutes >= 10) {
              // Dwell threshold: 10 minutes
              // Only create dwell event if we haven't created one recently
              const { data: recentDwell } = await supabase
                .from('events')
                .select('id')
                .eq('unit_id', pos.unit_id)
                .eq('type', 'dwell')
                .eq('ref_id', checkpoint.id)
                .eq('ref_type', 'checkpoint')
                .gte('ts', new Date(Date.now() - 15 * 60000).toISOString()) // Last 15 min
                .single();

              if (!recentDwell) {
                await supabase.from('events').insert({
                  unit_id: pos.unit_id,
                  type: 'dwell',
                  ref_id: checkpoint.id,
                  ref_type: 'checkpoint',
                  lat: pos.lat,
                  lng: pos.lng,
                  ts: pos.ts,
                  meta: { checkpoint_name: checkpoint.name, dwell_minutes: dwellMinutes },
                });

                eventsCreated++;
                console.log(`Created dwell event for ${pos.unit_id} at ${checkpoint.name}`);
              }
            }

            // Update last seen
            await supabase
              .from('unit_states')
              .update({ last_seen: pos.ts })
              .eq('unit_id', pos.unit_id)
              .eq('ref_type', 'checkpoint')
              .eq('ref_id', checkpoint.id);
          }
        }
      }

      // Process sectors
      if (sectors) {
        for (const sector of sectors) {
          try {
            const polygon = sector.polygon?.coordinates?.[0] || sector.polygon;
            if (!polygon) continue;

            const isInside = pointInPolygon(
              [parseFloat(pos.lng), parseFloat(pos.lat)],
              polygon
            );

            // Get current state
            const { data: state } = await supabase
              .from('unit_states')
              .select('*')
              .eq('unit_id', pos.unit_id)
              .eq('ref_type', 'sector')
              .eq('ref_id', sector.id)
              .single();

            if (isInside && (!state || !state.is_inside)) {
              // Enter event
              await supabase.from('events').insert({
                unit_id: pos.unit_id,
                type: 'sector_enter',
                ref_id: sector.id,
                ref_type: 'sector',
                lat: pos.lat,
                lng: pos.lng,
                ts: pos.ts,
                meta: { sector_name: sector.name },
              });

              // Update state
              await supabase.from('unit_states').upsert({
                unit_id: pos.unit_id,
                ref_type: 'sector',
                ref_id: sector.id,
                is_inside: true,
                entered_at: pos.ts,
                last_seen: pos.ts,
              });

              eventsCreated++;
              console.log(`Created sector_enter for ${pos.unit_id} in ${sector.name}`);
            } else if (!isInside && state?.is_inside) {
              // Exit event
              await supabase.from('events').insert({
                unit_id: pos.unit_id,
                type: 'sector_exit',
                ref_id: sector.id,
                ref_type: 'sector',
                lat: pos.lat,
                lng: pos.lng,
                ts: pos.ts,
                meta: { sector_name: sector.name },
              });

              // Update state
              await supabase.from('unit_states').upsert({
                unit_id: pos.unit_id,
                ref_type: 'sector',
                ref_id: sector.id,
                is_inside: false,
                entered_at: null,
                last_seen: pos.ts,
              });

              eventsCreated++;
              console.log(`Created sector_exit for ${pos.unit_id} from ${sector.name}`);
            }
          } catch (err) {
            console.error(`Error processing sector ${sector.name}:`, err);
          }
        }
      }

      // Mark position as processed
      await supabase
        .from('positions')
        .update({ processed: true })
        .eq('id', pos.id);
    }

    console.log(`Event processing complete. Created ${eventsCreated} events`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: positions.length,
        events_created: eventsCreated,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in process-events:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
