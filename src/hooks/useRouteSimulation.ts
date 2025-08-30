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

  const loadTruckRoute = useCallback(async (truckId: string, tagId: string, startDate?: Date, endDate?: Date) => {
    try {
      // Default to last 7 days if no dates provided
      const defaultStartDate = new Date();
      defaultStartDate.setDate(defaultStartDate.getDate() - 7);
      const defaultEndDate = new Date();

      const fromDate = startDate || defaultStartDate;
      const toDate = endDate || defaultEndDate;

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
        .gte('fecha_hora', fromDate.toISOString())
        .lte('fecha_hora', toDate.toISOString())
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
    setState(prev => {
      if (prev.routePoints.length === 0) return prev;

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const totalPoints = prev.routePoints.length;
      const baseInterval = 1000; // 1 segundo base
      const actualInterval = baseInterval / prev.speed;

      intervalRef.current = setInterval(() => {
        setState(current => {
          const nextIndex = current.currentPointIndex + 1;
          const newProgress = (nextIndex / totalPoints) * 100;

          if (nextIndex >= totalPoints) {
            // Simulación completada
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            animationCallbacks.current.onComplete?.();
            return {
              ...current,
              isPlaying: false,
              progress: 100,
              currentPointIndex: totalPoints - 1
            };
          }

          // Actualizar posición del marcador
          const currentPoint = current.routePoints[nextIndex];
          animationCallbacks.current.onUpdate?.(currentPoint, newProgress);

          return {
            ...current,
            currentPointIndex: nextIndex,
            progress: newProgress
          };
        });
      }, actualInterval);

      return { ...prev, isPlaying: true };
    });
  }, []);

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
    setState(prev => {
      const newState = { ...prev, speed };
      
      // Si está reproduciendo, reiniciar con nueva velocidad
      if (prev.isPlaying) {
        // Pausar primero
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Reiniciar con nueva velocidad después de un pequeño delay
        setTimeout(() => {
          setState(current => {
            if (current.routePoints.length === 0) return current;

            const totalPoints = current.routePoints.length;
            const baseInterval = 1000;
            const actualInterval = baseInterval / speed;

            intervalRef.current = setInterval(() => {
              setState(s => {
                const nextIndex = s.currentPointIndex + 1;
                const newProgress = (nextIndex / totalPoints) * 100;

                if (nextIndex >= totalPoints) {
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                  animationCallbacks.current.onComplete?.();
                  return {
                    ...s,
                    isPlaying: false,
                    progress: 100,
                    currentPointIndex: totalPoints - 1
                  };
                }

                const currentPoint = s.routePoints[nextIndex];
                animationCallbacks.current.onUpdate?.(currentPoint, newProgress);

                return {
                  ...s,
                  currentPointIndex: nextIndex,
                  progress: newProgress
                };
              });
            }, actualInterval);

            return { ...current, isPlaying: true };
          });
        }, 50);
      }
      
      return newState;
    });
  }, []);

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