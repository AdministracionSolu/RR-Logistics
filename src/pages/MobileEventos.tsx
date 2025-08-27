import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Search, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface TollEvent {
  id: string;
  tag_id: string;
  fecha_hora: string;
  caseta_nombre: string;
  concepto: string;
  importe: number;
  saldo: number;
  folio: string;
  placas?: string;
}

const MobileEventos = () => {
  const [events, setEvents] = useState<TollEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TollEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [filterConcept, setFilterConcept] = useState('all');
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadEvents();
    loadTags();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterTag, filterConcept]);

  const loadEvents = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('toll_events')
        .select(`
          id,
          tag_id,
          fecha_hora,
          caseta_nombre,
          concepto,
          importe,
          saldo,
          folio,
          camiones(placas)
        `)
        .order('fecha_hora', { ascending: false })
        .range((pageNum - 1) * ITEMS_PER_PAGE, pageNum * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      const eventsWithPlacas = data?.map(event => ({
        ...event,
        placas: event.camiones?.placas
      })) || [];

      if (append) {
        setEvents(prev => [...prev, ...eventsWithPlacas]);
      } else {
        setEvents(eventsWithPlacas);
      }

      setHasMore(data?.length === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await supabase
        .from('camiones')
        .select('tag_id')
        .not('tag_id', 'is', null)
        .order('tag_id');

      const uniqueTags = [...new Set(data?.map(item => item.tag_id) || [])];
      setTags(uniqueTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.tag_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.caseta_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.placas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.folio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTag !== 'all') {
      filtered = filtered.filter(event => event.tag_id === filterTag);
    }

    if (filterConcept !== 'all') {
      filtered = filtered.filter(event => event.concepto === filterConcept);
    }

    setFilteredEvents(filtered);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadEvents(page + 1, true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getConceptColor = (concepto: string) => {
    switch (concepto) {
      case 'PEAJE':
        return 'destructive';
      case 'RECARGA':
        return 'default';
      case 'COMISION':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterTag('all');
    setFilterConcept('all');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with search and filters */}
      <div className="p-4 border-b bg-background">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Eventos</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadEvents(1, false)}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>
                      Filtra los eventos por diferentes criterios
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium">TAG</label>
                      <Select value={filterTag} onValueChange={setFilterTag}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los TAGs</SelectItem>
                          {tags.map(tag => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Concepto</label>
                      <Select value={filterConcept} onValueChange={setFilterConcept}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="PEAJE">PEAJE</SelectItem>
                          <SelectItem value="RECARGA">RECARGA</SelectItem>
                          <SelectItem value="COMISION">COMISIÓN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={resetFilters} variant="outline" className="w-full">
                      Limpiar filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por TAG, caseta, placas o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Active filters */}
          {(filterTag !== 'all' || filterConcept !== 'all' || searchTerm) && (
            <div className="flex flex-wrap gap-2">
              {filterTag !== 'all' && (
                <Badge variant="secondary">TAG: {filterTag}</Badge>
              )}
              {filterConcept !== 'all' && (
                <Badge variant="secondary">Concepto: {filterConcept}</Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary">Búsqueda: {searchTerm}</Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {filteredEvents.length === 0 && !loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron eventos</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">
                        {event.placas || event.tag_id}
                      </span>
                      <Badge variant={getConceptColor(event.concepto)}>
                        {event.concepto}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${event.importe < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(event.importe)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Saldo: {formatCurrency(event.saldo)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p><strong>Caseta:</strong> {event.caseta_nombre}</p>
                    <p><strong>Fecha:</strong> {new Date(event.fecha_hora).toLocaleString('es-MX')}</p>
                    <p><strong>Folio:</strong> {event.folio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load more button */}
            {hasMore && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Cargar más eventos
                </Button>
              </div>
            )}

            {/* No more events */}
            {!hasMore && filteredEvents.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No hay más eventos
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileEventos;