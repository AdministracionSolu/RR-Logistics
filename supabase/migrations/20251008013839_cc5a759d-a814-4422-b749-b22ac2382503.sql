-- Agregar columna user_id a camiones para vincular con usuarios
ALTER TABLE public.camiones 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Crear índice para mejorar rendimiento de queries filtradas por usuario
CREATE INDEX idx_camiones_user_id ON public.camiones(user_id);

-- Actualizar RLS policy de camiones para filtrar por usuario
DROP POLICY IF EXISTS "Acceso completo camiones" ON public.camiones;

-- Policy para que usuarios vean solo sus propios camiones
CREATE POLICY "Users can view their own trucks" 
ON public.camiones 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy para que usuarios puedan insertar sus propios camiones
CREATE POLICY "Users can insert their own trucks" 
ON public.camiones 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy para que usuarios puedan actualizar sus propios camiones
CREATE POLICY "Users can update their own trucks" 
ON public.camiones 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy para que usuarios puedan eliminar sus propios camiones
CREATE POLICY "Users can delete their own trucks" 
ON public.camiones 
FOR DELETE 
USING (auth.uid() = user_id);

-- Comentario explicativo
COMMENT ON COLUMN public.camiones.user_id IS 'ID del usuario propietario del camión. Permite separar datos por usuario tipo_a vs tipo_b';