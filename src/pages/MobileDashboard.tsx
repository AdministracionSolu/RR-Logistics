import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MobileFleetMap from '@/components/MobileFleetMap';

interface MobileDashboardProps {
  mapboxToken: string;
}

const MobileDashboard = ({ mapboxToken }: MobileDashboardProps) => {
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
        .from('duplicate_charge_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setAlertsCount(count || 0);
    } catch (error) {
      console.error('Error loading alerts count:', error);
    }
  };

  return (
    <div className="h-full">
      <MobileFleetMap mapboxToken={mapboxToken} />
    </div>
  );
};

export default MobileDashboard;