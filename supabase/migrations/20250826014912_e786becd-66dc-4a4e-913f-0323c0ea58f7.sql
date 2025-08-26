-- Update existing truck data based on uploaded toll events
UPDATE public.camiones 
SET 
  ultimo_cruce_timestamp = (
    SELECT MAX(fecha_hora) 
    FROM public.toll_events 
    WHERE toll_events.tag_id = camiones.tag_id
  ),
  saldo_actual = (
    SELECT saldo 
    FROM public.toll_events 
    WHERE toll_events.tag_id = camiones.tag_id 
    ORDER BY fecha_hora DESC 
    LIMIT 1
  ),
  gasto_dia_actual = (
    SELECT COALESCE(SUM(
      CASE WHEN importe < 0 THEN ABS(importe) ELSE 0 END
    ), 0)
    FROM public.toll_events
    WHERE toll_events.tag_id = camiones.tag_id 
    AND DATE(fecha_hora) = CURRENT_DATE
  )
WHERE EXISTS (
  SELECT 1 FROM public.toll_events 
  WHERE toll_events.tag_id = camiones.tag_id
);