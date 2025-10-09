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

// Helper to create event and trigger notification
async function createEventWithNotification(
  supabase: any,
  eventData: any
): Promise<void> {
  const { data: newEvent, error: eventError } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (eventError) {
    console.error('Error creating event:', eventError);
    return;
  }

  if (newEvent) {
    console.log(`Created event: ${eventData.type} for unit ${eventData.unit_id}`);
    
    // Trigger notification asynchronously
    try {
      const { error: notifyError } = await supabase.functions.invoke('send-notification', {
        body: { event_id: newEvent.id }
      });
      
      if (notifyError) {
        console.error(`Failed to trigger notification for event ${newEvent.id}:`, notifyError);
      } else {
        console.log(`Notification triggered for event ${newEvent.id}`);
      }
    } catch (notifyError) {
      console.error(`Error invoking send-notification:`, notifyError);
    }
  }
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
      // Validate coordinates before processing
      const lat = parseFloat(pos.lat);
      const lng = parseFloat(pos.lng);
      
      if (lat === -99999 || lng === -99999 || 
          lat < -90 || lat > 90 || 
          lng < -180 || lng > 180) {
        console.log(`Skipping invalid position for unit ${pos.unit_id}: lat=${lat}, lng=${lng}`);
        // Mark as processed but don't create events
        await supabase
          .from('positions')
          .update({ processed: true })
          .eq('id', pos.id);
        continue;
      }

      // Process checkpoints
      if (checkpoints) {
        for (const checkpoint of checkpoints) {
          let isInside = false;

          // Check geometry type
          if (checkpoint.geometry_type === 'circle') {
            // Circular checkpoint
            const distance = haversine(
              parseFloat(pos.lat),
              parseFloat(pos.lng),
              parseFloat(checkpoint.lat),
              parseFloat(checkpoint.lng)
            );
            isInside = distance <= checkpoint.radius_m;
          } else if (checkpoint.geometry_type === 'polygon') {
            // Polygonal checkpoint
            const polygon = checkpoint.polygon?.coordinates?.[0] || checkpoint.polygon;
            if (polygon) {
              isInside = pointInPolygon(
                [parseFloat(pos.lng), parseFloat(pos.lat)],
                polygon
              );
            }
          }

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
            await createEventWithNotification(supabase, {
              unit_id: pos.unit_id,
              type: 'checkpoint_enter',
              ref_id: checkpoint.id,
              ref_type: 'checkpoint',
              lat: pos.lat,
              lng: pos.lng,
              ts: pos.ts,
              meta: { 
                checkpoint_name: checkpoint.name, 
                geometry_type: checkpoint.geometry_type 
              },
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
          } else if (!isInside && state?.is_inside) {
            // Exit event
            await createEventWithNotification(supabase, {
              unit_id: pos.unit_id,
              type: 'checkpoint_exit',
              ref_id: checkpoint.id,
              ref_type: 'checkpoint',
              lat: pos.lat,
              lng: pos.lng,
              ts: pos.ts,
              meta: { 
                checkpoint_name: checkpoint.name, 
                geometry_type: checkpoint.geometry_type 
              },
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
                await createEventWithNotification(supabase, {
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
        let currentSectorId = null;
        
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

            if (isInside) {
              currentSectorId = sector.id;
            }

            if (isInside && (!state || !state.is_inside)) {
              // Enter event
              await createEventWithNotification(supabase, {
                unit_id: pos.unit_id,
                type: 'sector_enter',
                ref_id: sector.id,
                ref_type: 'sector',
                lat: pos.lat,
                lng: pos.lng,
                ts: pos.ts,
                meta: { sector_name: sector.name },
              });

              // Check for sector transition
              const { data: allStates } = await supabase
                .from('unit_states')
                .select('*')
                .eq('unit_id', pos.unit_id)
                .eq('ref_type', 'sector')
                .eq('is_inside', true);

              if (allStates && allStates.length > 0) {
                const previousSector = allStates.find((s) => s.ref_id !== sector.id);
                if (previousSector) {
                  // Transition event
                  const { data: prevSectorData } = await supabase
                    .from('sectors')
                    .select('name')
                    .eq('id', previousSector.ref_id)
                    .single();

                  await createEventWithNotification(supabase, {
                    unit_id: pos.unit_id,
                    type: 'sector_transition',
                    ref_id: sector.id,
                    ref_type: 'sector',
                    lat: pos.lat,
                    lng: pos.lng,
                    ts: pos.ts,
                    meta: {
                      from_sector: prevSectorData?.name,
                      to_sector: sector.name,
                      from_sector_id: previousSector.ref_id,
                    },
                  });
                }
              }

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
            } else if (!isInside && state?.is_inside) {
              // Exit event
              await createEventWithNotification(supabase, {
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
            }
          } catch (err) {
            console.error(`Error processing sector ${sector.name}:`, err);
          }
        }

        // Check for deviation if in a sector with route
        if (currentSectorId) {
          const { data: route } = await supabase
            .from('routes')
            .select('*')
            .eq('sector_id', currentSectorId)
            .single();

          if (route && route.line_geometry) {
            // Calculate distance to route line (simple approximation)
            const coords = route.line_geometry.coordinates || route.line_geometry;
            let minDist = Infinity;

            for (const coord of coords) {
              const dist = haversine(
                parseFloat(pos.lat),
                parseFloat(pos.lng),
                coord[1],
                coord[0]
              );
              minDist = Math.min(minDist, dist);
            }

            // Deviation threshold: 300m
            if (minDist > 300) {
              // Check if we haven't recently created a deviation alert
              const { data: recentDev } = await supabase
                .from('events')
                .select('id')
                .eq('unit_id', pos.unit_id)
                .eq('type', 'deviation_alert')
                .gte('ts', new Date(Date.now() - 5 * 60000).toISOString())
                .single();

              if (!recentDev) {
                await createEventWithNotification(supabase, {
                  unit_id: pos.unit_id,
                  type: 'deviation_alert',
                  ref_id: currentSectorId,
                  ref_type: 'sector',
                  lat: pos.lat,
                  lng: pos.lng,
                  ts: pos.ts,
                  meta: {
                    distance_from_route_m: Math.round(minDist),
                    threshold_m: 300,
                  },
                });

                eventsCreated++;
              }
            }
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
