import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Clock } from 'lucide-react';

interface SpeedMonitorProps {
  truckId?: string;
}

interface TruckData {
  id: string;
  placas: string;
  modelo: string;
  velocidad_actual: number;
  updated_at: string;
  spot_unit_id: string;
}

const SpeedMonitor = ({ truckId }: SpeedMonitorProps) => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTruckData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('speed-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'camiones',
          filter: truckId ? `id=eq.${truckId}` : undefined
        },
        (payload) => {
          console.log('Speed update:', payload);
          setTrucks(prev => 
            prev.map(t => 
              t.id === payload.new.id 
                ? { 
                    ...t, 
                    velocidad_actual: payload.new.velocidad_actual,
                    updated_at: payload.new.updated_at 
                  }
                : t
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [truckId]);

  const loadTruckData = async () => {
    try {
      let query = supabase
        .from('camiones')
        .select('id, placas, modelo, velocidad_actual, updated_at, spot_unit_id')
        .eq('estado', 'activo')
        .not('spot_unit_id', 'is', null);

      if (truckId) {
        query = query.eq('id', truckId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTrucks(data || []);
    } catch (error) {
      console.error('Error loading truck data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSpeedColor = (speed: number) => {
    if (speed <= 80) return 'text-green-600 dark:text-green-400';
    if (speed <= 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Velocidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trucks.map(truck => (
        <Card key={truck.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>{truck.placas} - {truck.modelo}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Velocidad Actual */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span>Velocidad Actual</span>
                </div>
                <div className={`text-3xl font-bold font-mono tracking-tight ${getSpeedColor(truck.velocidad_actual || 0)}`}>
                  {truck.velocidad_actual ? truck.velocidad_actual.toFixed(1) : '0.0'}
                  <span className="text-lg text-muted-foreground ml-1">km/h</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {truck.velocidad_actual <= 80 && '🟢 Velocidad normal'}
                  {truck.velocidad_actual > 80 && truck.velocidad_actual <= 100 && '🟡 Precaución'}
                  {truck.velocidad_actual > 100 && '🔴 Exceso de velocidad'}
                </div>
              </div>

              {/* Última Actualización */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Última Actualización</span>
                </div>
                <div className="text-lg font-semibold text-muted-foreground">
                  {formatTime(truck.updated_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {trucks.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No hay camiones activos con GPS configurado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpeedMonitor;
