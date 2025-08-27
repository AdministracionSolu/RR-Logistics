import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, MapPin, Bell, Database, Trash2, Download, RefreshCw, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import FileUploader from '@/components/FileUploader';

const Configuracion = () => {
  const [settings, setSettings] = useState({
    alertsEnabled: true,
    duplicateChargeThreshold: 30,
    lowBalanceThreshold: 100,
    inactivityThreshold: 4,
    autoRefreshInterval: 60
  });
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTrucks: 0,
    totalAlerts: 0,
    lastSync: null as string | null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [eventsCount, trucksCount, alertsCount] = await Promise.all([
        supabase.from('toll_events').select('*', { count: 'exact', head: true }),
        supabase.from('camiones').select('*', { count: 'exact', head: true }),
        supabase.from('alertas').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalEvents: eventsCount.count || 0,
        totalTrucks: trucksCount.count || 0,
        totalAlerts: alertsCount.count || 0,
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const clearAllAlerts = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('alertas')
        .delete()
        .eq('tipo', 'cobro_duplicado');

      if (error) throw error;

      toast({
        title: "Alertas eliminadas",
        description: "Todas las alertas han sido eliminadas correctamente",
      });

      loadStats();
    } catch (error) {
      console.error('Error clearing alerts:', error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar las alertas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      const { data: events, error } = await supabase
        .from('toll_events')
        .select('*')
        .order('fecha_hora', { ascending: false });

      if (error) throw error;

      // Create CSV content
      const headers = ['tag_id', 'fecha_hora', 'caseta_nombre', 'concepto', 'importe', 'saldo', 'folio'];
      const csvContent = [
        headers.join(','),
        ...events!.map(event => 
          headers.map(header => event[header] || '').join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eventos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Datos exportados",
        description: "Los datos se han descargado correctamente",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración del sistema
        </p>
      </div>

      {/* System Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Estadísticas del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
              <p className="text-sm text-muted-foreground">Eventos totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalTrucks}</p>
              <p className="text-sm text-muted-foreground">Camiones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.totalAlerts}</p>
              <p className="text-sm text-muted-foreground">Alertas generadas</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Última sync</p>
              <p className="text-xs text-muted-foreground">
                {stats.lastSync ? new Date(stats.lastSync).toLocaleString('es-MX') : 'N/A'}
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Configuración de Alertas</span>
          </CardTitle>
          <CardDescription>
            Configura los parámetros para la generación automática de alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="alerts-enabled">Alertas automáticas</Label>
              <p className="text-sm text-muted-foreground">
                Generar alertas por cobros duplicados automáticamente
              </p>
            </div>
            <Switch
              id="alerts-enabled"
              checked={settings.alertsEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, alertsEnabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="duplicate-threshold">
              Umbral de cobro duplicado (minutos)
            </Label>
            <Input
              id="duplicate-threshold"
              type="number"
              value={settings.duplicateChargeThreshold}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  duplicateChargeThreshold: parseInt(e.target.value) || 30 
                }))
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Tiempo máximo entre cobros para considerarlos duplicados
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="low-balance">
              Umbral de saldo bajo (MXN)
            </Label>
            <Input
              id="low-balance"
              type="number"
              value={settings.lowBalanceThreshold}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  lowBalanceThreshold: parseInt(e.target.value) || 100 
                }))
              }
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <FileUploader onUploadComplete={loadStats} />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Gestión de Datos</span>
          </CardTitle>
          <CardDescription>
            Acciones de mantenimiento y limpieza de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800">Limpiar alertas</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Elimina todas las alertas de cobros duplicados del sistema
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar alertas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar todas las alertas?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente todas las alertas de cobros duplicados.
                    No se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllAlerts}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar todas
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Aplicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Versión:</span>
              <Badge variant="outline">1.0.0</Badge>
            </div>
            <div className="flex justify-between">
              <span>Última actualización:</span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('es-MX')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Diseño:</span>
              <Badge variant="secondary">Mobile-First</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracion;