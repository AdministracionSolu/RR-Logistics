-- Crear tabla de posiciones recibidas del feed SPOT
CREATE TABLE public.positions (
  id BIGSERIAL PRIMARY KEY,
  unit_id TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  altitude NUMERIC,
  ts TIMESTAMP WITH TIME ZONE NOT NULL,
  raw JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para optimizar consultas
CREATE INDEX idx_positions_unit_id ON public.positions(unit_id);
CREATE INDEX idx_positions_ts ON public.positions(ts DESC);
CREATE INDEX idx_positions_processed ON public.positions(processed) WHERE processed = false;

-- Crear tabla de checkpoints (puntos con radio)
CREATE TABLE public.checkpoints (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  radius_m INTEGER NOT NULL DEFAULT 100,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de sectores (polígonos)
CREATE TABLE public.sectors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  polygon JSONB NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de eventos generados
CREATE TABLE public.events (
  id BIGSERIAL PRIMARY KEY,
  unit_id TEXT NOT NULL,
  type TEXT NOT NULL,
  ref_id BIGINT,
  ref_type TEXT,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  ts TIMESTAMP WITH TIME ZONE NOT NULL,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para eventos
CREATE INDEX idx_events_unit_id ON public.events(unit_id);
CREATE INDEX idx_events_type ON public.events(type);
CREATE INDEX idx_events_ts ON public.events(ts DESC);

-- Crear tabla de reglas de notificación
CREATE TABLE public.notify_rules (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id BIGINT NOT NULL,
  channel JSONB NOT NULL,
  conditions JSONB,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para tracking de estado de unidades en checkpoints/sectores
CREATE TABLE public.unit_states (
  id BIGSERIAL PRIMARY KEY,
  unit_id TEXT NOT NULL,
  ref_type TEXT NOT NULL,
  ref_id BIGINT NOT NULL,
  is_inside BOOLEAN NOT NULL DEFAULT false,
  entered_at TIMESTAMP WITH TIME ZONE,
  last_seen TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(unit_id, ref_type, ref_id)
);

-- Índice para unit_states
CREATE INDEX idx_unit_states_unit ON public.unit_states(unit_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column_generic()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_checkpoints_updated_at
BEFORE UPDATE ON public.checkpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_sectors_updated_at
BEFORE UPDATE ON public.sectors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_notify_rules_updated_at
BEFORE UPDATE ON public.notify_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column_generic();

-- Habilitar RLS en todas las tablas
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notify_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_states ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (acceso completo para usuarios autenticados por ahora)
CREATE POLICY "Full access to positions" ON public.positions FOR ALL USING (true);
CREATE POLICY "Full access to checkpoints" ON public.checkpoints FOR ALL USING (true);
CREATE POLICY "Full access to sectors" ON public.sectors FOR ALL USING (true);
CREATE POLICY "Full access to events" ON public.events FOR ALL USING (true);
CREATE POLICY "Full access to notify_rules" ON public.notify_rules FOR ALL USING (true);
CREATE POLICY "Full access to unit_states" ON public.unit_states FOR ALL USING (true);

-- Habilitar realtime para eventos
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;