-- Crear tabla para almacenar contactos del formulario
CREATE TABLE public.contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL,
  celular TEXT NOT NULL,
  correo TEXT NOT NULL,
  necesidad TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  leido BOOLEAN DEFAULT false
);

-- Habilitar RLS
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;

-- Permitir que cualquiera inserte (formulario público)
CREATE POLICY "Cualquiera puede enviar formulario de contacto"
ON public.contactos
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Solo usuarios autenticados pueden ver los contactos
CREATE POLICY "Usuarios autenticados pueden ver contactos"
ON public.contactos
FOR SELECT
TO authenticated
USING (true);

-- Solo usuarios autenticados pueden actualizar (marcar como leído)
CREATE POLICY "Usuarios autenticados pueden actualizar contactos"
ON public.contactos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Crear índice para búsquedas por fecha
CREATE INDEX idx_contactos_created_at ON public.contactos(created_at DESC);