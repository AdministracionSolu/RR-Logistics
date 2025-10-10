import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Haversine formula to calculate distance between two GPS points in kilometers
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting odometer update...');

    // Get all active trucks with SPOT IDs
    const { data: trucks, error: trucksError } = await supabase
      .from('camiones')
      .select('id, spot_unit_id, kilometraje_total, updated_at')
      .eq('estado', 'activo')
      .not('spot_unit_id', 'is', null);

    if (trucksError) throw trucksError;

    let updatedCount = 0;

    for (const truck of trucks || []) {
      // Get all NEW positions since last update (only positions after truck's updated_at)
      const { data: positions, error: posError } = await supabase
        .from('positions')
        .select('lat, lng, ts')
        .eq('unit_id', truck.spot_unit_id)
        .neq('lat', -99999)
        .neq('lng', -99999)
        .gt('ts', truck.updated_at)
        .order('ts', { ascending: true });

      if (posError) {
        console.error(`Error getting positions for truck ${truck.id}:`, posError);
        continue;
      }

      if (!positions || positions.length === 0) {
        console.log(`No new positions for truck ${truck.id} since ${truck.updated_at}`);
        continue;
      }

      // Calculate total distance from all consecutive new positions
      let totalDistance = 0;
      for (let i = 1; i < positions.length; i++) {
        const segmentDistance = haversine(
          positions[i - 1].lat,
          positions[i - 1].lng,
          positions[i].lat,
          positions[i].lng
        );
        
        // Skip unrealistic individual segments (GPS jumps)
        if (segmentDistance > 0 && segmentDistance < 200) {
          totalDistance += segmentDistance;
        } else if (segmentDistance >= 200) {
          console.log(`Skipping GPS jump for truck ${truck.id}: ${segmentDistance.toFixed(2)} km`);
        }
      }

      // Only update if there's actual distance to add
      if (totalDistance > 0) {
        const newKilometraje = (truck.kilometraje_total || 0) + totalDistance;

        const { error: updateError } = await supabase
          .from('camiones')
          .update({ 
            kilometraje_total: newKilometraje,
            updated_at: new Date().toISOString()
          })
          .eq('id', truck.id);

        if (updateError) {
          console.error(`Error updating truck ${truck.id}:`, updateError);
        } else {
          console.log(`Updated truck ${truck.id}: +${totalDistance.toFixed(2)} km from ${positions.length} new positions (Total: ${newKilometraje.toFixed(2)} km)`);
          updatedCount++;
        }
      } else {
        console.log(`No valid distance to add for truck ${truck.id} (${positions.length} positions checked)`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated: updatedCount,
        message: `Updated odometer for ${updatedCount} trucks`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in update-odometer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
