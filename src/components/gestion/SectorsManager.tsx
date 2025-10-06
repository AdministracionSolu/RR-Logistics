import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Box } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Sector {
  id: number;
  name: string;
  polygon: any;
  enabled: boolean;
  created_at: string;
}

const SectorsManager = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    polygonText: '',
    enabled: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error('Error loading sectors:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los sectores',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSectors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse polygon coordinates
      let polygon;
      try {
        polygon = JSON.parse(formData.polygonText);
      } catch {
        throw new Error('Formato de polígono inválido. Use formato GeoJSON o array de coordenadas.');
      }

      const sectorData = {
        name: formData.name,
        polygon: polygon,
        enabled: formData.enabled,
      };

      if (editingId) {
        const { error } = await supabase
          .from('sectors')
          .update(sectorData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Sector actualizado',
          description: 'El sector se actualizó correctamente',
        });
      } else {
        const { error } = await supabase
          .from('sectors')
          .insert([sectorData]);

        if (error) throw error;

        toast({
          title: 'Sector creado',
          description: 'El sector se creó correctamente',
        });
      }

      setDialogOpen(false);
      resetForm();
      loadSectors();
    } catch (error: any) {
      console.error('Error saving sector:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar el sector',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingId(sector.id);
    setFormData({
      name: sector.name,
      polygonText: JSON.stringify(sector.polygon, null, 2),
      enabled: sector.enabled,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este sector?')) return;

    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sector eliminado',
        description: 'El sector se eliminó correctamente',
      });

      loadSectors();
    } catch (error) {
      console.error('Error deleting sector:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el sector',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      polygonText: '',
      enabled: true,
    });
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Gestión de Sectores
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Sector
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Sector' : 'Nuevo Sector'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polygon">
                    Polígono (GeoJSON o array de coordenadas [lng, lat])
                  </Label>
                  <Textarea
                    id="polygon"
                    value={formData.polygonText}
                    onChange={(e) => setFormData({ ...formData, polygonText: e.target.value })}
                    placeholder='[[-100.1, 25.6], [-100.2, 25.7], [-100.1, 25.8], [-100.0, 25.7]]'
                    rows={6}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Ejemplo: [[-100.1, 25.6], [-100.2, 25.7], [-100.1, 25.8]]
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, enabled: checked })
                    }
                  />
                  <Label htmlFor="enabled">Activo</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Puntos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector) => {
              const pointCount = Array.isArray(sector.polygon) 
                ? sector.polygon.length 
                : sector.polygon?.coordinates?.[0]?.length || 0;
              
              return (
                <TableRow key={sector.id}>
                  <TableCell className="font-medium">{sector.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {pointCount} puntos
                  </TableCell>
                  <TableCell>
                    {sector.enabled ? (
                      <span className="text-green-600">Activo</span>
                    ) : (
                      <span className="text-gray-400">Inactivo</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sector)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(sector.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SectorsManager;
