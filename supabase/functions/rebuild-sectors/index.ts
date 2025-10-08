import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as turf from 'https://esm.sh/@turf/turf@7.0.0';
// @deno-types="npm:@types/osmtogeojson@3.0.0"
import osmtogeojson from 'npm:osmtogeojson@3.0.0-beta.5';

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

// Overpass API queries for real geometry
async function getOverpassData(query: string): Promise<any> {
  const url = 'https://overpass-api.de/api/interpreter';
  const response = await fetch(url, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.statusText}`);
  }
  
  return await response.json();
}

async function getUrbanBoundary(cityName: string): Promise<any> {
  const query = `
    [out:json][timeout:25];
    (
      relation["boundary"="administrative"]["name"="${cityName}"];
    );
    (._;>;);
    out body;
  `;
  
  const osmData = await getOverpassData(query);
  const geojson = osmtogeojson(osmData);
  
  // Find the polygon feature
  const polygonFeature = geojson.features.find((f: any) => 
    f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
  );
  
  return polygonFeature?.geometry || null;
}

async function getHighwayRoute(bbox: [number, number, number, number]): Promise<any> {
  const [minLat, minLon, maxLat, maxLon] = bbox;
  const query = `
    [out:json][timeout:25];
    (
      way["highway"~"^(primary|trunk|motorway)$"]["ref"~"^(CHIH 109|CHIH 110|MEX 24)$"](${minLat},${minLon},${maxLat},${maxLon});
    );
    (._;>;);
    out body;
  `;
  
  const osmData = await getOverpassData(query);
  const geojson = osmtogeojson(osmData);
  
  // Merge all LineStrings
  const lines = geojson.features
    .filter((f: any) => f.geometry.type === 'LineString')
    .map((f: any) => turf.lineString(f.geometry.coordinates));
  
  if (lines.length === 0) return null;
  
  // Union all lines
  let merged = lines[0];
  for (let i = 1; i < lines.length; i++) {
    try {
      merged = turf.union(turf.buffer(merged, 0.001), turf.buffer(lines[i], 0.001));
    } catch (e) {
      console.error('Error merging lines:', e);
    }
  }
  
  return merged?.geometry || null;
}

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
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body for parameters
    const body = await req.json().catch(() => ({}));
    const { 
      use_osm = true, 
      buffer_m = 250, 
      simplify_tolerance = 0.0001,
      mark_as_proposed = true 
    } = body;

    console.log('Starting sector reconstruction with params:', { use_osm, buffer_m, simplify_tolerance });
    const results = [];

    for (const sector of SECTOR_DEFINITIONS) {
      console.log(`Processing ${sector.name}...`);

      try {
        let polygon = null;
        let routeLine = null;
        let source = 'mapbox';

        if (use_osm) {
          // Try to get real geometry from OSM
          try {
            if (sector.name.includes('Ciudad')) {
              console.log('Getting urban boundary from OSM...');
              polygon = await getUrbanBoundary('Hidalgo del Parral');
              source = 'osm';
            } else if (sector.name.includes('San Francisco')) {
              console.log('Getting urban boundary from OSM...');
              polygon = await getUrbanBoundary('San Francisco del Oro');
              source = 'osm';
            } else if (sector.name.includes('Carretera')) {
              console.log('Getting highway route from OSM...');
              const routeGeom = await getHighwayRoute([26.70, -105.85, 27.10, -105.50]);
              if (routeGeom) {
                routeLine = routeGeom;
                const buffered = turf.buffer(turf.lineString(routeGeom.coordinates), buffer_m / 1000, { units: 'kilometers' });
                polygon = buffered?.geometry;
                source = 'osm';
              }
            }
          } catch (osmError) {
            console.error(`OSM fetch failed for ${sector.name}, falling back to Mapbox:`, osmError);
          }
        }

        // Fallback to Mapbox if OSM fails or not requested
        if (!polygon && mapboxToken) {
          console.log(`Using Mapbox for ${sector.name}...`);
          const route = await getMapboxRoute(sector.waypoints, mapboxToken);
          routeLine = route;
          polygon = createBufferedPolygon(route, buffer_m / 1000);
          source = 'mapbox';
        } else if (!polygon) {
          throw new Error(`Could not create geometry for ${sector.name}`);
        }

        // Simplify polygon to reduce size
        if (polygon && simplify_tolerance > 0) {
          try {
            const simplified = turf.simplify(turf.polygon(polygon.coordinates), {
              tolerance: simplify_tolerance,
              highQuality: true,
            });
            polygon = simplified.geometry;
          } catch (e) {
            console.log('Simplification failed, using original');
          }
        }

        // Insert as proposed version
        const { data: newSector, error } = await supabase
          .from('sectors')
          .insert({
            name: `${sector.name} (Propuesta)`,
            polygon: polygon,
            enabled: false,
            is_proposed: mark_as_proposed,
            source: source,
            buffer_m: buffer_m,
            color: sector.color,
          })
          .select()
          .single();

        if (error) {
          console.error(`Error inserting ${sector.name}:`, error);
          throw error;
        }

        // Save route line if available
        if (routeLine && newSector) {
          await supabase.from('routes').insert({
            sector_id: newSector.id,
            name: `${sector.name} Route`,
            line_geometry: routeLine,
          });
        }

        results.push({
          id: newSector.id,
          name: sector.name,
          color: sector.color,
          source: source,
          status: 'success',
        });

        console.log(`✓ ${sector.name} created as proposed`);
      } catch (error) {
        console.error(`Failed to process ${sector.name}:`, error);
        results.push({
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
