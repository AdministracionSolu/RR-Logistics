import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Map, MapPin, Box, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CheckpointsManager from '@/components/gestion/CheckpointsManager';
import SectorsManager from '@/components/gestion/SectorsManager';
import NotifyRulesManager from '@/components/gestion/NotifyRulesManager';

const Configuracion = () => {
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard-b')}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Volver</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-md">
                <Box className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <h1 className="text-base sm:text-lg font-semibold">Configuración</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
              {profile?.full_name || profile?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Configuration Sections */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona checkpoints, sectores y reglas de notificación
            </p>
          </div>

          <Accordion type="multiple" defaultValue={["checkpoints"]} className="w-full space-y-3 sm:space-y-4">
            <AccordionItem value="checkpoints" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-green-500/10 rounded-md">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm sm:text-base font-semibold block">Checkpoints</span>
                    <span className="text-xs text-muted-foreground">Gestionar puntos de control</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <CheckpointsManager />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sectores" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-purple-500/10 rounded-md">
                    <Box className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm sm:text-base font-semibold block">Sectores</span>
                    <span className="text-xs text-muted-foreground">Gestionar zonas geográficas</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <SectorsManager />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notificaciones" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-amber-500/10 rounded-md">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm sm:text-base font-semibold block">Notificaciones</span>
                    <span className="text-xs text-muted-foreground">Configurar reglas de alertas</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <NotifyRulesManager />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Configuracion;
