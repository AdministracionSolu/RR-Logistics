-- Actualizar opacidad del Sector Ciudad a 0.15 (más transparente)
UPDATE public.sectors
SET polygon = jsonb_set(
  polygon,
  '{features,0,properties,fillOpacity}',
  '0.15'::jsonb
)
WHERE name = 'Sector Ciudad';