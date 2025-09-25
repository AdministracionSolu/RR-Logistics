import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardB = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente"
    });
  };

  // Verificar que el usuario tenga acceso a este dashboard
  if (profile?.user_type !== 'tipo_b') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            No tiene permisos para acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">Dashboard de Seguimiento</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Bienvenido, {profile?.full_name || profile?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Mapa de Seguimiento en Tiempo Real</h2>
            <p className="text-muted-foreground">
              Monitor de ubicaciones GPS del sistema SPOT
            </p>
          </div>

          {/* Mapa incrustado */}
          <div className="w-full bg-card rounded-lg border shadow-lg overflow-hidden">
            <div className="aspect-video md:aspect-[16/10] lg:aspect-[16/9] w-full">
              <iframe
                src="https://maps.findmespot.com/s/K16M"
                className="w-full h-full border-0"
                title="Mapa SPOT en Tiempo Real"
                loading="lazy"
                allow="geolocation"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Estado del Sistema
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Conectado</span>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Última Actualización
              </h3>
              <p className="text-sm font-medium">
                {new Date().toLocaleString('es-MX')}
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Tipo de Mapa
              </h3>
              <p className="text-sm font-medium">SPOT GPS Tracking</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardB;