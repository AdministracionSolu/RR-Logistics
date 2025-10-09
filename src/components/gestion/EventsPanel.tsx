import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, MapPin, Box, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import DateRangePicker from '@/components/DateRangePicker';

interface Event {
  id: number;
  unit_id: string;
  type: string;
  ref_id: number;
  ref_type: string;
  lat: number;
  lng: number;
  ts: string;
  meta: any;
  created_at: string;
}

const EventsPanel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUnit, setFilterUnit] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const loadEvents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('ts', { ascending: false })
        .limit(50);

      if (filterUnit) {
        query = query.ilike('unit_id', `%${filterUnit}%`);
      }

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      if (startDate) {
        query = query.gte('ts', startOfDay(startDate).toISOString());
      }

      if (endDate) {
        query = query.lte('ts', endOfDay(endDate).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        () => {
          loadEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterUnit, filterType, startDate, endDate]);

  const getEventIcon = (refType: string) => {
    return refType === 'checkpoint' ? <MapPin className="h-4 w-4" /> : <Box className="h-4 w-4" />;
  };

  const getEventBadge = (type: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'checkpoint_enter': { variant: 'default', label: 'Entrada Checkpoint' },
      'checkpoint_exit': { variant: 'secondary', label: 'Salida Checkpoint' },
      'sector_enter': { variant: 'default', label: 'Entrada Sector' },
      'sector_exit': { variant: 'secondary', label: 'Salida Sector' },
      'dwell': { variant: 'outline', label: 'Dwell' },
    };

    const config = variants[type] || { variant: 'outline', label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getUnitDisplayName = (unitId: string) => {
    const unitNames: Record<string, string> = {
      '0-5066561': 'Unidad RR Logistics',
    };
    return unitNames[unitId] || unitId;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Eventos en Vivo
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadEvents}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Filtrar por unidad..."
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los eventos</SelectItem>
                  <SelectItem value="checkpoint_enter">Entrada Checkpoint</SelectItem>
                  <SelectItem value="checkpoint_exit">Salida Checkpoint</SelectItem>
                  <SelectItem value="sector_enter">Entrada Sector</SelectItem>
                  <SelectItem value="sector_exit">Salida Sector</SelectItem>
                  <SelectItem value="dwell">Dwell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  className="flex-1"
                />
                {(startDate || endDate) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay eventos registrados
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getEventIcon(event.ref_type)}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getEventBadge(event.type)}
                            <span className="font-semibold text-sm">{getUnitDisplayName(event.unit_id)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {event.meta?.checkpoint_name || event.meta?.sector_name || `${event.ref_type} #${event.ref_id}`}
                          </div>
                          {event.meta?.dwell_minutes && (
                            <div className="text-xs text-muted-foreground">
                              Tiempo en sitio: {Math.round(event.meta.dwell_minutes)} minutos
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(event.ts), "dd MMM yyyy, HH:mm:ss", { locale: es })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPanel;
