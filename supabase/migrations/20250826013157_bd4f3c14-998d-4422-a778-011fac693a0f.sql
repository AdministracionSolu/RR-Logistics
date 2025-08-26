-- Crear tabla para eventos PASE (toll events)
CREATE TABLE public.toll_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id TEXT NOT NULL,
  concepto TEXT,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  caseta_id UUID REFERENCES public.casetas_autopista(id),
  caseta_nombre TEXT,
  carril_id INTEGER,
  clase TEXT,
  importe NUMERIC(10,2),
  saldo NUMERIC(10,2),
  folio TEXT,
  reconciled BOOLEAN DEFAULT false,
  source_type TEXT DEFAULT 'file', -- 'file' or 'scrape'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.toll_events ENABLE ROW LEVEL SECURITY;

-- Política de acceso completo
CREATE POLICY "Acceso completo toll_events" 
ON public.toll_events 
FOR ALL 
USING (true);

-- Agregar campos para tags a la tabla camiones
ALTER TABLE public.camiones 
ADD COLUMN tag_id TEXT UNIQUE,
ADD COLUMN saldo_actual NUMERIC(10,2) DEFAULT 0,
ADD COLUMN ultimo_cruce_id UUID,
ADD COLUMN ultimo_cruce_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN gasto_dia_actual NUMERIC(10,2) DEFAULT 0;

-- Agregar coordenadas y más info a casetas
ALTER TABLE public.casetas_autopista 
ADD COLUMN plaza_nombre TEXT,
ADD COLUMN direccion_valida TEXT[] DEFAULT ARRAY['norte', 'sur'], -- direcciones válidas
ADD COLUMN tipo_caseta TEXT DEFAULT 'peaje';

-- Crear tabla para rastros de movimiento
CREATE TABLE public.movimiento_rastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camion_id UUID NOT NULL REFERENCES public.camiones(id),
  toll_event_id UUID REFERENCES public.toll_events(id),
  caseta_id UUID NOT NULL REFERENCES public.casetas_autopista(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  direccion_inferida TEXT, -- 'norte', 'sur', 'ida', 'regreso'
  orden_secuencia INTEGER, -- para ordenar el rastro
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.movimiento_rastros ENABLE ROW LEVEL SECURITY;

-- Política de acceso completo
CREATE POLICY "Acceso completo movimiento_rastros" 
ON public.movimiento_rastros 
FOR ALL 
USING (true);

-- Actualizar tabla de alertas para nuevos tipos
ALTER TABLE public.alertas 
ADD COLUMN tag_relacionado TEXT,
ADD COLUMN saldo_alerta NUMERIC(10,2),
ADD COLUMN minutos_sin_cruce INTEGER;

-- Función para actualizar rastros cuando hay un nuevo toll_event
CREATE OR REPLACE FUNCTION public.update_truck_trail()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar información del camión
  UPDATE public.camiones 
  SET 
    ultimo_cruce_timestamp = NEW.fecha_hora,
    saldo_actual = NEW.saldo,
    updated_at = now()
  WHERE tag_id = NEW.tag_id;
  
  -- Crear entrada en rastro de movimiento
  INSERT INTO public.movimiento_rastros (
    camion_id, 
    toll_event_id, 
    caseta_id, 
    timestamp,
    orden_secuencia
  )
  SELECT 
    c.id,
    NEW.id,
    NEW.caseta_id,
    NEW.fecha_hora,
    COALESCE(
      (SELECT MAX(orden_secuencia) + 1 
       FROM public.movimiento_rastros 
       WHERE camion_id = c.id 
       AND DATE(timestamp) = DATE(NEW.fecha_hora)
      ), 1
    )
  FROM public.camiones c
  WHERE c.tag_id = NEW.tag_id AND NEW.caseta_id IS NOT NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar rastros
CREATE TRIGGER update_truck_trail_trigger
  AFTER INSERT ON public.toll_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_truck_trail();

-- Función para calcular gasto diario
CREATE OR REPLACE FUNCTION public.calculate_daily_expenses()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar gasto del día para el camión
  UPDATE public.camiones 
  SET gasto_dia_actual = (
    SELECT COALESCE(SUM(importe), 0)
    FROM public.toll_events te
    WHERE te.tag_id = NEW.tag_id 
    AND DATE(te.fecha_hora) = CURRENT_DATE
  )
  WHERE tag_id = NEW.tag_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular gastos diarios
CREATE TRIGGER calculate_daily_expenses_trigger
  AFTER INSERT OR UPDATE ON public.toll_events
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_daily_expenses();

-- Crear índices para performance
CREATE INDEX idx_toll_events_tag_id ON public.toll_events(tag_id);
CREATE INDEX idx_toll_events_fecha_hora ON public.toll_events(fecha_hora);
CREATE INDEX idx_toll_events_caseta_id ON public.toll_events(caseta_id);
CREATE INDEX idx_movimiento_rastros_camion_timestamp ON public.movimiento_rastros(camion_id, timestamp DESC);
CREATE INDEX idx_camiones_tag_id ON public.camiones(tag_id);

-- Habilitar realtime para nuevas tablas
ALTER TABLE public.toll_events REPLICA IDENTITY FULL;
ALTER TABLE public.movimiento_rastros REPLICA IDENTITY FULL;

-- Trigger de timestamps para nuevas tablas
CREATE TRIGGER update_toll_events_updated_at
  BEFORE UPDATE ON public.toll_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();