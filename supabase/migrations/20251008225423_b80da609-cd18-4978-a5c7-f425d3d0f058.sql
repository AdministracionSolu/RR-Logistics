-- Activar Sector Prueba Monterrey para FIT testing
UPDATE public.sectors 
SET 
  enabled = true,
  is_proposed = false,
  updated_at = now()
WHERE name = 'Sector Prueba Monterrey';