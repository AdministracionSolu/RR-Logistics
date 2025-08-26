-- Corregir advertencias de seguridad - agregar search_path a las funciones

-- Función para actualizar rastros cuando hay un nuevo toll_event (corregida)
CREATE OR REPLACE FUNCTION public.update_truck_trail()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql AS $$
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
$$;

-- Función para calcular gasto diario (corregida)
CREATE OR REPLACE FUNCTION public.calculate_daily_expenses()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql AS $$
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
$$;

-- Función update_updated_at_column también necesita search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;