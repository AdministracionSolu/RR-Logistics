import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Box, RefreshCw, MapPin, Check } from 'lucide-react';
import SectorRefreshButton from './SectorRefreshButton';
import SectorQAPanel from './SectorQAPanel';
import CreateMonterreyRoute from './CreateMonterreyRoute';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Sector {
  id: number;
  name: string;
  polygon: any;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  source?: string;
  buffer_m?: number;
  color?: string;
  is_proposed?: boolean;
}

// Componente separado para renderizar sectores en el mapa
const toPositions = (polygon: any): [number, number][] | null => {
  try {
    if (!polygon || polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates) || !Array.isArray(polygon.coordinates[0])) return null;
    const ring = polygon.coordinates[0].filter((coord: any) =>
      Array.isArray(coord) &&
      coord.length >= 2 &&
      Number.isFinite(Number(coord[0])) &&
      Number.isFinite(Number(coord[1]))
    );
    if (ring.length < 3) return null;
    return ring.map((coord: number[]) => [Number(coord[1]), Number(coord[0])] as [number, number]);
  } catch {
    return null;
  }
};

const SectorsManager = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    polygon: '',
    enabled: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([26.9, -105.8], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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

  // Update map when sectors change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Sector colors
    const sectorColors: Record<string, string> = {
      'Sector Ciudad': '#4ABFF2',
      'Sector Carretera': '#E54848',
      'Sector San Francisco del Oro': '#4ADE80',
      'Sector Mina': '#A855F7',
      'Sector Prueba Monterrey': '#1267FF',
    };

    // Clear existing layers
    layersRef.current.forEach(layer => layer.remove());
    layersRef.current = [];

    // Add all sectors to map (both current and proposed)
    sectors.forEach(sector => {
      const positions = toPositions(sector.polygon);
      if (!positions) return;
      
      const baseName = sector.name.replace(' (Propuesta)', '');
      const color = sector.color || sectorColors[baseName] || '#3b82f6';
      const isProposed = sector.is_proposed || sector.name.includes('(Propuesta)');
      
      const polygon = L.polygon(positions, {
        color: color,
        fillColor: color,
        fillOpacity: isProposed ? 0.15 : 0.25,
        weight: isProposed ? 2 : 3,
        opacity: isProposed ? 0.6 : 0.8,
        dashArray: isProposed ? '5, 10' : undefined,
      }).addTo(mapInstanceRef.current!);
      
      polygon.bindPopup(`
        <div style="padding: 8px;">
          <strong style="color: ${color}; font-size: 1.1em;">${sector.name}</strong>
          ${isProposed ? '<p style="margin: 2px 0; font-size: 0.8em; color: #f59e0b;">⚠️ Propuesta</p>' : ''}
          <p style="margin: 4px 0 0 0; font-size: 0.9em;">
            ${sector.source === 'osm' ? '📍 OSM' : '🗺️ Mapbox'} · 
            Buffer: ${sector.buffer_m || 250}m
          </p>
        </div>
      `);
      layersRef.current.push(polygon);
    });

    // Load and render routes with markers
    loadAndRenderRoutes();
  }, [sectors]);

  // Load and render routes on the map
  const loadAndRenderRoutes = async () => {
    if (!mapInstanceRef.current) return;

    try {
      const { data: routes, error } = await supabase
        .from('routes')
        .select('*');

      if (error) throw error;

      routes?.forEach((route: any) => {
        if (!route.line_geometry?.coordinates) return;

        const coords = route.line_geometry.coordinates;
        const latlngs: [number, number][] = coords.map((coord: number[]) => 
          [coord[1], coord[0]] as [number, number]
        );

        // Draw the route line
        const polyline = L.polyline(latlngs, {
          color: route.line_geometry.color || '#1267FF',
          weight: route.line_geometry.weight || 5,
          opacity: 0.8,
        }).addTo(mapInstanceRef.current!);

        polyline.bindPopup(`
          <div style="padding: 8px;">
            <strong style="font-size: 1.1em;">${route.name}</strong>
          </div>
        `);

        layersRef.current.push(polyline);

        // Add markers if specified
        if (route.line_geometry.markers) {
          route.line_geometry.markers.forEach((marker: any) => {
            const markerIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background: ${marker.color || '#1267FF'}; color: white; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${marker.label}</div>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            });

            const leafletMarker = L.marker([marker.lat, marker.lng], { icon: markerIcon })
              .addTo(mapInstanceRef.current!);

            layersRef.current.push(leafletMarker);
          });
        }

        // Auto-fit bounds to show the entire route
        if (latlngs.length > 0) {
          const bounds = L.latLngBounds(latlngs);
          mapInstanceRef.current!.fitBounds(bounds, { padding: [50, 50] });
        }
      });
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let polygon;
      try {
        polygon = JSON.parse(formData.polygon);
        if (polygon.type !== 'Polygon' || !polygon.coordinates) {
          throw new Error('Formato inválido');
        }
      } catch (parseError) {
        toast({
          title: 'Error',
          description: 'El formato del polígono no es válido. Use formato GeoJSON',
          variant: 'destructive',
        });
        return;
      }

      const sectorData = {
        name: formData.name,
        polygon: polygon,
        enabled: formData.enabled,
      };

      if (editingId) {
        const { error } = await supabase
          .from('sectors')
          .update({ ...sectorData, updated_at: new Date().toISOString() })
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
    } catch (error) {
      console.error('Error saving sector:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el sector',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingId(sector.id);
    setFormData({
      name: sector.name,
      polygon: JSON.stringify(sector.polygon, null, 2),
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
      polygon: '',
      enabled: true,
    });
    setEditingId(null);
  };

  const handleApproveSector = async (sectorId: number) => {
    try {
      const { data: proposed } = await supabase
        .from('sectors')
        .select('*')
        .eq('id', sectorId)
        .single();

      if (!proposed) return;

      const originalName = proposed.name.replace(' (Propuesta)', '');
      const { data: original } = await supabase
        .from('sectors')
        .select('*')
        .eq('name', originalName)
        .eq('is_proposed', false)
        .single();

      if (original) {
        await supabase.from('sector_history').insert({
          sector_id: original.id,
          changed_by: (await supabase.auth.getUser()).data.user?.email,
          action: 'replace',
          old_geometry: original.polygon,
          new_geometry: proposed.polygon,
          parameters: { buffer_m: proposed.buffer_m, source: proposed.source },
        });

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

        await supabase.from('sectors').delete().eq('id', sectorId);
      } else {
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

      loadSectors();
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Sectores (Rutas de Camiones)
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Áreas geográficas para detección de eventos
                </p>
              </div>
              <div className="flex gap-2">
                <CreateMonterreyRoute />
                <SectorRefreshButton onRefresh={loadSectors} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSectors}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
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
                        <Label htmlFor="name">Nombre del Sector</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: Sector Carretera Norte"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="polygon">Polígono (GeoJSON)</Label>
                        <Textarea
                          id="polygon"
                          value={formData.polygon}
                          onChange={(e) => setFormData({ ...formData, polygon: e.target.value })}
                          placeholder='{"type":"Polygon","coordinates":[[[lng,lat],[lng,lat],...]]}'
                          rows={8}
                          required
                          className="font-mono text-xs"
                        />
                        <p className="text-xs text-muted-foreground">
                          Formato GeoJSON. Coordenadas en [longitud, latitud].
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
                        <Label htmlFor="enabled">Sector activo</Label>
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
                          {editingId ? 'Actualizar' : 'Crear'} Sector
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
                    <Card 
                      key={sector.id} 
                      className={`p-4 ${sector.is_proposed || sector.name.includes('(Propuesta)') ? 'border-orange-500 border-2' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{sector.name}</h3>
                            <Badge variant={sector.enabled ? 'default' : 'secondary'}>
                              {sector.enabled ? 'Activo' : 'Inactivo'}
                            </Badge>
                            {(sector.is_proposed || sector.name.includes('(Propuesta)')) && (
                              <Badge variant="outline" className="border-orange-500 text-orange-600">
                                Propuesta
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ID: {sector.id} • {sector.source === 'osm' ? '📍 OSM' : '🗺️ Mapbox'} • 
                            Buffer: {sector.buffer_m || 250}m
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(sector.is_proposed || sector.name.includes('(Propuesta)')) && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApproveSector(sector.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
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
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa de Sectores
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <div ref={mapRef} className="w-full h-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

        <div>
          <SectorQAPanel onRefresh={loadSectors} />
        </div>
      </div>
    </div>
  );
};

export default SectorsManager;
