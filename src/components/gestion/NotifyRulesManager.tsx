import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface NotifyRule {
  id: number;
  name: string;
  target_type: string;
  target_id: number;
  channel: any;
  enabled: boolean;
  created_at: string;
}

interface Target {
  id: number;
  name: string;
}

const NotifyRulesManager = () => {
  const [rules, setRules] = useState<NotifyRule[]>([]);
  const [checkpoints, setCheckpoints] = useState<Target[]>([]);
  const [sectors, setSectors] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    target_type: 'checkpoint',
    target_id: '',
    email: '',
    webhook: '',
    enabled: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [rulesRes, checkpointsRes, sectorsRes] = await Promise.all([
        supabase.from('notify_rules').select('*').order('created_at', { ascending: false }),
        supabase.from('checkpoints').select('id, name'),
        supabase.from('sectors').select('id, name'),
      ]);

      if (rulesRes.error) throw rulesRes.error;
      setRules(rulesRes.data || []);
      setCheckpoints(checkpointsRes.data || []);
      setSectors(sectorsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reglas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const channel: any = {};
      
      if (formData.email) {
        channel.email = formData.email.split(',').map(e => e.trim());
      }
      if (formData.webhook) {
        channel.webhook = formData.webhook.trim();
      }

      if (Object.keys(channel).length === 0) {
        throw new Error('Debe especificar al menos un canal de notificación');
      }

      const ruleData = {
        name: formData.name,
        target_type: formData.target_type,
        target_id: parseInt(formData.target_id),
        channel,
        enabled: formData.enabled,
      };

      if (editingId) {
        const { error } = await supabase
          .from('notify_rules')
          .update(ruleData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Regla actualizada',
          description: 'La regla se actualizó correctamente',
        });
      } else {
        const { error } = await supabase
          .from('notify_rules')
          .insert([ruleData]);

        if (error) throw error;

        toast({
          title: 'Regla creada',
          description: 'La regla se creó correctamente',
        });
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving rule:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar la regla',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (rule: NotifyRule) => {
    setEditingId(rule.id);
    setFormData({
      name: rule.name,
      target_type: rule.target_type,
      target_id: rule.target_id.toString(),
      email: rule.channel?.email?.join(', ') || '',
      webhook: rule.channel?.webhook || '',
      enabled: rule.enabled,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta regla?')) return;

    try {
      const { error } = await supabase
        .from('notify_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Regla eliminada',
        description: 'La regla se eliminó correctamente',
      });

      loadData();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la regla',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      target_type: 'checkpoint',
      target_id: '',
      email: '',
      webhook: '',
      enabled: true,
    });
    setEditingId(null);
  };

  const getTargetName = (rule: NotifyRule) => {
    const targets = rule.target_type === 'checkpoint' ? checkpoints : sectors;
    const target = targets.find(t => t.id === rule.target_id);
    return target?.name || `${rule.target_type} #${rule.target_id}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reglas de Notificación
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Regla
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Regla' : 'Nueva Regla'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Regla</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_type">Tipo de Objetivo</Label>
                  <Select
                    value={formData.target_type}
                    onValueChange={(value) => setFormData({ ...formData, target_type: value, target_id: '' })}
                  >
                    <SelectTrigger id="target_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkpoint">Checkpoint</SelectItem>
                      <SelectItem value="sector">Sector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_id">Objetivo</Label>
                  <Select
                    value={formData.target_id}
                    onValueChange={(value) => setFormData({ ...formData, target_id: value })}
                  >
                    <SelectTrigger id="target_id">
                      <SelectValue placeholder="Seleccione un objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.target_type === 'checkpoint' ? checkpoints : sectors).map((target) => (
                        <SelectItem key={target.id} value={target.id.toString()}>
                          {target.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Emails (separados por coma)</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="email1@example.com, email2@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <Input
                    id="webhook"
                    type="url"
                    placeholder="https://ejemplo.com/webhook"
                    value={formData.webhook}
                    onChange={(e) => setFormData({ ...formData, webhook: e.target.value })}
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
                  <Label htmlFor="enabled">Activa</Label>
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
              <TableHead className="hidden md:table-cell">Objetivo</TableHead>
              <TableHead className="hidden sm:table-cell">Canales</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {rule.target_type === 'checkpoint' ? '📍' : '🔲'} {getTargetName(rule)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {Object.keys(rule.channel).join(', ')}
                </TableCell>
                <TableCell>
                  {rule.enabled ? (
                    <span className="text-green-600">Activa</span>
                  ) : (
                    <span className="text-gray-400">Inactiva</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(rule.id)}
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

export default NotifyRulesManager;
