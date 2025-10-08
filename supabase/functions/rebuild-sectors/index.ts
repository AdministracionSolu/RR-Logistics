import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as turf from 'https://esm.sh/@turf/turf@7.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SectorDefinition {
  id: number;
  name: string;
  color: string;
  waypoints: [number, number][]; // [lng, lat] pairs
  bufferMeters: number;
}

const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: 1,
    name: "Sector Ciudad",
    color: "#4ABFF2",
    waypoints: [
      [-105.678, 26.940],
      [-105.665, 26.930],
      [-105.660, 26.920],
      [-105.655, 26.915],
      [-105.650, 26.905],
    ],
    bufferMeters: 0.25, // 250m
  },
  {
    id: 2,
    name: "Sector Carretera",
    color: "#E54848",
    waypoints: [
      [-105.650, 26.905],
      [-105.665, 26.890],
      [-105.680, 26.875],
      [-105.695, 26.860],
      [-105.710, 26.845],
      [-105.725, 26.830],
    ],
    bufferMeters: 0.25,
  },
  {
    id: 3,
    name: "Sector San Francisco del Oro",
    color: "#4ADE80",
    waypoints: [
      [-105.725, 26.830],
      [-105.722, 26.820],
      [-105.720, 26.812],
      [-105.718, 26.808],
    ],
    bufferMeters: 0.15, // 150m (ciudad más pequeña)
  },
  {
    id: 4,
    name: "Sector Mina",
    color: "#A855F7",
    waypoints: [
      [-105.718, 26.808],
      [-105.730, 26.795],
      [-105.740, 26.790],
      [-105.745, 26.785],
    ],
    bufferMeters: 0.2, // 200m
  },
];

async function getMapboxRoute(waypoints: [number, number][], accessToken: string) {
  const coordinates = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${accessToken}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.routes[0].geometry;
}

function createBufferedPolygon(lineString: any, bufferKm: number) {
  const line = turf.lineString(lineString.coordinates);
  const buffered = turf.buffer(line, bufferKm, { units: 'kilometers' });
  return buffered?.geometry || null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN');

    if (!mapboxToken) {
      throw new Error('MAPBOX_ACCESS_TOKEN not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting sector reconstruction...');
    const results = [];

    for (const sector of SECTOR_DEFINITIONS) {
      console.log(`Processing ${sector.name}...`);

      try {
        // Get route from Mapbox
        const route = await getMapboxRoute(sector.waypoints, mapboxToken);
        console.log(`Got route for ${sector.name}, creating buffer...`);

        // Create buffered polygon
        const polygon = createBufferedPolygon(route, sector.bufferMeters);

        if (!polygon) {
          throw new Error(`Failed to create polygon for ${sector.name}`);
        }

        // Update sector in database
        const { error } = await supabase
          .from('sectors')
          .upsert({
            id: sector.id,
            name: sector.name,
            polygon: polygon,
            enabled: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error(`Error updating ${sector.name}:`, error);
          throw error;
        }

        results.push({
          id: sector.id,
          name: sector.name,
          color: sector.color,
          status: 'success',
        });

        console.log(`✓ ${sector.name} updated successfully`);
      } catch (error) {
        console.error(`Failed to process ${sector.name}:`, error);
        results.push({
          id: sector.id,
          name: sector.name,
          status: 'error',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sector reconstruction complete',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error rebuilding sectors:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
