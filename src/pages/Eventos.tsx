import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Eventos = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [camiones, setCamiones] = useState<any[]>([]);
  const [casetas, setCasetas] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    camion_id: '',
    caseta_id: '',
    ruta_id: '',
    tipo_cruce: 'entrada'
  });

  useEffect(() => {
    loadData();
    
    // Suscribirse a nuevos cruces en tiempo real
    const subscription = supabase
      .channel('cruces_registrados')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'cruces_registrados' },
        (payload) => {
          console.log('Nuevo cruce registrado:', payload);
          loadEventos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadEventos(),
      loadCamiones(),
      loadCasetas(),
      loadRutas()
    ]);
    setLoading(false);
  };

  const loadEventos = async () => {
    const { data, error } = await supabase
      .from('cruces_registrados')
      .select(`
        *,
        camiones(placas),
        casetas_autopista(nombre, autopista),
        rutas(nombre)
      `)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading eventos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      });
    } else {
      setEventos(data || []);
    }
  };

  const loadCamiones = async () => {
    const { data } = await supabase
      .from('camiones')
      .select('id, placas')
      .eq('estado', 'activo')
      .order('placas');
    setCamiones(data || []);
  };

  const loadCasetas = async () => {
    const { data } = await supabase
      .from('casetas_autopista')
      .select('id, nombre, autopista')
      .eq('activa', true)
      .order('autopista, nombre');
    setCasetas(data || []);
  };

  const loadRutas = async () => {
    const { data } = await supabase
      .from('rutas')
      .select('id, nombre')
      .eq('activa', true)
      .order('nombre');
    setRutas(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.camion_id || !formData.caseta_id) {
      toast({
        title: "Error",
        description: "Camión y caseta son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('cruces_registrados')
      .insert([{
        ...formData,
        ruta_id: formData.ruta_id || null
      }]);

    if (error) {
      console.error('Error creating evento:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el evento",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Éxito",
        description: "Evento registrado correctamente",
      });
      setFormData({
        camion_id: '',
        caseta_id: '',
        ruta_id: '',
        tipo_cruce: 'entrada'
      });
      setIsDialogOpen(false);
      loadEventos();
    }
  };

  const getTipoCruceColor = (tipo: string) => {
    return tipo === 'entrada' ? 'default' : 'secondary';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Eventos de Cruces</h1>
              <p className="text-muted-foreground">Gestión de cruces de casetas de autopista</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Cruce</DialogTitle>
                  <DialogDescription>
                    Registra manualmente un cruce de caseta de autopista
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="camion_id">Camión</Label>
                    <Select value={formData.camion_id} onValueChange={(value) => setFormData(prev => ({ ...prev, camion_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un camión" />
                      </SelectTrigger>
                      <SelectContent>
                        {camiones.map((camion) => (
                          <SelectItem key={camion.id} value={camion.id}>
                            {camion.placas}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="caseta_id">Caseta</Label>
                    <Select value={formData.caseta_id} onValueChange={(value) => setFormData(prev => ({ ...prev, caseta_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una caseta" />
                      </SelectTrigger>
                      <SelectContent>
                        {casetas.map((caseta) => (
                          <SelectItem key={caseta.id} value={caseta.id}>
                            {caseta.autopista} - {caseta.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ruta_id">Ruta (Opcional)</Label>
                    <Select value={formData.ruta_id} onValueChange={(value) => setFormData(prev => ({ ...prev, ruta_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ruta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sin ruta asignada</SelectItem>
                        {rutas.map((ruta) => (
                          <SelectItem key={ruta.id} value={ruta.id}>
                            {ruta.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo_cruce">Tipo de Cruce</Label>
                    <Select value={formData.tipo_cruce} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_cruce: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="salida">Salida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Registrar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Cruces</CardTitle>
            <CardDescription>
              Últimos {eventos.length} eventos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Camión</TableHead>
                    <TableHead>Caseta</TableHead>
                    <TableHead>Autopista</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay eventos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventos.map((evento) => (
                      <TableRow key={evento.id}>
                        <TableCell>
                          {new Date(evento.timestamp).toLocaleString('es-MX')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {evento.camiones?.placas || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {evento.casetas_autopista?.nombre || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {evento.casetas_autopista?.autopista || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {evento.rutas?.nombre || 'Sin ruta'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTipoCruceColor(evento.tipo_cruce)}>
                            {evento.tipo_cruce}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Eventos;