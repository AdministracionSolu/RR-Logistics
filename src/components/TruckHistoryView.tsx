import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Truck, MapPin, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TollEvent {
  id: string;
  fecha_hora: string;
  caseta_nombre: string;
  importe: number;
  saldo: number;
  concepto: string;
  folio: string;
  casetas_autopista?: {
    autopista: string;
    km: number;
  };
}

interface Truck {
  id: string;
  placas: string;
  modelo: string;
  tag_id: string;
}

const TruckHistoryView = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [events, setEvents] = useState<TollEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [dailyStats, setDailyStats] = useState<{
    totalGasto: number;
    cruces: number;
    saldoFinal: number;
  }>({ totalGasto: 0, cruces: 0, saldoFinal: 0 });

  useEffect(() => {
    loadTrucks();
    // Set default dates (today and yesterday)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    setDateFrom(yesterday);
    setDateTo(today);
  }, []);

  useEffect(() => {
    if (selectedTruck && dateFrom && dateTo) {
      loadTruckHistory();
    }
  }, [selectedTruck, dateFrom, dateTo]);

  const loadTrucks = async () => {
    const { data, error } = await supabase
      .from('camiones')
      .select('id, placas, modelo, tag_id')
      .not('tag_id', 'is', null)
      .eq('estado', 'activo')
      .order('placas');

    if (error) {
      console.error('Error loading trucks:', error);
      return;
    }

    setTrucks(data || []);
    if (data && data.length > 0) {
      setSelectedTruck(data[0].id);
    }
  };

  const loadTruckHistory = async () => {
    if (!selectedTruck || !dateFrom || !dateTo) return;

    setLoading(true);
    try {
      // Get truck info
      const { data: truck } = await supabase
        .from('camiones')
        .select('tag_id')
        .eq('id', selectedTruck)
        .single();

      if (!truck?.tag_id) return;

      // Get toll events for the truck in date range
      const { data: tollEvents, error } = await supabase
        .from('toll_events')
        .select(`
          id,
          fecha_hora,
          caseta_nombre,
          importe,
          saldo,
          concepto,
          folio,
          casetas_autopista (
            autopista,
            km
          )
        `)
        .eq('tag_id', truck.tag_id)
        .gte('fecha_hora', format(dateFrom, 'yyyy-MM-dd'))
        .lte('fecha_hora', format(dateTo, 'yyyy-MM-dd') + ' 23:59:59')
        .order('fecha_hora', { ascending: false });

      if (error) {
        console.error('Error loading truck history:', error);
        return;
      }

      setEvents(tollEvents || []);

      // Calculate daily stats
      const totalGasto = tollEvents?.reduce((sum, event) => sum + (event.importe || 0), 0) || 0;
      const cruces = tollEvents?.length || 0;
      const saldoFinal = tollEvents?.[0]?.saldo || 0;

      setDailyStats({ totalGasto, cruces, saldoFinal });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const selectedTruckInfo = trucks.find(t => t.id === selectedTruck);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Historial de Unidad
          </CardTitle>
          <CardDescription>
            Consulta el historial detallado de cruces por unidad y período
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Truck Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Seleccionar Unidad</label>
              <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una unidad" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.placas} - {truck.modelo} ({truck.tag_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Desde</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Hasta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {selectedTruckInfo && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Unidad</div>
              </div>
              <div className="text-lg font-semibold">{selectedTruckInfo.placas}</div>
              <div className="text-xs text-muted-foreground">{selectedTruckInfo.tag_id}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Cruces</div>
              </div>
              <div className="text-2xl font-bold">{dailyStats.cruces}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Gasto Total</div>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(dailyStats.totalGasto)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Saldo Actual</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dailyStats.saldoFinal)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Cruces</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Cargando historial...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron cruces en el período seleccionado
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.caseta_nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.casetas_autopista?.autopista} - KM {event.casetas_autopista?.km}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">
                          {formatCurrency(event.importe)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Saldo: {formatCurrency(event.saldo)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>
                        {format(new Date(event.fecha_hora), 'PPp', { locale: es })}
                      </span>
                      <span>Folio: {event.folio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TruckHistoryView;