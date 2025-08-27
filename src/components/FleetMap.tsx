import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface FleetMapProps {
  mapboxToken: string;
}

interface TruckLocation {
  id: string;
  placas: string;
  modelo: string;
  tag_id: string;
  saldo_actual: number;
  gasto_dia_actual: number;
  ultimo_cruce_timestamp: string | null;
  lat?: number;
  lng?: number;
  caseta_nombre?: string;
  trail?: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    caseta_nombre: string;
  }>;
}

const FleetMap = ({ mapboxToken }: FleetMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [trucks, setTrucks] = useState<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-99.1332, 19.4326], // Ciudad de México
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cargar camiones
    loadTrucks();

    // Suscribirse a actualizaciones en tiempo real
    const subscription = supabase
      .channel('ubicaciones_tiempo_real')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ubicaciones_tiempo_real' },
        (payload) => {
          console.log('Actualización de ubicación:', payload);
          loadTrucks();
        }
      )
      .subscribe();

    return () => {
      map.current?.remove();
      subscription.unsubscribe();
    };
  }, [mapboxToken]);

  const loadTrucks = async () => {
    try {
      // Get trucks with their last toll crossing location
      const { data: trucksData, error } = await supabase
        .from('camiones')
        .select(`
          id,
          placas,
          modelo,
          tag_id,
          saldo_actual,
          gasto_dia_actual,
          ultimo_cruce_timestamp,
          estado
        `)
        .eq('estado', 'activo')
        .not('tag_id', 'is', null);

      if (error) {
        console.error('Error cargando camiones:', error);
        return;
      }

      if (!trucksData) return;

      // Get latest toll events for each truck with caseta location
      const trucksWithLocations: TruckLocation[] = [];

      for (const truck of trucksData) {
        // Get latest toll event with caseta coordinates
        const { data: latestEvent } = await supabase
          .from('toll_events')
          .select(`
            fecha_hora,
            caseta_nombre,
            casetas_autopista (
              lat,
              lng,
              nombre
            )
          `)
          .eq('tag_id', truck.tag_id)
          .order('fecha_hora', { ascending: false })
          .limit(1)
          .single();

        // Get trail (last 5 toll events of today)
        const { data: trailData } = await supabase
          .from('toll_events')
          .select(`
            fecha_hora,
            caseta_nombre,
            casetas_autopista (
              lat,
              lng
            )
          `)
          .eq('tag_id', truck.tag_id)
          .gte('fecha_hora', new Date().toISOString().split('T')[0])
          .order('fecha_hora', { ascending: false })
          .limit(5);

        const truckLocation: TruckLocation = {
          ...truck,
          lat: latestEvent?.casetas_autopista?.lat,
          lng: latestEvent?.casetas_autopista?.lng,
          caseta_nombre: latestEvent?.caseta_nombre,
          trail: trailData?.map(event => ({
            lat: event.casetas_autopista?.lat || 0,
            lng: event.casetas_autopista?.lng || 0,
            timestamp: event.fecha_hora,
            caseta_nombre: event.caseta_nombre
          })).filter(point => point.lat && point.lng) || []
        };

        if (truckLocation.lat && truckLocation.lng) {
          trucksWithLocations.push(truckLocation);
        }
      }

      setTrucks(trucksWithLocations);
      
      // Update map markers and trails
      if (map.current) {
        updateMapDisplay(trucksWithLocations);
      }

    } catch (error) {
      console.error('Error loading trucks:', error);
    }
  };

  const updateMapDisplay = (trucksData: TruckLocation[]) => {
    if (!map.current) return;

    // Clear existing markers and sources
    const existingMarkers = document.querySelectorAll('.truck-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Remove existing trail sources and layers
    trucksData.forEach(truck => {
      const trailSourceId = `trail-${truck.id}`;
      if (map.current!.getSource(trailSourceId)) {
        map.current!.removeLayer(`${trailSourceId}-line`);
        map.current!.removeSource(trailSourceId);
      }
    });

    trucksData.forEach((truck) => {
      if (truck.lat && truck.lng) {
        // Create truck marker
        const el = document.createElement('div');
        el.className = 'truck-marker';
        el.innerHTML = '🚛';
        el.style.fontSize = '28px';
        el.style.cursor = 'pointer';
        el.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))';

        // Enhanced popup with toll data
        const lastCrossing = truck.ultimo_cruce_timestamp 
          ? new Date(truck.ultimo_cruce_timestamp).toLocaleString('es-MX')
          : 'Sin cruces recientes';

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-bold text-lg">${truck.placas}</h3>
              <p><strong>Modelo:</strong> ${truck.modelo || 'N/A'}</p>
              <p><strong>TAG:</strong> ${truck.tag_id}</p>
              <p><strong>Última caseta:</strong> ${truck.caseta_nombre || 'N/A'}</p>
              <p><strong>Último cruce:</strong> ${lastCrossing}</p>
              <p><strong>Saldo:</strong> $${truck.saldo_actual?.toFixed(2) || '0.00'}</p>
              <p><strong>Gasto hoy:</strong> $${truck.gasto_dia_actual?.toFixed(2) || '0.00'}</p>
            </div>
          `);

        new mapboxgl.Marker(el)
          .setLngLat([truck.lng, truck.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add trail if available
        if (truck.trail && truck.trail.length > 1) {
          const trailCoordinates = truck.trail.map(point => [point.lng, point.lat]);
          
          const trailSourceId = `trail-${truck.id}`;
          
          // Add trail source
          map.current!.addSource(trailSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: trailCoordinates
              }
            }
          });

          // Add trail line layer
          map.current!.addLayer({
            id: `${trailSourceId}-line`,
            type: 'line',
            source: trailSourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 3,
              'line-opacity': 0.7,
              'line-gradient': [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0, '#ef4444',
                0.5, '#f59e0b',
                1, '#10b981'
              ]
            }
          });
        }
      }
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default FleetMap;