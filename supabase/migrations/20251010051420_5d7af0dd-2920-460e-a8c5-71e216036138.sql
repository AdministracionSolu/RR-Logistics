-- Corregir kilometraje total y nombre de unidad
UPDATE camiones 
SET 
  kilometraje_total = 15.22,
  modelo = 'Unidad Prueba',
  updated_at = NOW()
WHERE spot_unit_id = '0-5066561';