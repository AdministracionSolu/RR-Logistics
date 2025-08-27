import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { supabase } from '@/integrations/supabase/client';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TruckLocation {
  id: string;
  placas: string;
  modelo: string;
  tag_id: string;
  saldo_disponible: number;
  credito_disponible: number;
  lat?: number;
  lng?: number;
  lastCaseta?: string;
  lastCarretera?: string;
  lastRuta?: string;
  lastTime?: string;
  trail?: Array<{ lat: number; lng: number; time: string; caseta: string }>;
}

const FleetMap = () => {
  const [trucks, setTrucks] = useState<TruckLocation[]>([]);

  useEffect(() => {
    loadTrucks();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('ubicaciones-tiempo-real')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'toll_events'
      }, () => {
        loadTrucks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadTrucks = async () => {
    try {
      // Get active trucks (use correct field name)
      const { data: camiones } = await supabase
        .from('camiones')
        .select('*')
        .eq('estado', 'activo');

      if (!camiones) return;

      const trucksWithLocation: TruckLocation[] = [];

      for (const camion of camiones) {
        const truck: TruckLocation = {
          id: camion.id,
          placas: camion.placas,
          modelo: camion.modelo,
          tag_id: camion.tag_id,
          saldo_disponible: camion.saldo_actual || 0,
          credito_disponible: 0, // No hay campo de crédito en la tabla
        };

        // Get latest toll event for this truck (simplified query)
        const { data: latestEvent } = await supabase
          .from('toll_events')
          .select('fecha_hora, caseta_nombre, caseta_id')
          .eq('tag_id', camion.tag_id)
          .order('fecha_hora', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get caseta coordinates if we have a caseta_id (usar solo campos que existen)
        if (latestEvent?.caseta_id) {
          const { data: casetaData } = await supabase
            .from('casetas_autopista')
            .select('lat, lng, nombre')
            .eq('id', latestEvent.caseta_id)
            .maybeSingle();

          if (casetaData?.lat && casetaData?.lng) {
            truck.lat = casetaData.lat;
            truck.lng = casetaData.lng;
            truck.lastCaseta = casetaData.nombre;
            truck.lastCarretera = latestEvent.caseta_nombre; // Usar el nombre de la caseta del evento
            truck.lastRuta = ''; // Sin dato de ruta
            truck.lastTime = latestEvent.fecha_hora;
          }
        }

        // Get trail (last 5 events for desktop)
        const { data: trailEvents } = await supabase
          .from('toll_events')
          .select('fecha_hora, caseta_nombre, caseta_id')
          .eq('tag_id', camion.tag_id)
          .order('fecha_hora', { ascending: false })
          .limit(5);

        // Get coordinates for trail points
        if (trailEvents) {
          const trailData = [];
          for (const event of trailEvents) {
            if (event.caseta_id) {
              const { data: coords } = await supabase
                .from('casetas_autopista')
                .select('lat, lng')
                .eq('id', event.caseta_id)
                .maybeSingle();
              if (coords?.lat && coords?.lng) {
                trailData.push({
                  lat: coords.lat,
                  lng: coords.lng,
                  time: event.fecha_hora,
                  caseta: event.caseta_nombre
                });
              }
            }
          }
          truck.trail = trailData;
        }

        trucksWithLocation.push(truck);
      }

      setTrucks(trucksWithLocation);
    } catch (error) {
      console.error('Error loading trucks:', error);
    }
  };

  const trucksWithCoords = trucks.filter(truck => truck.lat && truck.lng);

  // Mexico center coordinates
  const mexicoCenter: [number, number] = [23.6345, -102.5528];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mexicoCenter}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render truck markers */}
        {trucksWithCoords.map((truck) => (
          <div key={truck.id}>
            <Marker position={[truck.lat!, truck.lng!]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{truck.placas}</div>
                  <div className="text-muted-foreground">{truck.modelo}</div>
                  {truck.lastCaseta && <div className="mt-1">{truck.lastCaseta}</div>}
                  {truck.lastCarretera && <div className="text-xs">{truck.lastCarretera}</div>}
                  {truck.lastTime && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(truck.lastTime).toLocaleString('es-MX')}
                    </div>
                  )}
                  <div className="mt-2 text-xs">
                    <div>Saldo: ${truck.saldo_disponible.toLocaleString()}</div>
                    <div>Crédito: ${truck.credito_disponible.toLocaleString()}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
            
            {/* Render trail */}
            {truck.trail && truck.trail.length > 1 && (
              <Polyline
                positions={truck.trail.map(point => [point.lat, point.lng])}
                color="#3b82f6"
                weight={2}
                opacity={0.6}
              />
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default FleetMap;