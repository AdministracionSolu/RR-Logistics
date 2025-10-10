import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Map, Activity, Settings, Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EventsPanel from '@/components/gestion/EventsPanel';
import FleetMap from '@/components/FleetMap';
import Odometer from '@/components/Odometer';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-md">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold">Gestión</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/configuracion')}
              className="flex items-center gap-1.5"
            >
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Configuración</span>
            </Button>
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

      {/* Map Section */}
      <section id="mapa-velocidad" className="w-full" style={{ height: '400px' }}>
        <FleetMap />
      </section>

      {/* Events Panel */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4">
          <Accordion type="multiple" defaultValue={["eventos", "odometro"]} className="w-full">
            <AccordionItem value="eventos" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-blue-500/10 rounded-md">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold">Eventos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <EventsPanel />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="odometro" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-purple-500/10 rounded-md">
                    <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold">Odómetro en Tiempo Real</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <Odometer />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Velocidad Button */}
          <div className="border rounded-lg bg-card shadow-sm">
            <Button
              variant="ghost"
              className="w-full px-4 py-3 hover:bg-muted/50 rounded-lg justify-start"
              onClick={() => navigate('/dashboard-b')}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-green-500/10 rounded-md">
                  <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <span className="text-sm sm:text-base font-semibold">Velocidad</span>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gestion;
