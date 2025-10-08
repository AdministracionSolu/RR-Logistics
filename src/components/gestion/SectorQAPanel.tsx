import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Check, Eye, EyeOff, Layers } from 'lucide-react';

interface SectorQAPanelProps {
  onRefresh: () => void;
}

const SectorQAPanel = ({ onRefresh }: SectorQAPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [showProposed, setShowProposed] = useState(false);
  const [bufferM, setBufferM] = useState(250);
  const [simplifyTolerance, setSimplifyTolerance] = useState(0.0001);
  const [useOSM, setUseOSM] = useState(true);
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rebuild-sectors', {
        body: {
          use_osm: useOSM,
          buffer_m: bufferM,
          simplify_tolerance: simplifyTolerance,
          mark_as_proposed: true,
        },
      });

      if (error) throw error;

      toast({
        title: 'Sectores regenerados',
        description: `${data.results.length} sectores procesados como propuestas`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error regenerating sectors:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron regenerar los sectores',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSector = async (sectorId: number) => {
    try {
      // Get the proposed sector
      const { data: proposed, error: fetchError } = await supabase
        .from('sectors')
        .select('*')
        .eq('id', sectorId)
        .single();

      if (fetchError) throw fetchError;

      // Find original sector by name (remove "Propuesta" suffix)
      const originalName = proposed.name.replace(' (Propuesta)', '');
      const { data: original } = await supabase
        .from('sectors')
        .select('*')
        .eq('name', originalName)
        .eq('is_proposed', false)
        .single();

      // Log to history
      if (original) {
        await supabase.from('sector_history').insert({
          sector_id: original.id,
          changed_by: (await supabase.auth.getUser()).data.user?.email,
          action: 'replace',
          old_geometry: original.polygon,
          new_geometry: proposed.polygon,
          parameters: {
            buffer_m: proposed.buffer_m,
            source: proposed.source,
          },
        });

        // Update original
        await supabase
          .from('sectors')
          .update({
            polygon: proposed.polygon,
            buffer_m: proposed.buffer_m,
            source: proposed.source,
            color: proposed.color,
            updated_at: new Date().toISOString(),
          })
          .eq('id', original.id);

        // Delete proposed
        await supabase.from('sectors').delete().eq('id', sectorId);
      } else {
        // No original found, just mark as not proposed
        await supabase
          .from('sectors')
          .update({
            name: originalName,
            is_proposed: false,
            enabled: true,
          })
          .eq('id', sectorId);
      }

      toast({
        title: 'Sector aprobado',
        description: 'La geometría propuesta se aplicó correctamente',
      });

      onRefresh();
    } catch (error) {
      console.error('Error approving sector:', error);
      toast({
        title: 'Error',
        description: 'No se pudo aprobar el sector',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Control de Calidad (QA)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Genera y compara geometrías propuestas antes de aplicarlas
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-osm">Usar OpenStreetMap (Overpass)</Label>
            <Switch
              id="use-osm"
              checked={useOSM}
              onCheckedChange={setUseOSM}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Buffer del corredor (m)</Label>
              <Badge variant="secondary">{bufferM}m</Badge>
            </div>
            <Slider
              value={[bufferM]}
              onValueChange={(val) => setBufferM(val[0])}
              min={200}
              max={400}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Simplificación</Label>
              <Badge variant="secondary">{simplifyTolerance.toFixed(5)}</Badge>
            </div>
            <Slider
              value={[simplifyTolerance * 100000]}
              onValueChange={(val) => setSimplifyTolerance(val[0] / 100000)}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleRegenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerar Sectores (Propuestas)
              </>
            )}
          </Button>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Ver sectores propuestos en el mapa</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProposed(!showProposed)}
            >
              {showProposed ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Ocultar
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Mostrar
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-2">
            Los sectores propuestos aparecerán con borde punteado en el mapa.
            Revísalos antes de aprobarlos.
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Acciones rápidas</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // This would be handled by parent component
                toast({
                  title: 'Información',
                  description: 'Los sectores propuestos se mostrarán en la lista principal',
                });
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Aprobar todos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorQAPanel;