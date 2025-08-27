import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MobileFleetMap from '@/components/MobileFleetMap';

const MobileDashboard = () => {
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    loadAlertsCount();
    
    // Update alerts count periodically
    const interval = setInterval(loadAlertsCount, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const loadAlertsCount = async () => {
    try {
      const { count } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'cobro_duplicado')
        .eq('estado', 'activa');

      setAlertsCount(count || 0);
    } catch (error) {
      console.error('Error loading alerts count:', error);
    }
  };

  return (
    <div className="h-full">
      <MobileFleetMap />
    </div>
  );
};

export default MobileDashboard;