-- Crear tablas principales del sistema de flotillas

-- Tabla de conductores
CREATE TABLE public.conductores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    licencia TEXT UNIQUE NOT NULL,
    telefono TEXT,
    email TEXT,
    estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de rutas
CREATE TABLE public.rutas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    distancia_km DECIMAL,
    tiempo_estimado_hrs DECIMAL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de camiones
CREATE TABLE public.camiones (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    placas TEXT UNIQUE NOT NULL,
    conductor_id UUID REFERENCES public.conductores(id),
    modelo TEXT,
    año INTEGER,
    estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'en_ruta', 'mantenimiento', 'inactivo')),
    ruta_asignada_id UUID REFERENCES public.rutas(id),
    ubicacion_actual_lat DECIMAL,
    ubicacion_actual_lng DECIMAL,
    velocidad_actual DECIMAL DEFAULT 0,
    combustible_porcentaje INTEGER DEFAULT 100,
    kilometraje_total DECIMAL DEFAULT 0,
    ultimo_mantenimiento DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de casetas de autopista
CREATE TABLE public.casetas_autopista (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    autopista TEXT NOT NULL,
    km DECIMAL,
    sentido TEXT CHECK (sentido IN ('norte', 'sur', 'este', 'oeste')),
    lat DECIMAL NOT NULL,
    lng DECIMAL NOT NULL,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de ubicaciones en tiempo real
CREATE TABLE public.ubicaciones_tiempo_real (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    camion_id UUID NOT NULL REFERENCES public.camiones(id) ON DELETE CASCADE,
    lat DECIMAL NOT NULL,
    lng DECIMAL NOT NULL,
    velocidad DECIMAL DEFAULT 0,
    direccion TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de cruces registrados
CREATE TABLE public.cruces_registrados (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    camion_id UUID NOT NULL REFERENCES public.camiones(id) ON DELETE CASCADE,
    caseta_id UUID NOT NULL REFERENCES public.casetas_autopista(id),
    tipo_cruce TEXT NOT NULL CHECK (tipo_cruce IN ('entrada', 'salida')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ruta_id UUID REFERENCES public.rutas(id)
);

-- Tabla de alertas
CREATE TABLE public.alertas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    camion_id UUID NOT NULL REFERENCES public.camiones(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('desviacion_ruta', 'cruce_fuera_horario', 'velocidad_excesiva', 'tiempo_inactivo', 'mantenimiento')),
    prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'revisada', 'resuelta')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resuelto_por UUID,
    resuelto_en TIMESTAMP WITH TIME ZONE
);

-- Tabla de supervisores/usuarios
CREATE TABLE public.supervisores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    rol TEXT DEFAULT 'supervisor' CHECK (rol IN ('admin', 'supervisor', 'operador')),
    empresa TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_ubicaciones_camion_timestamp ON public.ubicaciones_tiempo_real (camion_id, timestamp DESC);
CREATE INDEX idx_cruces_camion_timestamp ON public.cruces_registrados (camion_id, timestamp DESC);
CREATE INDEX idx_alertas_estado_prioridad ON public.alertas (estado, prioridad, timestamp DESC);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.conductores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casetas_autopista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicaciones_tiempo_real ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cruces_registrados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (acceso completo para usuarios autenticados por ahora)
CREATE POLICY "Acceso completo conductores" ON public.conductores FOR ALL USING (true);
CREATE POLICY "Acceso completo rutas" ON public.rutas FOR ALL USING (true);
CREATE POLICY "Acceso completo camiones" ON public.camiones FOR ALL USING (true);
CREATE POLICY "Acceso completo casetas" ON public.casetas_autopista FOR ALL USING (true);
CREATE POLICY "Acceso completo ubicaciones" ON public.ubicaciones_tiempo_real FOR ALL USING (true);
CREATE POLICY "Acceso completo cruces" ON public.cruces_registrados FOR ALL USING (true);
CREATE POLICY "Acceso completo alertas" ON public.alertas FOR ALL USING (true);
CREATE POLICY "Acceso completo supervisores" ON public.supervisores FOR ALL USING (true);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para timestamps
CREATE TRIGGER update_conductores_updated_at
    BEFORE UPDATE ON public.conductores
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rutas_updated_at
    BEFORE UPDATE ON public.rutas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_camiones_updated_at
    BEFORE UPDATE ON public.camiones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supervisores_updated_at
    BEFORE UPDATE ON public.supervisores
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para ubicaciones y alertas
ALTER PUBLICATION supabase_realtime ADD TABLE public.ubicaciones_tiempo_real;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alertas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.camiones;