import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SectorRefreshButton = ({ onRefresh }: { onRefresh: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRebuild = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rebuild-sectors', {
        body: {},
      });

      if (error) throw error;

      toast({
        title: 'Sectores reconstruidos',
        description: 'Los sectores se actualizaron con geometrías reales de Mapbox',
      });

      onRefresh();
    } catch (error) {
      console.error('Error rebuilding sectors:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron reconstruir los sectores',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRebuild}
      disabled={loading}
      title="Reconstruir sectores con rutas reales de Mapbox"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Reconstruyendo...' : 'Reconstruir Sectores'}
    </Button>
  );
};

export default SectorRefreshButton;
