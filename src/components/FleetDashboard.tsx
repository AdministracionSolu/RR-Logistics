import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import FleetMap from './FleetMap';
interface FleetDashboardProps {
  mapboxToken: string;
}
const FleetDashboard = ({
  mapboxToken
}: FleetDashboardProps) => {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    activeTrucks: 0,
    alerts: 0,
    routes: 0
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  useEffect(() => {
    loadDashboardData();

    // Suscribirse a eventos de cruces en tiempo real
    const eventsSubscription = supabase.channel('cruces').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'cruces_registrados'
    }, payload => {
      console.log('Nuevo evento:', payload);
      loadDashboardData();
    }).subscribe();
    return () => {
      eventsSubscription.unsubscribe();
    };
  }, []);
  const loadDashboardData = async () => {
    // Fecha de hace 60 minutos
    const sixtyMinutesAgo = new Date();
    sixtyMinutesAgo.setMinutes(sixtyMinutesAgo.getMinutes() - 60);

    // Cargar estadísticas
    const [trucksResult, eventsLastHourResult, recentEventsResult] = await Promise.all([supabase.from('camiones').select('estado'), supabase.from('cruces_registrados').select('*').gte('timestamp', sixtyMinutesAgo.toISOString()), supabase.from('cruces_registrados').select(`
          *,
          camiones(placas),
          casetas_autopista(nombre, autopista),
          rutas(nombre)
        `).order('timestamp', {
      ascending: false
    }).limit(10)]);
    if (trucksResult.data) {
      const activeTrucks = trucksResult.data.filter(t => t.estado === 'activo').length;
      setStats(prev => ({
        ...prev,
        totalTrucks: trucksResult.data.length,
        activeTrucks
      }));
    }
    if (eventsLastHourResult.data) {
      setStats(prev => ({
        ...prev,
        alerts: eventsLastHourResult.data.length
      }));
    }
    if (recentEventsResult.data) {
      setRecentEvents(recentEventsResult.data);
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baja':
        return 'secondary';
      default:
        return 'default';
    }
  };
  return <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoreo en tiempo real </h1>
            <p className="text-muted-foreground">Borrador 1</p>
          </div>
          <div className="flex space-x-2">
            <a href="/eventos" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Eventos
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <div className="text-2xl">
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrucks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Número de eventos en la última hora</CardTitle>
              <div className="text-2xl">
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.alerts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mapa de Flota</CardTitle>
              <CardDescription>Ubicación en tiempo real de las unidades</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96">
                <FleetMap mapboxToken={mapboxToken} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recientes</CardTitle>
              <CardDescription>Historial de cruces registrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEvents.length === 0 ? <p className="text-sm text-muted-foreground">No hay eventos registrados</p> : recentEvents.map(event => <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {event.camiones?.placas} - {event.casetas_autopista?.nombre}
                        </p>
                        <Badge variant="outline">
                          {event.tipo_cruce}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.casetas_autopista?.autopista} • {event.rutas?.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default FleetDashboard;