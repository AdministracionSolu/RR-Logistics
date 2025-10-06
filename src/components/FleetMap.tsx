import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useRouteSimulation } from '@/hooks/useRouteSimulation';
import SimulationControls from '@/components/SimulationControls';
import { drawCheckpoints } from '@/components/gestion/drawCheckpointsHelper';

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
  const [sectors, setSectors] = useState<any[]>([]);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [selectedTruckMarker, setSelectedTruckMarker] = useState<mapboxgl.Marker | null>(null);
  const [simulationMarker, setSimulationMarker] = useState<mapboxgl.Marker | null>(null);
  const [simulationStartDate, setSimulationStartDate] = useState<Date | undefined>(undefined);
  const [simulationEndDate, setSimulationEndDate] = useState<Date | undefined>(undefined);
  
  const simulation = useRouteSimulation();

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

    // Load sectors and checkpoints once map style is loaded
    map.current.on('load', () => {
      loadSectors();
      loadCheckpoints();
    });

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

    // Subscribe to sectors changes
    const sectorsSubscription = supabase
      .channel('sectors_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sectors' },
        () => {
          loadSectors();
        }
      )
      .subscribe();

    // Subscribe to checkpoints changes
    const checkpointsSubscription = supabase
      .channel('checkpoints_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'checkpoints' },
        () => {
          loadCheckpoints();
        }
      )
      .subscribe();

    return () => {
      map.current?.remove();
      subscription.unsubscribe();
      sectorsSubscription.unsubscribe();
      checkpointsSubscription.unsubscribe();
      simulation.cleanup();
    };
  }, [mapboxToken]);

  const loadSectors = async () => {
    try {
      const { data: sectorsData, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('enabled', true);

      if (error) {
        console.error('Error loading sectors:', error);
        return;
      }

      setSectors(sectorsData || []);
      
      // Draw sectors on map
      if (map.current && sectorsData) {
        drawSectors(sectorsData);
      }
    } catch (error) {
      console.error('Error loading sectors:', error);
    }
  };

  const loadCheckpoints = async () => {
    try {
      const { data: checkpointsData, error } = await supabase
        .from('checkpoints')
        .select('*')
        .eq('enabled', true);

      if (error) {
        console.error('Error loading checkpoints:', error);
        return;
      }

      setCheckpoints(checkpointsData || []);
      
      // Draw checkpoints on map
      if (map.current && checkpointsData) {
        drawCheckpoints(map.current, checkpointsData);
      }
    } catch (error) {
      console.error('Error loading checkpoints:', error);
    }
  };

  const drawSectors = (sectorsData: any[]) => {
    if (!map.current) return;

    // Remove existing sector layers
    sectorsData.forEach(sector => {
      const fillLayerId = `sector-fill-${sector.id}`;
      const outlineLayerId = `sector-outline-${sector.id}`;
      const labelLayerId = `sector-label-${sector.id}`;
      
      if (map.current!.getLayer(fillLayerId)) {
        map.current!.removeLayer(fillLayerId);
      }
      if (map.current!.getLayer(outlineLayerId)) {
        map.current!.removeLayer(outlineLayerId);
      }
      if (map.current!.getLayer(labelLayerId)) {
        map.current!.removeLayer(labelLayerId);
      }
      if (map.current!.getSource(`sector-${sector.id}`)) {
        map.current!.removeSource(`sector-${sector.id}`);
      }
    });

    // Draw each sector
    sectorsData.forEach(sector => {
      const sourceId = `sector-${sector.id}`;
      
      // Add source
      map.current!.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: sector.name,
            id: sector.id
          },
          geometry: sector.polygon
        }
      });

      // Add fill layer (semi-transparent)
      map.current!.addLayer({
        id: `sector-fill-${sector.id}`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.15
        }
      });

      // Add outline layer
      map.current!.addLayer({
        id: `sector-outline-${sector.id}`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#2563eb',
          'line-width': 2,
          'line-opacity': 0.8
        }
      });

      // Calculate center point for label
      const coordinates = sector.polygon.coordinates[0];
      const centerLng = coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coordinates.length;
      const centerLat = coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coordinates.length;

      // Add label source
      map.current!.addSource(`sector-label-${sector.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: sector.name
          },
          geometry: {
            type: 'Point',
            coordinates: [centerLng, centerLat]
          }
        }
      });

      // Add label layer
      map.current!.addLayer({
        id: `sector-label-${sector.id}`,
        type: 'symbol',
        source: `sector-label-${sector.id}`,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-offset': [0, 0],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#1e40af',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      });

      // Add click handler for popup
      map.current!.on('click', `sector-fill-${sector.id}`, (e) => {
        const coordinates = [centerLng, centerLat] as [number, number];
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-lg">${sector.name}</h3>
              <p class="text-sm text-gray-600">Sector (Ruta de Camiones)</p>
              <p class="text-xs mt-2">Define la ruta operativa de los camiones</p>
            </div>
          `)
          .addTo(map.current!);
      });

      // Change cursor on hover
      map.current!.on('mouseenter', `sector-fill-${sector.id}`, () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      
      map.current!.on('mouseleave', `sector-fill-${sector.id}`, () => {
        map.current!.getCanvas().style.cursor = '';
      });
    });
  };

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

        // Enhanced popup with toll data and simulation button
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
              <div class="mt-3 pt-2 border-t">
                <button 
                  id="simulate-${truck.id}" 
                  class="w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  🚛 Simular Recorrido
                </button>
              </div>
            </div>
          `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([truck.lng, truck.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add simulation button click handler
        popup.on('open', () => {
          const simulateBtn = document.getElementById(`simulate-${truck.id}`);
          if (simulateBtn) {
            simulateBtn.onclick = () => startTruckSimulation(truck);
          }
        });

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

  const startTruckSimulation = async (truck: TruckLocation) => {
    // Close any open popup
    if (map.current) {
      map.current.getCanvasContainer().querySelectorAll('.mapboxgl-popup').forEach(popup => {
        (popup as HTMLElement).remove();
      });
    }

    // Load truck route and start simulation
    await loadSimulationRoute(truck);
  };

  const loadSimulationRoute = async (truck: TruckLocation) => {
    const routePoints = await simulation.loadTruckRoute(
      truck.placas, 
      truck.tag_id, 
      simulationStartDate, 
      simulationEndDate
    );
    
    if (routePoints.length === 0) {
      const periodText = simulationStartDate && simulationEndDate 
        ? `entre ${simulationStartDate.toLocaleDateString('es-MX')} y ${simulationEndDate.toLocaleDateString('es-MX')}`
        : 'en el período seleccionado';
      alert(`No se encontraron datos de recorrido para este camión ${periodText}.`);
      return;
    }

    // Setup simulation callbacks
    simulation.setCallbacks({
      onUpdate: (currentPoint, progress) => {
        updateSimulationMarker(currentPoint);
        drawProgressiveLine(routePoints, Math.floor((progress / 100) * routePoints.length));
      },
      onComplete: () => {
        console.log('Simulation completed');
      }
    });
  };

  const updateSimulationMarker = (point: { lat: number; lng: number; caseta_nombre: string }) => {
    if (!map.current) return;

    // Remove existing simulation marker
    if (simulationMarker) {
      simulationMarker.remove();
    }

    // Create animated simulation marker
    const el = document.createElement('div');
    el.className = 'simulation-marker';
    el.innerHTML = '🚚';
    el.style.fontSize = '24px';
    el.style.filter = 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))';
    el.style.animation = 'pulse 2s infinite';
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([point.lng, point.lat])
      .addTo(map.current);

    setSimulationMarker(marker);
  };

  const drawProgressiveLine = (routePoints: Array<{ lat: number; lng: number }>, currentIndex: number) => {
    if (!map.current || currentIndex < 1) return;

    const sourceId = 'simulation-route';
    const layerId = 'simulation-route-line';
    const completedLayerId = 'simulation-route-completed';
    const completedSourceId = `${sourceId}-completed`;

    // Remove existing layers and sources
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getLayer(completedLayerId)) {
      map.current.removeLayer(completedLayerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }
    if (map.current.getSource(completedSourceId)) {
      map.current.removeSource(completedSourceId);
    }

    // Completed route (green line)
    const completedCoordinates = routePoints
      .slice(0, currentIndex + 1)
      .map(point => [point.lng, point.lat]);

    // Remaining route (gray line)  
    const remainingCoordinates = routePoints
      .slice(currentIndex)
      .map(point => [point.lng, point.lat]);

    // Add completed route
    if (completedCoordinates.length > 1) {
      map.current.addSource(`${sourceId}-completed`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: completedCoordinates
          }
        }
      });

      map.current.addLayer({
        id: completedLayerId,
        type: 'line',
        source: `${sourceId}-completed`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    }

    // Add remaining route
    if (remainingCoordinates.length > 1) {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: remainingCoordinates
          }
        }
      });

      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#94a3b8',
          'line-width': 2,
          'line-opacity': 0.5,
          'line-dasharray': [5, 5]
        }
      });
    }
  };

  // Add CSS for pulse animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <SimulationControls
        isPlaying={simulation.isPlaying}
        progress={simulation.progress}
        selectedTruck={simulation.selectedTruck}
        onPlay={simulation.startSimulation}
        onPause={simulation.pauseSimulation}
        onStop={simulation.stopSimulation}
        onRestart={simulation.restartSimulation}
        onSpeedChange={simulation.setSpeed}
        speed={simulation.speed}
        startDate={simulationStartDate}
        endDate={simulationEndDate}
        onDateRangeChange={(startDate, endDate) => {
          setSimulationStartDate(startDate);
          setSimulationEndDate(endDate);
        }}
        onReloadRoute={() => {
          if (simulation.selectedTruck && trucks.length > 0) {
            const currentTruck = trucks.find(t => t.placas === simulation.selectedTruck);
            if (currentTruck) {
              loadSimulationRoute(currentTruck);
            }
          }
        }}
      />
    </div>
  );
};

export default FleetMap;
