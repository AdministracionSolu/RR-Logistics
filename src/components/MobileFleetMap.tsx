import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, RefreshCw, Crosshair } from 'lucide-react';
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

const MobileFleetMap = () => {
  const [trucks, setTrucks] = useState<TruckLocation[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<TruckLocation | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    loadTrucks();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('toll-events')
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

        // Get trail (last 3 events for mobile simplicity)
        const { data: trailEvents } = await supabase
          .from('toll_events')
          .select('fecha_hora, caseta_nombre, caseta_id')
          .eq('tag_id', camion.tag_id)
          .order('fecha_hora', { ascending: false })
          .limit(3);

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

  const handleMarkerClick = (truck: TruckLocation) => {
    setSelectedTruck(truck);
    setSheetOpen(true);
  };

  const recenterMap = () => {
    if (mapRef && trucksWithCoords.length > 0) {
      const bounds = new LatLngBounds(
        trucksWithCoords.map(truck => [truck.lat!, truck.lng!])
      );
      mapRef.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  // Mexico center coordinates
  const mexicoCenter: [number, number] = [23.6345, -102.5528];

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mexicoCenter}
        zoom={6}
        className="h-full w-full"
        ref={setMapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render truck markers */}
        {trucksWithCoords.map((truck) => (
          <div key={truck.id}>
            <Marker
              position={[truck.lat!, truck.lng!]}
              eventHandlers={{
                click: () => handleMarkerClick(truck)
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{truck.placas}</strong><br />
                  {truck.lastCaseta}<br />
                  {truck.lastCarretera}
                </div>
              </Popup>
            </Marker>
            
            {/* Render trail */}
            {truck.trail && truck.trail.length > 1 && (
              <Polyline
                positions={truck.trail.map(point => [point.lat, point.lng])}
                color="#3b82f6"
                weight={3}
                opacity={0.7}
              />
            )}
          </div>
        ))}
      </MapContainer>

      {/* Mobile controls overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={recenterMap}
          className="shadow-lg"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={loadTrucks}
          className="shadow-lg"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Truck count overlay */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{trucksWithCoords.length} camiones activos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Truck details sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[60vh]">
          {selectedTruck && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedTruck.placas}
                </SheetTitle>
                <SheetDescription>
                  {selectedTruck.modelo}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Saldo disponible</div>
                      <div className="text-lg font-semibold text-green-600">
                        ${selectedTruck.saldo_disponible.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Crédito disponible</div>
                      <div className="text-lg font-semibold text-blue-600">
                        ${selectedTruck.credito_disponible.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedTruck.lastCaseta && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Última caseta</span>
                          <Badge variant="outline">{selectedTruck.lastRuta}</Badge>
                        </div>
                        <div className="font-medium">{selectedTruck.lastCaseta}</div>
                        <div className="text-sm text-muted-foreground">{selectedTruck.lastCarretera}</div>
                        {selectedTruck.lastTime && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(selectedTruck.lastTime).toLocaleString('es-MX')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="text-xs text-muted-foreground">
                  ID Tag: {selectedTruck.tag_id}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFleetMap;