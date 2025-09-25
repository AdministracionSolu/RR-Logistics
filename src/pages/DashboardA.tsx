import React, { useState, useEffect } from 'react';
import ExpandedFleetDashboard from '@/components/ExpandedFleetDashboard';
import MapboxTokenInput from '@/components/MapboxTokenInput';
import { useAuth } from '@/hooks/useAuth';

const DashboardA = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const { profile } = useAuth();

  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
  };

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

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return <ExpandedFleetDashboard mapboxToken={mapboxToken} />;
};

export default DashboardA;