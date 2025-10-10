import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Map, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FleetMap from '@/components/FleetMap';
import { useNavigate } from 'react-router-dom';

const DashboardB = () => {
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
            <h1 className="text-lg font-semibold">RR Logistics - Demo</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden md:inline">
              Bienvenido, {profile?.full_name || profile?.email}
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/gestion')}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Gestión</span>
            </Button>
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

      {/* Main content - Mapa de flota con GPS */}
      <main className="w-full h-[calc(100vh-64px)]">
        <FleetMap />
      </main>
    </div>
  );
};

export default DashboardB;