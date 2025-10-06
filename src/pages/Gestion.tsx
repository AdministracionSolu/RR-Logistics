import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Map, Activity, MapPin, Box, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventsPanel from '@/components/gestion/EventsPanel';
import CheckpointsManager from '@/components/gestion/CheckpointsManager';
import SectorsManager from '@/components/gestion/SectorsManager';
import NotifyRulesManager from '@/components/gestion/NotifyRulesManager';

const Gestion = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente"
    });
    navigate('/login', { replace: true });
  };

  // Verificar acceso
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard-b')}
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Volver al Mapa
            </Button>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold">Gestión</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {profile?.full_name || profile?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="checkpoints" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Checkpoints</span>
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              <span className="hidden sm:inline">Sectores</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <EventsPanel />
          </TabsContent>

          <TabsContent value="checkpoints" className="space-y-4">
            <CheckpointsManager />
          </TabsContent>

          <TabsContent value="sectors" className="space-y-4">
            <SectorsManager />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotifyRulesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Gestion;
