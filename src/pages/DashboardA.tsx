import React from 'react';
import ExpandedFleetDashboard from '@/components/ExpandedFleetDashboard';
import { useAuth } from '@/hooks/useAuth';

const DashboardA = () => {
  const { profile } = useAuth();

  // Verificar que el usuario tenga acceso a este dashboard
  if (profile?.user_type !== 'tipo_a') {
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

  return <ExpandedFleetDashboard />;
};

export default DashboardA;
