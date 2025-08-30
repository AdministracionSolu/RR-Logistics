-- Actualizar toll_events para asignar caseta_id basado en el nombre de la caseta
UPDATE public.toll_events 
SET caseta_id = c.id
FROM public.casetas_autopista c
WHERE toll_events.caseta_nombre = c.nombre
AND toll_events.caseta_id IS NULL;