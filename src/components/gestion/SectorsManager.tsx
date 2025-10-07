import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit, MapPin, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Sector {
  id: number;
  name: string;
  polygon: any;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

const SectorsManager = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    polygon: '',
    enabled: true,
  });
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const loadSectors = async () => {
    setLoading(true);
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
        title: "Error",
        description: "No se pudieron cargar los sectores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSectors();
    
    // Load mapbox token from localStorage
    const token = localStorage.getItem('mapbox_token');
    if (token) {
      setMapboxToken(token);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || sectors.length === 0) return;

    if (!map.current) {
      mapboxgl.accessToken = mapboxToken;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-105.8, 26.9],
        zoom: 8,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    map.current.on('load', () => {
      // Remove existing layers and sources
      if (map.current?.getLayer('sectors-fill')) {
        map.current.removeLayer('sectors-fill');
      }
      if (map.current?.getLayer('sectors-outline')) {
        map.current.removeLayer('sectors-outline');
      }
      if (map.current?.getSource('sectors')) {
        map.current.removeSource('sectors');
      }

      const geojson: any = {
        type: 'FeatureCollection',
        features: sectors.filter(s => s.enabled).map(sector => ({
          type: 'Feature',
          properties: { name: sector.name, id: sector.id },
          geometry: sector.polygon,
        })),
      };

      map.current?.addSource('sectors', {
        type: 'geojson',
        data: geojson,
      });

      map.current?.addLayer({
        id: 'sectors-fill',
        type: 'fill',
        source: 'sectors',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.2,
        },
      });

      map.current?.addLayer({
        id: 'sectors-outline',
        type: 'line',
        source: 'sectors',
        paint: {
          'line-color': '#3b82f6',
          'line-width': 2,
        },
      });

      // Add click event for popups
      map.current?.on('click', 'sectors-fill', (e: any) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${feature.properties.name}</strong>`)
            .addTo(map.current!);
        }
      });

      // Change cursor on hover
      map.current?.on('mouseenter', 'sectors-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current?.on('mouseleave', 'sectors-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, sectors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let polygonData;
      try {
        polygonData = JSON.parse(formData.polygon);
      } catch {
        toast({
          title: "Error",
          description: "Formato de polígono inválido. Debe ser JSON válido.",
          variant: "destructive",
        });
        return;
      }

      if (editingSector) {
        const { error } = await supabase
          .from('sectors')
          .update({
            name: formData.name,
            polygon: polygonData,
            enabled: formData.enabled,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSector.id);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Sector actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from('sectors')
          .insert({
            name: formData.name,
            polygon: polygonData,
            enabled: formData.enabled,
          });

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Sector creado correctamente",
        });
      }

      setDialogOpen(false);
      resetForm();
      loadSectors();
    } catch (error) {
      console.error('Error saving sector:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el sector",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      name: sector.name,
      polygon: JSON.stringify(sector.polygon, null, 2),
      enabled: sector.enabled,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este sector?')) return;

    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Sector eliminado correctamente",
      });
      loadSectors();
    } catch (error) {
      console.error('Error deleting sector:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el sector",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingSector(null);
    setFormData({
      name: '',
      polygon: '',
      enabled: true,
    });
  };

  return (
    <div className="space-y-4">
      {!mapboxToken && (
        <Card className="border-yellow-500">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Necesitas un token de Mapbox para visualizar los sectores en el mapa.
            </p>
            <Input
              placeholder="Ingresa tu token de Mapbox"
              value={mapboxToken}
              onChange={(e) => {
                setMapboxToken(e.target.value);
                localStorage.setItem('mapbox_token', e.target.value);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sectores (Rutas de Camiones)
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSectors}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      resetForm();
                      setDialogOpen(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Sector
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingSector ? 'Editar Sector' : 'Nuevo Sector'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Sector</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: Sector Carretera Norte"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="polygon">Polígono (GeoJSON)</Label>
                        <textarea
                          id="polygon"
                          className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                          value={formData.polygon}
                          onChange={(e) => setFormData({ ...formData, polygon: e.target.value })}
                          placeholder='{"type": "Polygon", "coordinates": [[[-105.7, 26.9], ...]]}'
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Formato GeoJSON. Coordenadas en [longitud, latitud].
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enabled"
                          checked={formData.enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                        />
                        <Label htmlFor="enabled">Sector activo</Label>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingSector ? 'Actualizar' : 'Crear'} Sector
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : sectors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay sectores registrados
                </div>
              ) : (
                <div className="space-y-3">
                  {sectors.map((sector) => (
                    <Card key={sector.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{sector.name}</h3>
                            <Badge variant={sector.enabled ? 'default' : 'secondary'}>
                              {sector.enabled ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ID: {sector.id} • Creado: {new Date(sector.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
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
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mapa de Sectores</CardTitle>
          </CardHeader>
          <CardContent>
            {mapboxToken ? (
              <div ref={mapContainer} className="w-full h-[500px] rounded-lg" />
            ) : (
              <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
                <p className="text-muted-foreground">Configura tu token de Mapbox para ver el mapa</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SectorsManager;
