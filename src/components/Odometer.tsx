import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, TrendingUp, Clock } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

interface OdometerProps {
  truckId?: string;
}

interface TruckData {
  id: string;
  placas: string;
  modelo: string;
  kilometraje_total: number;
  spot_unit_id: string;
  updated_at: string;
}

const Odometer = ({ truckId }: OdometerProps) => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [dailyDistance, setDailyDistance] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setHours(23, 59, 59, 999)));

  useEffect(() => {
    loadTruckData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('odometer-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'camiones',
          filter: truckId ? `id=eq.${truckId}` : undefined
        },
        (payload) => {
          console.log('Odometer update:', payload);
          setTrucks(prev => 
            prev.map(t => 
              t.id === payload.new.id 
                ? { 
                    ...t, 
                    kilometraje_total: payload.new.kilometraje_total,
                    updated_at: payload.new.updated_at 
                  }
                : t
            )
          );
        }
      )
      .subscribe();

    // Update odometer every 30 seconds
    const interval = setInterval(() => {
      updateOdometer();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [truckId, startDate, endDate]);

  const loadTruckData = async () => {
    try {
      let query = supabase
        .from('camiones')
        .select('id, placas, modelo, kilometraje_total, spot_unit_id, updated_at')
        .eq('estado', 'activo')
        .not('spot_unit_id', 'is', null);

      if (truckId) {
        query = query.eq('id', truckId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTrucks(data || []);

      // Calculate daily distance for each truck
      await calculateDailyDistance(data || []);
    } catch (error) {
      console.error('Error loading truck data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyDistance = async (trucksData: TruckData[]) => {
    const dailyDist: Record<string, number> = {};

    for (const truck of trucksData) {
      console.log(`Calculating distance for truck ${truck.placas} (${truck.spot_unit_id})`);
      console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      const { data: positions, error } = await supabase
        .from('positions')
        .select('lat, lng, ts')
        .eq('unit_id', truck.spot_unit_id)
        .neq('lat', -99999)
        .neq('lng', -99999)
        .gte('ts', startDate.toISOString())
        .lte('ts', endDate.toISOString())
        .order('ts', { ascending: true });

      if (error) {
        console.error(`Error fetching positions for ${truck.placas}:`, error);
        dailyDist[truck.id] = 0;
        continue;
      }

      console.log(`Found ${positions?.length || 0} positions for ${truck.placas}`);

      if (positions && positions.length > 1) {
        let distance = 0;
        for (let i = 1; i < positions.length; i++) {
          const prev = positions[i - 1];
          const curr = positions[i];
          const segmentDist = haversine(prev.lat, prev.lng, curr.lat, curr.lng);
          distance += segmentDist;
        }
        dailyDist[truck.id] = distance;
        console.log(`Total distance for ${truck.placas}: ${distance.toFixed(2)} km`);
      } else {
        dailyDist[truck.id] = 0;
        console.log(`Not enough positions for ${truck.placas} to calculate distance`);
      }
    }

    setDailyDistance(dailyDist);
  };

  const updateOdometer = async () => {
    try {
      await supabase.functions.invoke('update-odometer');
    } catch (error) {
      console.error('Error updating odometer:', error);
    }
  };

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (km: number) => {
    return km.toLocaleString('es-MX', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    });
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
            Odómetro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    if (start) {
      // Ajustar a inicio del día (00:00:00)
      const adjustedStart = new Date(start);
      adjustedStart.setHours(0, 0, 0, 0);
      setStartDate(adjustedStart);
      console.log('Start date adjusted to:', adjustedStart.toISOString());
    }
    
    if (end) {
      // Ajustar a fin del día (23:59:59)
      const adjustedEnd = new Date(end);
      adjustedEnd.setHours(23, 59, 59, 999);
      setEndDate(adjustedEnd);
      console.log('End date adjusted to:', adjustedEnd.toISOString());
    }
  };

  return (
    <div className="space-y-4">
      <DateRangePicker 
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />
      
      {trucks.map(truck => (
        <Card key={truck.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>{truck.placas} - {truck.modelo}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Total Kilometraje */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span>Kilometraje Total</span>
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight text-primary">
                  {formatDistance(truck.kilometraje_total || 0)}
                  <span className="text-lg text-muted-foreground ml-1">km</span>
                </div>
              </div>

              {/* Distancia del Período */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Distancia del Período</span>
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight text-green-600 dark:text-green-400">
                  {formatDistance(dailyDistance[truck.id] || 0)}
                  <span className="text-lg text-muted-foreground ml-1">km</span>
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

export default Odometer;
