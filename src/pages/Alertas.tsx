import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DuplicateAlert {
  id: string;
  tag_id: string;
  first_event: {
    caseta_nombre: string;
    fecha_hora: string;
    importe: number;
  };
  second_event: {
    caseta_nombre: string;
    fecha_hora: string;
    importe: number;
  };
  time_difference_minutes: number;
  status: 'active' | 'resolved';
  created_at: string;
  placas?: string;
}

const Alertas = () => {
  const [alerts, setAlerts] = useState<DuplicateAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
    
    // Check for new duplicate charges every 5 minutes
    const interval = setInterval(checkForDuplicateCharges, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('duplicate_charge_alerts')
        .select(`
          *,
          camiones!inner(placas)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las alertas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkForDuplicateCharges = async () => {
    try {
      // Look for PEAJE charges within the last 2 hours
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      const { data: events, error } = await supabase
        .from('toll_events')
        .select('*')
        .eq('concepto', 'PEAJE')
        .gte('fecha_hora', twoHoursAgo.toISOString())
        .order('fecha_hora', { ascending: false });

      if (error) throw error;

      // Group events by tag_id
      const eventsByTag = events?.reduce((acc, event) => {
        if (!acc[event.tag_id]) acc[event.tag_id] = [];
        acc[event.tag_id].push(event);
        return acc;
      }, {} as Record<string, any[]>) || {};

      // Check for duplicates within 30 minutes
      for (const [tagId, tagEvents] of Object.entries(eventsByTag)) {
        if (tagEvents.length < 2) continue;

        for (let i = 0; i < tagEvents.length - 1; i++) {
          for (let j = i + 1; j < tagEvents.length; j++) {
            const event1 = tagEvents[i];
            const event2 = tagEvents[j];
            
            const time1 = new Date(event1.fecha_hora);
            const time2 = new Date(event2.fecha_hora);
            const timeDiff = Math.abs(time1.getTime() - time2.getTime()) / (1000 * 60);
            
            if (timeDiff <= 30) {
              // Check if alert already exists
              const { data: existingAlert } = await supabase
                .from('duplicate_charge_alerts')
                .select('id')
                .eq('tag_id', tagId)
                .eq('first_event->fecha_hora', event1.fecha_hora)
                .eq('second_event->fecha_hora', event2.fecha_hora)
                .single();

              if (!existingAlert) {
                // Create new alert
                await supabase
                  .from('duplicate_charge_alerts')
                  .insert({
                    tag_id: tagId,
                    first_event: {
                      caseta_nombre: event1.caseta_nombre,
                      fecha_hora: event1.fecha_hora,
                      importe: event1.importe
                    },
                    second_event: {
                      caseta_nombre: event2.caseta_nombre,
                      fecha_hora: event2.fecha_hora,
                      importe: event2.importe
                    },
                    time_difference_minutes: Math.round(timeDiff),
                    status: 'active'
                  });
              }
            }
          }
        }
      }
      
      // Reload alerts to show new ones
      loadAlerts();
    } catch (error) {
      console.error('Error checking for duplicate charges:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('duplicate_charge_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta",
      });

      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Error",
        description: "No se pudo resolver la alerta",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alertas</h1>
          <p className="text-sm text-muted-foreground">
            Cobros duplicados detectados
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            checkForDuplicateCharges();
            loadAlerts();
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-red-600">{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Resueltas</p>
                <p className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alertas Activas</CardTitle>
            <CardDescription>
              Cobros duplicados que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border rounded-lg p-4 space-y-3 bg-red-50 border-red-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">
                      {alert.placas || alert.tag_id}
                    </span>
                    <Badge variant="destructive">Activa</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                    className="bg-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolver
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Primer cobro</p>
                    <p className="text-muted-foreground">
                      {alert.first_event.caseta_nombre} - {formatCurrency(alert.first_event.importe)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.first_event.fecha_hora).toLocaleString('es-MX')}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Segundo cobro</p>
                    <p className="text-muted-foreground">
                      {alert.second_event.caseta_nombre} - {formatCurrency(alert.second_event.importe)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.second_event.fecha_hora).toLocaleString('es-MX')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Diferencia: {alert.time_difference_minutes} minutos
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Active Alerts */}
      {activeAlerts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay alertas activas</h3>
            <p className="text-muted-foreground">
              No se han detectado cobros duplicados recientes
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resolved Alerts (collapsed) */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alertas Resueltas</CardTitle>
            <CardDescription>
              Últimas {Math.min(resolvedAlerts.length, 10)} alertas resueltas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resolvedAlerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className="border rounded-lg p-3 bg-green-50 border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">
                      {alert.placas || alert.tag_id}
                    </span>
                    <Badge variant="secondary">Resuelta</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.first_event.caseta_nombre} → {alert.second_event.caseta_nombre} 
                  ({alert.time_difference_minutes} min)
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Alertas;