import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, MapPin, DollarSign, AlertTriangle, Clock, FileUp, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FleetMap from './FleetMap';
import FileUploader from './FileUploader';
import TruckHistoryView from './TruckHistoryView';

interface FleetStats {
  totalTrucks: number;
  activeTrucks: number;
  eventsLastHour: number;
  totalDailyExpense: number;
  averageBalance: number;
  alertsCount: number;
}

interface EnhancedTruck {
  id: string;
  placas: string;
  modelo: string;
  tag_id: string;
  saldo_actual: number;
  gasto_dia_actual: number;
  ultimo_cruce_timestamp: string | null;
  ultima_caseta?: string;
  direccion_inferida?: string;
  estado_alerta?: 'normal' | 'saldo_bajo' | 'sin_actividad' | 'fuera_corredor';
}

interface AlertItem {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  tipo: string;
  timestamp: string;
  camion?: {
    placas: string;
  };
  tag_relacionado?: string;
  saldo_alerta?: number;
  minutos_sin_cruce?: number;
}

const ExpandedFleetDashboard = () => {
  const [stats, setStats] = useState<FleetStats>({
    totalTrucks: 0,
    activeTrucks: 0,
    eventsLastHour: 0,
    totalDailyExpense: 0,
    averageBalance: 0,
    alertsCount: 0
  });
  const [trucks, setTrucks] = useState<EnhancedTruck[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Real-time subscriptions
    const tollEventsSubscription = supabase
      .channel('toll_events_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'toll_events' },
        () => loadDashboardData()
      )
      .subscribe();

    const alertsSubscription = supabase
      .channel('alertas_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alertas' },
        () => loadAlertsData()
      )
      .subscribe();

    return () => {
      tollEventsSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStatsData(),
        loadTrucksData(),
        loadAlertsData()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatsData = async () => {
    try {
      // Get truck stats
      const { data: trucksData } = await supabase
        .from('camiones')
        .select('id, estado, saldo_actual, gasto_dia_actual')
        .not('tag_id', 'is', null);

      const totalTrucks = trucksData?.length || 0;
      const activeTrucks = trucksData?.filter(t => t.estado === 'activo')?.length || 0;
      const totalDailyExpense = trucksData?.reduce((sum, t) => sum + (t.gasto_dia_actual || 0), 0) || 0;
      const averageBalance = totalTrucks > 0 
        ? (trucksData?.reduce((sum, t) => sum + (t.saldo_actual || 0), 0) || 0) / totalTrucks 
        : 0;

      // Get events in last hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const { count: eventsCount } = await supabase
        .from('toll_events')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_hora', oneHourAgo.toISOString());

      // Get active alerts count
      const { count: alertsCount } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'activa');

      setStats({
        totalTrucks,
        activeTrucks,
        eventsLastHour: eventsCount || 0,
        totalDailyExpense,
        averageBalance,
        alertsCount: alertsCount || 0
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTrucksData = async () => {
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

      // Enhance trucks with latest crossing data
      const enhancedTrucks: EnhancedTruck[] = [];

      for (const truck of trucksData) {
        const { data: latestEvent } = await supabase
          .from('toll_events')
          .select('caseta_nombre, fecha_hora')
          .eq('tag_id', truck.tag_id)
          .order('fecha_hora', { ascending: false })
          .limit(1)
          .single();

        // Determine alert status
        let estado_alerta: EnhancedTruck['estado_alerta'] = 'normal';
        
        if (truck.saldo_actual < 100) {
          estado_alerta = 'saldo_bajo';
        } else if (truck.ultimo_cruce_timestamp) {
          const lastCrossing = new Date(truck.ultimo_cruce_timestamp);
          const hoursAgo = (Date.now() - lastCrossing.getTime()) / (1000 * 60 * 60);
          if (hoursAgo > 4) {
            estado_alerta = 'sin_actividad';
          }
        }

        enhancedTrucks.push({
          ...truck,
          ultima_caseta: latestEvent?.caseta_nombre,
          estado_alerta
        });
      }

      setTrucks(enhancedTrucks);
    } catch (error) {
      console.error('Error loading trucks data:', error);
    }
  };

  const loadAlertsData = async () => {
    try {
      const { data: alertsData } = await supabase
        .from('alertas')
        .select(`
          id,
          titulo,
          descripcion,
          prioridad,
          tipo,
          timestamp,
          tag_relacionado,
          saldo_alerta,
          minutos_sin_cruce,
          camiones (
            placas
          )
        `)
        .eq('estado', 'activa')
        .order('timestamp', { ascending: false })
        .limit(10);

      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baja': return 'secondary';
      default: return 'outline';
    }
  };

  const getAlertStatusColor = (status: EnhancedTruck['estado_alerta']) => {
    switch (status) {
      case 'saldo_bajo': return 'destructive';
      case 'sin_actividad': return 'secondary';
      case 'fuera_corredor': return 'outline';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header - mobile optimized */}
      <div className="space-y-2 sm:space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Gestión interna</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Sistema de monitoreo de flotilla por casetas
        </p>
      </div>

      {/* Stats Cards - mobile-first responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm text-muted-foreground">Activas</div>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{stats.activeTrucks}</div>
            <div className="text-xs text-muted-foreground">de {stats.totalTrucks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm text-muted-foreground">Cruces 1h</div>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{stats.eventsLastHour}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm text-muted-foreground">Gasto Hoy</div>
            </div>
            <div className="text-sm sm:text-xl font-bold text-red-600">
              {formatCurrency(stats.totalDailyExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm text-muted-foreground">Saldo Prom</div>
            </div>
            <div className="text-sm sm:text-xl font-bold text-green-600">
              {formatCurrency(stats.averageBalance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm text-muted-foreground">Alertas</div>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-orange-600">{stats.alertsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm text-muted-foreground">Últ. Act.</div>
            </div>
            <div className="text-xs sm:text-sm font-medium">
              {new Date().toLocaleTimeString('es-MX')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs - mobile optimized */}
      <Tabs defaultValue="map" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="map" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Mapa en Vivo</span>
            <span className="sm:hidden">Mapa</span>
          </TabsTrigger>
          <TabsTrigger value="fleet" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Estado de Flota</span>
            <span className="sm:hidden">Flota</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Cargar Archivos</span>
            <span className="sm:hidden">Archivos</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm p-2 sm:p-3">
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Map - mobile-first sizing */}
            <div className="xl:col-span-2">
              <Card className="h-[400px] sm:h-[500px] lg:h-[600px]">
                <CardHeader className="pb-2 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Mapa de Flota</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Ubicaciones basadas en último cruce de caseta
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[320px] sm:h-[420px] lg:h-[520px] p-2 sm:p-4">
                  <FleetMap />
                </CardContent>
              </Card>
            </div>

            {/* Alerts Panel - mobile responsive */}
            <div className="xl:col-span-1">
              <Card className="h-[400px] sm:h-[500px] lg:h-[600px]">
                <CardHeader className="pb-2 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Alertas Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 overflow-y-auto h-[320px] sm:h-[420px] lg:h-[520px]">
                  {alerts.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm">No hay alertas activas</p>
                  ) : (
                    alerts.map((alert) => (
                      <Alert key={alert.id} className="p-2 sm:p-4">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <Badge variant={getPriorityColor(alert.prioridad)} className="text-xs">
                              {alert.prioridad}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString('es-MX')}
                            </span>
                          </div>
                          <p className="font-medium text-sm sm:text-base">{alert.titulo}</p>
                          <p className="text-xs sm:text-sm">{alert.descripcion}</p>
                          {alert.tag_relacionado && (
                            <p className="text-xs text-muted-foreground mt-1">
                              TAG: {alert.tag_relacionado}
                            </p>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado Operativo de la Flota</CardTitle>
              <CardDescription>
                Información detallada de cada unidad y su estado actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {trucks.map((truck) => (
                  <Card key={truck.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{truck.placas}</h3>
                        <Badge variant={getAlertStatusColor(truck.estado_alerta)}>
                          {truck.estado_alerta === 'normal' ? 'Normal' :
                           truck.estado_alerta === 'saldo_bajo' ? 'Saldo Bajo' :
                           truck.estado_alerta === 'sin_actividad' ? 'Sin Actividad' :
                           'Fuera de Corredor'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><strong>Modelo:</strong> {truck.modelo}</p>
                        <p><strong>TAG:</strong> {truck.tag_id}</p>
                        <p><strong>Última caseta:</strong> {truck.ultima_caseta || 'N/A'}</p>
                        <p><strong>Saldo:</strong> 
                          <span className={truck.saldo_actual < 100 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            {formatCurrency(truck.saldo_actual)}
                          </span>
                        </p>
                        <p><strong>Gasto hoy:</strong> 
                          <span className="text-red-600">
                            {formatCurrency(truck.gasto_dia_actual)}
                          </span>
                        </p>
                        {truck.ultimo_cruce_timestamp && (
                          <p><strong>Último cruce:</strong> 
                            {new Date(truck.ultimo_cruce_timestamp).toLocaleString('es-MX')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="max-w-2xl mx-auto">
            <FileUploader onUploadComplete={loadDashboardData} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <TruckHistoryView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpandedFleetDashboard;