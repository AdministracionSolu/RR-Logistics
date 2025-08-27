-- Fix the alertas table check constraint to allow "sin_actividad" type
ALTER TABLE public.alertas DROP CONSTRAINT IF EXISTS alertas_tipo_check;

-- Add the proper check constraint with all allowed alert types
ALTER TABLE public.alertas ADD CONSTRAINT alertas_tipo_check 
CHECK (tipo IN ('cobro_duplicado', 'saldo_bajo', 'sin_actividad', 'mantenimiento', 'ruta_desviada', 'velocidad_excesiva'));

-- Also fix estado constraint if it exists
ALTER TABLE public.alertas DROP CONSTRAINT IF EXISTS alertas_estado_check;
ALTER TABLE public.alertas ADD CONSTRAINT alertas_estado_check 
CHECK (estado IN ('activa', 'resuelta', 'descartada', 'en_proceso'));

-- Fix prioridad constraint
ALTER TABLE public.alertas DROP CONSTRAINT IF EXISTS alertas_prioridad_check;
ALTER TABLE public.alertas ADD CONSTRAINT alertas_prioridad_check 
CHECK (prioridad IN ('baja', 'media', 'alta', 'critica'));