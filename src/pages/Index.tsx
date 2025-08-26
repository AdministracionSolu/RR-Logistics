import { useState, useEffect } from 'react';
import ExpandedFleetDashboard from '@/components/ExpandedFleetDashboard';
import MapboxTokenInput from '@/components/MapboxTokenInput';

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

  return <ExpandedFleetDashboard mapboxToken={mapboxToken} />;
};

export default Index;
