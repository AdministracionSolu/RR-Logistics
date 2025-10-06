import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
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

interface Checkpoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
  enabled: boolean;
  created_at: string;
}

const CheckpointsManager = () => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    radius_m: '100',
    enabled: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadCheckpoints = async () => {
    try {
      const { data, error } = await supabase
        .from('checkpoints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCheckpoints(data || []);
    } catch (error) {
      console.error('Error loading checkpoints:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los checkpoints',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckpoints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const checkpointData = {
        name: formData.name,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        radius_m: parseInt(formData.radius_m),
        enabled: formData.enabled,
      };

      if (editingId) {
        const { error } = await supabase
          .from('checkpoints')
          .update(checkpointData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Checkpoint actualizado',
          description: 'El checkpoint se actualizó correctamente',
        });
      } else {
        const { error } = await supabase
          .from('checkpoints')
          .insert([checkpointData]);

        if (error) throw error;

        toast({
          title: 'Checkpoint creado',
          description: 'El checkpoint se creó correctamente',
        });
      }

      setDialogOpen(false);
      resetForm();
      loadCheckpoints();
    } catch (error) {
      console.error('Error saving checkpoint:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el checkpoint',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (checkpoint: Checkpoint) => {
    setEditingId(checkpoint.id);
    setFormData({
      name: checkpoint.name,
      lat: checkpoint.lat.toString(),
      lng: checkpoint.lng.toString(),
      radius_m: checkpoint.radius_m.toString(),
      enabled: checkpoint.enabled,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este checkpoint?')) return;

    try {
      const { error } = await supabase
        .from('checkpoints')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Checkpoint eliminado',
        description: 'El checkpoint se eliminó correctamente',
      });

      loadCheckpoints();
    } catch (error) {
      console.error('Error deleting checkpoint:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el checkpoint',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lat: '',
      lng: '',
      radius_m: '100',
      enabled: true,
    });
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gestión de Checkpoints
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Checkpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Checkpoint' : 'Nuevo Checkpoint'}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitud</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitud</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Radio (metros)</Label>
                  <Input
                    id="radius"
                    type="number"
                    value={formData.radius_m}
                    onChange={(e) => setFormData({ ...formData, radius_m: e.target.value })}
                    required
                  />
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
              <TableHead className="hidden md:table-cell">Coordenadas</TableHead>
              <TableHead className="hidden sm:table-cell">Radio (m)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkpoints.map((checkpoint) => (
              <TableRow key={checkpoint.id}>
                <TableCell className="font-medium">{checkpoint.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {checkpoint.lat.toFixed(4)}, {checkpoint.lng.toFixed(4)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{checkpoint.radius_m}</TableCell>
                <TableCell>
                  {checkpoint.enabled ? (
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
                      onClick={() => handleEdit(checkpoint)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(checkpoint.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CheckpointsManager;
