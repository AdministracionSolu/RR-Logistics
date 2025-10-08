-- Crear reglas de notificación para prueba FIT
-- Checkpoint 8: Costco CheckPoint
INSERT INTO public.notify_rules (name, target_type, target_id, channel, enabled)
VALUES (
  'FIT Test - Costco Entry/Exit',
  'checkpoint',
  8,
  '{"webhook": "https://webhook.site/your-costco-endpoint", "email": "test@example.com"}'::jsonb,
  true
);

-- Checkpoint 9: Walmart CheckPoint  
INSERT INTO public.notify_rules (name, target_type, target_id, channel, enabled)
VALUES (
  'FIT Test - Walmart Entry/Exit',
  'checkpoint',
  9,
  '{"webhook": "https://webhook.site/your-walmart-endpoint", "email": "test@example.com"}'::jsonb,
  true
);

-- Checkpoint 10: Casa Checkpoint 3
INSERT INTO public.notify_rules (name, target_type, target_id, channel, enabled)
VALUES (
  'FIT Test - Casa Entry/Exit',
  'checkpoint',
  10,
  '{"webhook": "https://webhook.site/your-casa-endpoint", "email": "test@example.com"}'::jsonb,
  true
);

-- Crear una unidad de prueba específica para FIT si no existe
INSERT INTO public.camiones (placas, spot_unit_id, estado, modelo, año)
VALUES (
  'FIT-TEST',
  '0-5066561',
  'activo',
  'Unidad de Prueba FIT',
  2024
)
ON CONFLICT DO NOTHING;