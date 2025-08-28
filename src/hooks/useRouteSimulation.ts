import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;
  caseta_nombre: string;
}

interface SimulationState {
  isPlaying: boolean;
  progress: number;
  currentPointIndex: number;
  selectedTruck: string | null;
  routePoints: RoutePoint[];
  speed: number;
}

export const useRouteSimulation = () => {
  const [state, setState] = useState<SimulationState>({
    isPlaying: false,
    progress: 0,
    currentPointIndex: 0,
    selectedTruck: null,
    routePoints: [],
    speed: 1
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationCallbacks = useRef<{
    onUpdate?: (currentPoint: RoutePoint, progress: number) => void;
    onComplete?: () => void;
  }>({});

  const loadTruckRoute = useCallback(async (truckId: string, tagId: string) => {
    try {
      // Obtener eventos de cruces de las últimas 24 horas
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: tollEvents, error } = await supabase
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
        .eq('tag_id', tagId)
        .gte('fecha_hora', yesterday.toISOString())
        .order('fecha_hora', { ascending: true });

      if (error) {
        console.error('Error loading truck route:', error);
        return [];
      }

      const routePoints: RoutePoint[] = tollEvents
        ?.filter(event => event.casetas_autopista?.lat && event.casetas_autopista?.lng)
        .map(event => ({
          lat: event.casetas_autopista.lat,
          lng: event.casetas_autopista.lng,
          timestamp: event.fecha_hora,
          caseta_nombre: event.caseta_nombre
        })) || [];

      setState(prev => ({
        ...prev,
        selectedTruck: truckId,
        routePoints,
        currentPointIndex: 0,
        progress: 0
      }));

      return routePoints;
    } catch (error) {
      console.error('Error loading route:', error);
      return [];
    }
  }, []);

  const startSimulation = useCallback(() => {
    if (state.routePoints.length === 0) return;

    setState(prev => ({ ...prev, isPlaying: true }));

    const totalPoints = state.routePoints.length;
    const baseInterval = 1000; // 1 segundo base
    const actualInterval = baseInterval / state.speed;

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const nextIndex = prev.currentPointIndex + 1;
        const newProgress = (nextIndex / totalPoints) * 100;

        if (nextIndex >= totalPoints) {
          // Simulación completada
          clearInterval(intervalRef.current!);
          animationCallbacks.current.onComplete?.();
          return {
            ...prev,
            isPlaying: false,
            progress: 100,
            currentPointIndex: totalPoints - 1
          };
        }

        // Actualizar posición del marcador
        const currentPoint = prev.routePoints[nextIndex];
        animationCallbacks.current.onUpdate?.(currentPoint, newProgress);

        return {
          ...prev,
          currentPointIndex: nextIndex,
          progress: newProgress
        };
      });
    }, actualInterval);
  }, [state.routePoints.length, state.speed]);

  const pauseSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      progress: 0,
      currentPointIndex: 0,
      selectedTruck: null,
      routePoints: []
    }));
  }, []);

  const restartSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      progress: 0,
      currentPointIndex: 0
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
    
    // Si está reproduciendo, reiniciar con nueva velocidad
    if (state.isPlaying) {
      pauseSimulation();
      setTimeout(() => startSimulation(), 100);
    }
  }, [state.isPlaying, pauseSimulation, startSimulation]);

  const setCallbacks = useCallback((callbacks: {
    onUpdate?: (currentPoint: RoutePoint, progress: number) => void;
    onComplete?: () => void;
  }) => {
    animationCallbacks.current = callbacks;
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return {
    ...state,
    loadTruckRoute,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    restartSimulation,
    setSpeed,
    setCallbacks,
    cleanup
  };
};