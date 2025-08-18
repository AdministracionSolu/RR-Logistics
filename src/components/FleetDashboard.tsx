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
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  useEffect(() => {
    loadDashboardData();

    // Suscribirse a alertas en tiempo real
    const alertsSubscription = supabase.channel('alertas').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'alertas'
    }, payload => {
      console.log('Nueva alerta:', payload);
      loadDashboardData();
    }).subscribe();
    return () => {
      alertsSubscription.unsubscribe();
    };
  }, []);
  const loadDashboardData = async () => {
    // Cargar estadísticas
    const [trucksResult, alertsResult, routesResult] = await Promise.all([supabase.from('camiones').select('estado'), supabase.from('alertas').select('*').eq('estado', 'activa').order('timestamp', {
      ascending: false
    }).limit(5), supabase.from('rutas').select('id').eq('activa', true)]);
    if (trucksResult.data) {
      const activeTrucks = trucksResult.data.filter(t => t.estado === 'activo').length;
      setStats(prev => ({
        ...prev,
        totalTrucks: trucksResult.data.length,
        activeTrucks
      }));
    }
    if (alertsResult.data) {
      setStats(prev => ({
        ...prev,
        alerts: alertsResult.data.length
      }));
      setRecentAlerts(alertsResult.data);
    }
    if (routesResult.data) {
      setStats(prev => ({
        ...prev,
        routes: routesResult.data.length
      }));
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
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Flota</h1>
            <p className="text-muted-foreground">Monitoreo de flota en tiempo real</p>
          </div>
          <div className="flex space-x-2">
            <a href="/eventos" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              📊 Eventos
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Camiones</CardTitle>
              <div className="text-2xl">
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrucks}</div>
            </CardContent>
          </Card>
          
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
              <CardTitle className="text-sm font-medium">Alertas</CardTitle>
              <div className="text-2xl">
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.alerts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
              <div className="text-2xl">
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.routes}</div>
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

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas Recientes</CardTitle>
              <CardDescription>Últimas notificaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.length === 0 ? <p className="text-sm text-muted-foreground">No hay alertas activas</p> : recentAlerts.map(alert => <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.titulo}</p>
                        <Badge variant={getPriorityColor(alert.prioridad)}>
                          {alert.prioridad}
                        </Badge>
                      </div>
                      {alert.descripcion && <p className="text-xs text-muted-foreground">{alert.descripcion}</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString('es-MX')}
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