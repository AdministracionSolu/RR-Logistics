import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface FleetMapProps {
  mapboxToken: string;
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
    const { data, error } = await supabase
      .from('camiones')
      .select(`
        *,
        ubicaciones_tiempo_real (
          lat,
          lng,
          velocidad,
          timestamp
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error cargando camiones:', error);
      return;
    }

    setTrucks(data || []);
    
    // Agregar marcadores al mapa
    if (map.current && data) {
      // Limpiar marcadores existentes
      const existingMarkers = document.querySelectorAll('.truck-marker');
      existingMarkers.forEach(marker => marker.remove());

      data.forEach((truck) => {
        if (truck.ubicacion_actual_lat && truck.ubicacion_actual_lng) {
          const el = document.createElement('div');
          el.className = 'truck-marker';
          el.innerHTML = '🚛';
          el.style.fontSize = '24px';
          el.style.cursor = 'pointer';

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${truck.placas}</h3>
                <p>Modelo: ${truck.modelo || 'N/A'}</p>
                <p>Velocidad: ${truck.velocidad_actual || 0} km/h</p>
                <p>Combustible: ${truck.combustible_porcentaje || 0}%</p>
                <p>Estado: ${truck.estado}</p>
              </div>
            `);

          new mapboxgl.Marker(el)
            .setLngLat([truck.ubicacion_actual_lng, truck.ubicacion_actual_lat])
            .setPopup(popup)
            .addTo(map.current!);
        }
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default FleetMap;