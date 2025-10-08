-- Add spot_unit_id column to camiones table
ALTER TABLE public.camiones 
ADD COLUMN IF NOT EXISTS spot_unit_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_camiones_spot_unit_id 
ON public.camiones(spot_unit_id);

-- Insert new RRL-001 truck for RR Logistics with SPOT tracking
INSERT INTO public.camiones (
  user_id,
  placas,
  modelo,
  año,
  estado,
  spot_unit_id,
  tag_id,
  saldo_actual,
  gasto_dia_actual,
  combustible_porcentaje,
  velocidad_actual,
  ubicacion_actual_lat,
  ubicacion_actual_lng
) VALUES (
  '81fc8f69-70cd-4864-9da0-846bce59aa83',  -- Usuario B
  'RRL-001',                                 -- Placas RR Logistics
  'Kenworth T680',                          -- Modelo premium
  2024,                                     -- Año actual
  'activo',                                 -- Estado activo
  '0-5066561',                              -- SPOT unit_id
  NULL,                                     -- Sin tag de peaje aún
  0,                                        -- Saldo inicial
  0,                                        -- Sin gasto del día
  85,                                       -- Combustible 85%
  0,                                        -- Velocidad inicial
  25.63858,                                 -- Última posición SPOT - lat
  -100.31277                                -- Última posición SPOT - lng
);