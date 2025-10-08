import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import SimulationControls from './SimulationControls';
import { useRouteSimulation } from '@/hooks/useRouteSimulation';

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

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = L.divIcon({
  html: '🚛',
  className: 'truck-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Helper: safely convert GeoJSON Polygon to Leaflet positions
const toPositions = (polygon: any): [number, number][] | null => {
  try {
    if (!polygon || polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates) || !Array.isArray(polygon.coordinates[0])) return null;
    const ring = polygon.coordinates[0].filter((coord: any) =>
      Array.isArray(coord) &&
      coord.length >= 2 &&
      Number.isFinite(Number(coord[0])) &&
      Number.isFinite(Number(coord[1]))
    );
    if (ring.length < 3) return null;
    return ring.map((coord: number[]) => [Number(coord[1]), Number(coord[0])] as [number, number]);
  } catch {
    return null;
  }
};


const FleetMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const layersRef = useRef<L.Layer[]>([]);
  
  const [trucks, setTrucks] = useState<TruckLocation[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [mapCenter] = useState<[number, number]>([19.4326, -99.1332]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(mapCenter, 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const {
    isPlaying,
    routePoints,
    currentPointIndex,
    selectedTruck,
    speed,
    loadTruckRoute,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    setSpeed: setSimSpeed,
    cleanup
  } = useRouteSimulation();

  useEffect(() => {
    loadTrucks();
    loadSectors();
    loadCheckpoints();

    const trucksChannel = supabase
      .channel('ubicaciones_tiempo_real_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ubicaciones_tiempo_real' }, () => {
        loadTrucks();
      })
      .subscribe();

    const sectorsChannel = supabase
      .channel('sectors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sectors' }, () => {
        loadSectors();
      })
      .subscribe();

    const checkpointsChannel = supabase
      .channel('checkpoints_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkpoints' }, () => {
        loadCheckpoints();
      })
      .subscribe();

    return () => {
      trucksChannel.unsubscribe();
      sectorsChannel.unsubscribe();
      checkpointsChannel.unsubscribe();
      cleanup();
    };
  }, [cleanup]);

  const loadSectors = async () => {
    try {
      const { data } = await supabase
        .from('sectors')
        .select('*')
        .eq('enabled', true);

      setSectors(data || []);
    } catch (error) {
      console.error('Error loading sectors:', error);
    }
  };

  const loadCheckpoints = async () => {
    try {
      const { data } = await supabase
        .from('checkpoints')
        .select('*')
        .eq('enabled', true);

      setCheckpoints(data || []);
    } catch (error) {
      console.error('Error loading checkpoints:', error);
    }
  };

  const loadTrucks = async () => {
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

      // Center map on first truck if available
      if (trucksWithLocations.length > 0 && trucksWithLocations[0].lat && trucksWithLocations[0].lng && mapInstanceRef.current) {
        mapInstanceRef.current.setView([trucksWithLocations[0].lat, trucksWithLocations[0].lng], 10);
      }
    } catch (error) {
      console.error('Error loading trucks:', error);
    }
  };

  const startTruckSimulation = async (truck: TruckLocation) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    await loadTruckRoute(truck.id, truck.tag_id, startDate, endDate);
    startSimulation();
  };

  // Update map layers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing layers
    layersRef.current.forEach(layer => layer.remove());
    markersRef.current.forEach(marker => marker.remove());
    layersRef.current = [];
    markersRef.current = [];

    // Add sectors
    sectors.forEach(sector => {
      const positions = toPositions(sector.polygon);
      if (!positions) return;
      
      const polygon = L.polygon(positions, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(mapInstanceRef.current!);
      
      polygon.bindPopup(`<strong>${sector.name}</strong><br/>Sector (Ruta de Camiones)`);
      layersRef.current.push(polygon);
    });

    // Add checkpoints
    checkpoints.forEach(checkpoint => {
      if (checkpoint.geometry_type === 'circle' && checkpoint.lat && checkpoint.lng) {
        const circle = L.circle([checkpoint.lat, checkpoint.lng], {
          radius: checkpoint.radius_m || 100,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.2,
        }).addTo(mapInstanceRef.current!);
        
        circle.bindPopup(`<strong>${checkpoint.name}</strong><br/>Checkpoint Circular<br/>Radio: ${checkpoint.radius_m}m`);
        layersRef.current.push(circle);
      } else if (checkpoint.geometry_type === 'polygon') {
        const positions = toPositions(checkpoint.polygon);
        if (!positions) return;
        
        const polygon = L.polygon(positions, {
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.2,
        }).addTo(mapInstanceRef.current!);
        
        polygon.bindPopup(`<strong>${checkpoint.name}</strong><br/>Checkpoint Poligonal`);
        layersRef.current.push(polygon);
      }
    });

    // Add truck trails
    trucks.forEach(truck => {
      if (!truck.lat || !truck.lng || !truck.trail || truck.trail.length <= 1) return;
      
      const trail = L.polyline(truck.trail.map(p => [p.lat, p.lng] as L.LatLngExpression), {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
      }).addTo(mapInstanceRef.current!);
      
      layersRef.current.push(trail);
    });

    // Add truck markers
    trucks.forEach(truck => {
      if (!truck.lat || !truck.lng) return;
      
      const marker = L.marker([truck.lat, truck.lng], { icon: truckIcon })
        .addTo(mapInstanceRef.current!);
      
      const popupContent = `
        <div style="min-width: 200px;">
          <strong style="font-size: 1.1em;">${truck.placas}</strong>
          <div style="margin-top: 8px; font-size: 0.9em;">
            <p><strong>Modelo:</strong> ${truck.modelo || 'N/A'}</p>
            <p><strong>TAG:</strong> ${truck.tag_id}</p>
            <p><strong>Última caseta:</strong> ${truck.caseta_nombre || 'N/A'}</p>
            <p><strong>Último cruce:</strong> ${truck.ultimo_cruce_timestamp ? new Date(truck.ultimo_cruce_timestamp).toLocaleString('es-MX') : 'Sin cruces recientes'}</p>
            <p><strong>Saldo:</strong> $${truck.saldo_actual?.toFixed(2) || '0.00'}</p>
            <p><strong>Gasto hoy:</strong> $${truck.gasto_dia_actual?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  }, [trucks, sectors, checkpoints]);

  // Update simulation route
  useEffect(() => {
    if (!mapInstanceRef.current || !routePoints || routePoints.length === 0) return;

    // Remove old simulation layers
    const simLayers = layersRef.current.filter(l => (l as any)._isSimulation);
    simLayers.forEach(l => l.remove());
    layersRef.current = layersRef.current.filter(l => !(l as any)._isSimulation);

    // Add completed route
    const completedRoute = L.polyline(
      routePoints.slice(0, currentPointIndex + 1).map(p => [p.lat, p.lng] as L.LatLngExpression),
      { color: '#22c55e', weight: 3 }
    ).addTo(mapInstanceRef.current);
    (completedRoute as any)._isSimulation = true;
    layersRef.current.push(completedRoute);

    // Add pending route
    const pendingRoute = L.polyline(
      routePoints.slice(currentPointIndex).map(p => [p.lat, p.lng] as L.LatLngExpression),
      { color: '#94a3b8', weight: 2, dashArray: '5, 5' }
    ).addTo(mapInstanceRef.current);
    (pendingRoute as any)._isSimulation = true;
    layersRef.current.push(pendingRoute);
  }, [routePoints, currentPointIndex]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: '400px' }} />

      {selectedTruck && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <SimulationControls
            selectedTruck={selectedTruck}
            isPlaying={isPlaying}
            progress={(currentPointIndex / (routePoints?.length || 1)) * 100}
            speed={speed}
            onPlay={startSimulation}
            onPause={pauseSimulation}
            onStop={stopSimulation}
            onRestart={stopSimulation}
            onSpeedChange={setSimSpeed}
            startDate={undefined}
            endDate={undefined}
            onDateRangeChange={() => {}}
            onReloadRoute={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default FleetMap;
