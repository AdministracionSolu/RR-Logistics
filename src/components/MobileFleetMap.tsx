import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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

interface MobileFleetMapProps {
  mapboxToken: string;
}

const MobileFleetMap = ({ mapboxToken }: MobileFleetMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [trucks, setTrucks] = useState<TruckLocation[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<TruckLocation | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-99.1332, 19.4326], // Ciudad de México
      zoom: 10,
      // Mobile optimizations
      touchZoomRotate: true,
      touchPitch: false,
      doubleClickZoom: true,
    });

    // Mobile-friendly navigation control
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }), 
      'top-right'
    );

    // Load trucks data
    loadTrucks();

    // Real-time subscription
    const subscription = supabase
      .channel('ubicaciones_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'toll_events' },
        () => loadTrucks()
      )
      .subscribe();

    return () => {
      map.current?.remove();
      subscription.unsubscribe();
    };
  }, [mapboxToken]);

  const loadTrucks = async () => {
    setLoading(true);
    try {
      const { data: trucksData } = await supabase
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

      if (!trucksData) return;

      const trucksWithLocations: TruckLocation[] = [];

      for (const truck of trucksData) {
        // Get latest toll event (simplified query without joins)
        const { data: latestEvent } = await supabase
          .from('toll_events')
          .select('fecha_hora, caseta_nombre, caseta_id')
          .eq('tag_id', truck.tag_id)
          .order('fecha_hora', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get caseta coordinates if we have a caseta_id
        let casetaCoords = null;
        if (latestEvent?.caseta_id) {
          const { data: casetaData } = await supabase
            .from('casetas_autopista')
            .select('lat, lng, nombre')
            .eq('id', latestEvent.caseta_id)
            .single();
          casetaCoords = casetaData;
        }

        // Get trail (last 3 events for mobile simplicity)
        const { data: trailEvents } = await supabase
          .from('toll_events')
          .select('fecha_hora, caseta_nombre, caseta_id')
          .eq('tag_id', truck.tag_id)
          .gte('fecha_hora', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('fecha_hora', { ascending: false })
          .limit(3);

        // Get coordinates for trail points
        const trailData = [];
        if (trailEvents) {
          for (const event of trailEvents) {
            if (event.caseta_id) {
              const { data: coords } = await supabase
                .from('casetas_autopista')
                .select('lat, lng')
                .eq('id', event.caseta_id)
                .single();
              if (coords?.lat && coords?.lng) {
                trailData.push({
                  ...event,
                  ...coords
                });
              }
            }
          }
        }

        const truckLocation: TruckLocation = {
          ...truck,
          lat: casetaCoords?.lat,
          lng: casetaCoords?.lng,
          caseta_nombre: latestEvent?.caseta_nombre || casetaCoords?.nombre,
          trail: trailData.map(event => ({
            lat: event.lat || 0,
            lng: event.lng || 0,
            timestamp: event.fecha_hora,
            caseta_nombre: event.caseta_nombre
          })).filter(point => point.lat && point.lng)
        };

        if (truckLocation.lat && truckLocation.lng) {
          trucksWithLocations.push(truckLocation);
        }
      }

      setTrucks(trucksWithLocations);
      updateMapDisplay(trucksWithLocations);
    } catch (error) {
      console.error('Error loading trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMapDisplay = (trucksData: TruckLocation[]) => {
    if (!map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.truck-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Clear existing trail layers
    trucksData.forEach(truck => {
      const trailSourceId = `trail-${truck.id}`;
      if (map.current!.getSource(trailSourceId)) {
        map.current!.removeLayer(`${trailSourceId}-line`);
        map.current!.removeSource(trailSourceId);
      }
    });

    trucksData.forEach((truck) => {
      if (truck.lat && truck.lng) {
        // Create larger markers for mobile
        const el = document.createElement('div');
        el.className = 'truck-marker cursor-pointer flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-lg border-2 border-white';
        el.innerHTML = `<span class="text-white text-sm font-bold">${truck.placas.slice(-2)}</span>`;
        
        // Mobile tap handler
        el.addEventListener('click', () => {
          setSelectedTruck(truck);
          setIsSheetOpen(true);
        });

        new mapboxgl.Marker(el)
          .setLngLat([truck.lng, truck.lat])
          .addTo(map.current!);

        // Add trail for mobile (simplified)
        if (truck.trail && truck.trail.length > 1) {
          const trailCoordinates = truck.trail.map(point => [point.lng, point.lat]);
          const trailSourceId = `trail-${truck.id}`;
          
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
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
        }
      }
    });

    // Fit bounds to show all trucks
    if (trucksData.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      trucksData.forEach(truck => {
        if (truck.lat && truck.lng) {
          bounds.extend([truck.lng, truck.lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 12
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const recenterMap = () => {
    if (trucks.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      trucks.forEach(truck => {
        if (truck.lat && truck.lng) {
          bounds.extend([truck.lng, truck.lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 12
        });
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Full screen map */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Mobile controls overlay */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-background/90 backdrop-blur"
          onClick={recenterMap}
        >
          <Navigation className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-background/90 backdrop-blur"
          onClick={loadTrucks}
          disabled={loading}
        >
          <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Active trucks count */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{trucks.length}</span>
        </div>
      </div>

      {/* Mobile truck details sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>{selectedTruck?.placas}</SheetTitle>
            <SheetDescription>
              Información del vehículo y último cruce
            </SheetDescription>
          </SheetHeader>
          
          {selectedTruck && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">TAG ID</p>
                  <p className="font-medium">{selectedTruck.tag_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modelo</p>
                  <p className="font-medium">{selectedTruck.modelo}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Última caseta</p>
                <p className="font-medium">{selectedTruck.caseta_nombre || 'Sin datos'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo actual</p>
                  <p className={`font-bold text-lg ${selectedTruck.saldo_actual < 100 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(selectedTruck.saldo_actual)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gasto hoy</p>
                  <p className="font-bold text-lg text-red-600">
                    {formatCurrency(selectedTruck.gasto_dia_actual)}
                  </p>
                </div>
              </div>
              
              {selectedTruck.ultimo_cruce_timestamp && (
                <div>
                  <p className="text-sm text-muted-foreground">Último cruce</p>
                  <p className="font-medium">
                    {new Date(selectedTruck.ultimo_cruce_timestamp).toLocaleString('es-MX')}
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFleetMap;