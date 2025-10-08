-- Paso 1: Crear el Sector Monterrey con un polígono buffer simplificado
-- Usamos la geometría de la ruta existente para crear un área de detección

INSERT INTO public.sectors (name, polygon, enabled, color, buffer_m, source, created_by)
VALUES (
  'Sector Monterrey',
  -- Creamos un polígono buffer manual usando los puntos extremos de la ruta
  -- Esta es una simplificación que cubrirá el área de la ruta
  jsonb_build_object(
    'type', 'Polygon',
    'coordinates', jsonb_build_array(
      jsonb_build_array(
        jsonb_build_array(-100.32, 25.65),
        jsonb_build_array(-100.26, 25.65),
        jsonb_build_array(-100.26, 25.58),
        jsonb_build_array(-100.32, 25.58),
        jsonb_build_array(-100.32, 25.65)
      )
    )
  ),
  true, -- enabled
  '#4ADE80', -- color verde
  500, -- buffer 500m
  'manual',
  'system'
);

-- Paso 2: Asociar la ruta existente "Sector Prueba Monterrey" con el nuevo sector
UPDATE public.routes
SET sector_id = (SELECT id FROM public.sectors WHERE name = 'Sector Monterrey' LIMIT 1)
WHERE name = 'Sector Prueba Monterrey';

-- Paso 3: Crear reglas de notificación para entrada al sector
INSERT INTO public.notify_rules (target_type, target_id, name, enabled, channel, conditions)
VALUES 
(
  'sector',
  (SELECT id FROM public.sectors WHERE name = 'Sector Monterrey' LIMIT 1),
  'Alerta: Entrada a Sector Monterrey',
  true,
  jsonb_build_object(
    'type', 'webhook',
    'url', 'https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/send-notification',
    'events', jsonb_build_array('sector_enter')
  ),
  jsonb_build_object(
    'event_types', jsonb_build_array('sector_enter')
  )
),
(
  'sector',
  (SELECT id FROM public.sectors WHERE name = 'Sector Monterrey' LIMIT 1),
  'Alerta: Salida de Sector Monterrey',
  true,
  jsonb_build_object(
    'type', 'webhook',
    'url', 'https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/send-notification',
    'events', jsonb_build_array('sector_exit')
  ),
  jsonb_build_object(
    'event_types', jsonb_build_array('sector_exit')
  )
);

-- Paso 4: Marcar la última posición como no procesada para forzar detección
UPDATE public.positions
SET processed = false
WHERE id = (SELECT id FROM public.positions ORDER BY ts DESC LIMIT 1);

-- Paso 5: Crear evento inicial de entrada al sector si la posición actual está dentro
-- (El edge function process-events se encargará de esto automáticamente)