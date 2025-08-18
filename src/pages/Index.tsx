import { useState, useEffect } from 'react';
import MapboxTokenInput from '@/components/MapboxTokenInput';
import FleetDashboard from '@/components/FleetDashboard';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
  };

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return <FleetDashboard mapboxToken={mapboxToken} />;
};

export default Index;
