# 🗄️ Supabase Full Backup - RR Logistics

**Proyecto Supabase ID**: `ecbmrrpssdmmoqygtknf`
**Fecha de respaldo**: 2026-03-09

Este documento contiene el 100% de la configuración de Supabase para recrear el proyecto desde cero.

---

## 📋 Índice

1. [Tablas y Schema](#1-tablas-y-schema)
2. [Funciones de Base de Datos](#2-funciones-de-base-de-datos)
3. [RLS Policies](#3-rls-policies)
4. [Edge Functions](#4-edge-functions)
5. [Secrets](#5-secrets)
6. [Cron Jobs](#6-cron-jobs)
7. [config.toml](#7-configtoml)

---

## 1. Tablas y Schema

### SQL para recrear TODAS las tablas

```sql
-- ============================================
-- TABLA: profiles
-- ============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  user_type text NOT NULL DEFAULT 'tipo_a',
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: conductores
-- ============================================
CREATE TABLE public.conductores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  licencia text NOT NULL,
  email text,
  telefono text,
  estado text DEFAULT 'activo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: rutas
-- ============================================
CREATE TABLE public.rutas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  origen text NOT NULL,
  destino text NOT NULL,
  descripcion text,
  distancia_km numeric,
  tiempo_estimado_hrs numeric,
  activa boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: camiones
-- ============================================
CREATE TABLE public.camiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placas text NOT NULL,
  modelo text,
  año integer,
  estado text DEFAULT 'activo',
  tag_id text,
  spot_unit_id text,
  user_id uuid,
  conductor_id uuid REFERENCES public.conductores(id),
  ruta_asignada_id uuid REFERENCES public.rutas(id),
  ubicacion_actual_lat numeric,
  ubicacion_actual_lng numeric,
  velocidad_actual numeric DEFAULT 0,
  kilometraje_total numeric DEFAULT 0,
  combustible_porcentaje integer DEFAULT 100,
  saldo_actual numeric DEFAULT 0,
  gasto_dia_actual numeric DEFAULT 0,
  ultimo_cruce_id uuid,
  ultimo_cruce_timestamp timestamptz,
  ultimo_mantenimiento date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: casetas_autopista
-- ============================================
CREATE TABLE public.casetas_autopista (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  autopista text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  km numeric,
  tipo_caseta text DEFAULT 'peaje',
  sentido text,
  plaza_nombre text,
  activa boolean DEFAULT true,
  direccion_valida text[] DEFAULT ARRAY['norte','sur'],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: toll_events
-- ============================================
CREATE TABLE public.toll_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text NOT NULL,
  fecha_hora timestamptz NOT NULL,
  caseta_id uuid REFERENCES public.casetas_autopista(id),
  caseta_nombre text,
  importe numeric,
  saldo numeric,
  folio text,
  concepto text,
  clase text,
  carril_id integer,
  source_type text DEFAULT 'file',
  reconciled boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: cruces_registrados
-- ============================================
CREATE TABLE public.cruces_registrados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camion_id uuid NOT NULL REFERENCES public.camiones(id),
  caseta_id uuid NOT NULL REFERENCES public.casetas_autopista(id),
  tipo_cruce text NOT NULL,
  ruta_id uuid REFERENCES public.rutas(id),
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: movimiento_rastros
-- ============================================
CREATE TABLE public.movimiento_rastros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camion_id uuid NOT NULL REFERENCES public.camiones(id),
  caseta_id uuid NOT NULL REFERENCES public.casetas_autopista(id),
  toll_event_id uuid REFERENCES public.toll_events(id),
  timestamp timestamptz NOT NULL,
  orden_secuencia integer,
  direccion_inferida text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: ubicaciones_tiempo_real
-- ============================================
CREATE TABLE public.ubicaciones_tiempo_real (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camion_id uuid NOT NULL REFERENCES public.camiones(id),
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  velocidad numeric DEFAULT 0,
  direccion text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: alertas
-- ============================================
CREATE TABLE public.alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camion_id uuid NOT NULL,
  tipo text NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  estado text DEFAULT 'activa',
  prioridad text DEFAULT 'media',
  tag_relacionado text,
  saldo_alerta numeric,
  minutos_sin_cruce integer,
  resuelto_en timestamptz,
  resuelto_por uuid,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: bot_config
-- ============================================
CREATE TABLE public.bot_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT false,
  interval_minutes integer NOT NULL DEFAULT 10,
  last_execution timestamptz,
  next_execution timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: bot_execution_logs
-- ============================================
CREATE TABLE public.bot_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id text NOT NULL,
  status text NOT NULL,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  records_processed integer DEFAULT 0,
  error_message text,
  execution_details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: contactos
-- ============================================
CREATE TABLE public.contactos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  empresa text NOT NULL,
  correo text NOT NULL,
  celular text NOT NULL,
  necesidad text NOT NULL,
  leido boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: supervisores
-- ============================================
CREATE TABLE public.supervisores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  empresa text,
  rol text DEFAULT 'supervisor',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: duplicate_charge_alerts
-- ============================================
CREATE TABLE public.duplicate_charge_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text NOT NULL,
  first_event jsonb NOT NULL,
  second_event jsonb NOT NULL,
  time_difference_minutes integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  resolved_at timestamptz,
  resolved_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: positions (GPS SPOT)
-- ============================================
CREATE TABLE public.positions (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  unit_id text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  altitude numeric,
  ts timestamptz NOT NULL,
  raw jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: checkpoints
-- ============================================
CREATE TABLE public.checkpoints (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  geometry_type text NOT NULL DEFAULT 'circle',
  lat numeric,
  lng numeric,
  radius_m integer DEFAULT 100,
  polygon jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: sectors
-- ============================================
CREATE TABLE public.sectors (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  polygon jsonb NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  is_proposed boolean DEFAULT false,
  source text DEFAULT 'manual',
  buffer_m integer DEFAULT 250,
  color text DEFAULT '#3b82f6',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: routes (rutas de sectores)
-- ============================================
CREATE TABLE public.routes (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  line_geometry jsonb NOT NULL,
  sector_id bigint REFERENCES public.sectors(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: events (checkpoint/sector events)
-- ============================================
CREATE TABLE public.events (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  unit_id text NOT NULL,
  type text NOT NULL,
  ref_id bigint,
  ref_type text,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  ts timestamptz NOT NULL,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: notify_rules
-- ============================================
CREATE TABLE public.notify_rules (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  target_type text NOT NULL,
  target_id bigint NOT NULL,
  channel jsonb NOT NULL,
  conditions jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: unit_states
-- ============================================
CREATE TABLE public.unit_states (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  unit_id text NOT NULL,
  ref_type text NOT NULL,
  ref_id bigint NOT NULL,
  is_inside boolean NOT NULL DEFAULT false,
  entered_at timestamptz,
  last_seen timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLA: sector_history
-- ============================================
CREATE TABLE public.sector_history (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  sector_id bigint NOT NULL,
  action text NOT NULL,
  old_geometry jsonb,
  new_geometry jsonb,
  parameters jsonb,
  changed_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 2. Funciones de Base de Datos

```sql
-- ============================================
-- FUNCIÓN: handle_new_user (trigger en auth.users)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, user_type, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'tipo_a'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger asociado (en auth.users):
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCIÓN: update_updated_at_column
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================
-- FUNCIÓN: update_updated_at_column_generic
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column_generic()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================
-- FUNCIÓN: update_truck_trail (trigger en toll_events)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_truck_trail()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  UPDATE public.camiones 
  SET 
    ultimo_cruce_timestamp = NEW.fecha_hora,
    saldo_actual = NEW.saldo,
    updated_at = now()
  WHERE tag_id = NEW.tag_id;
  
  INSERT INTO public.movimiento_rastros (
    camion_id, toll_event_id, caseta_id, timestamp, orden_secuencia
  )
  SELECT 
    c.id, NEW.id, NEW.caseta_id, NEW.fecha_hora,
    COALESCE(
      (SELECT MAX(orden_secuencia) + 1 
       FROM public.movimiento_rastros 
       WHERE camion_id = c.id AND DATE(timestamp) = DATE(NEW.fecha_hora)
      ), 1
    )
  FROM public.camiones c
  WHERE c.tag_id = NEW.tag_id AND NEW.caseta_id IS NOT NULL;
  
  RETURN NEW;
END;
$$;

-- Trigger asociado:
-- CREATE TRIGGER on_toll_event_inserted
--   AFTER INSERT ON public.toll_events
--   FOR EACH ROW EXECUTE FUNCTION public.update_truck_trail();

-- ============================================
-- FUNCIÓN: calculate_daily_expenses (trigger en toll_events)
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_daily_expenses()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
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

-- Trigger asociado:
-- CREATE TRIGGER on_toll_event_daily_expense
--   AFTER INSERT ON public.toll_events
--   FOR EACH ROW EXECUTE FUNCTION public.calculate_daily_expenses();

-- ============================================
-- FUNCIÓN: validate_checkpoint_geometry
-- ============================================
CREATE OR REPLACE FUNCTION public.validate_checkpoint_geometry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.geometry_type = 'circle' THEN
    IF NEW.lat IS NULL OR NEW.lng IS NULL OR NEW.radius_m IS NULL THEN
      RAISE EXCEPTION 'Circular checkpoints require lat, lng, and radius_m';
    END IF;
    NEW.polygon = NULL;
  ELSIF NEW.geometry_type = 'polygon' THEN
    IF NEW.polygon IS NULL THEN
      RAISE EXCEPTION 'Polygon checkpoints require polygon data';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger asociado:
-- CREATE TRIGGER validate_checkpoint_before_save
--   BEFORE INSERT OR UPDATE ON public.checkpoints
--   FOR EACH ROW EXECUTE FUNCTION public.validate_checkpoint_geometry();
```

---

## 3. RLS Policies

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casetas_autopista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conductores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cruces_registrados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duplicate_charge_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimiento_rastros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notify_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toll_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicaciones_tiempo_real ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_states ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES: Solo usuario propio
-- =============================================
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- CAMIONES: Solo usuario propio
-- =============================================
CREATE POLICY "Users can view their own trucks" ON public.camiones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trucks" ON public.camiones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trucks" ON public.camiones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trucks" ON public.camiones FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- CONTACTOS: Público insert, autenticado read/update
-- =============================================
CREATE POLICY "Cualquiera puede enviar formulario de contacto" ON public.contactos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Usuarios autenticados pueden ver contactos" ON public.contactos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuarios autenticados pueden actualizar contactos" ON public.contactos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- DUPLICATE_CHARGE_ALERTS: Acceso completo
-- =============================================
CREATE POLICY "Allow read access to duplicate charge alerts" ON public.duplicate_charge_alerts FOR SELECT USING (true);
CREATE POLICY "Allow insert access to duplicate charge alerts" ON public.duplicate_charge_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to duplicate charge alerts" ON public.duplicate_charge_alerts FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to duplicate charge alerts" ON public.duplicate_charge_alerts FOR DELETE USING (true);

-- =============================================
-- TABLAS CON ACCESO COMPLETO (ALL con true)
-- =============================================
CREATE POLICY "Acceso completo alertas" ON public.alertas FOR ALL USING (true);
CREATE POLICY "Full access to bot_config" ON public.bot_config FOR ALL USING (true);
CREATE POLICY "Full access to bot_execution_logs" ON public.bot_execution_logs FOR ALL USING (true);
CREATE POLICY "Acceso completo casetas" ON public.casetas_autopista FOR ALL USING (true);
CREATE POLICY "Full access to checkpoints" ON public.checkpoints FOR ALL USING (true);
CREATE POLICY "Acceso completo conductores" ON public.conductores FOR ALL USING (true);
CREATE POLICY "Acceso completo cruces" ON public.cruces_registrados FOR ALL USING (true);
CREATE POLICY "Full access to events" ON public.events FOR ALL USING (true);
CREATE POLICY "Acceso completo movimiento_rastros" ON public.movimiento_rastros FOR ALL USING (true);
CREATE POLICY "Full access to notify_rules" ON public.notify_rules FOR ALL USING (true);
CREATE POLICY "Full access to positions" ON public.positions FOR ALL USING (true);
CREATE POLICY "Full access to routes" ON public.routes FOR ALL USING (true);
CREATE POLICY "Acceso completo rutas" ON public.rutas FOR ALL USING (true);
CREATE POLICY "Full access to sector_history" ON public.sector_history FOR ALL USING (true);
CREATE POLICY "Full access to sectors" ON public.sectors FOR ALL USING (true);
CREATE POLICY "Acceso completo supervisores" ON public.supervisores FOR ALL USING (true);
CREATE POLICY "Acceso completo toll_events" ON public.toll_events FOR ALL USING (true);
CREATE POLICY "Acceso completo ubicaciones" ON public.ubicaciones_tiempo_real FOR ALL USING (true);
CREATE POLICY "Full access to unit_states" ON public.unit_states FOR ALL USING (true);
```

---

## 4. Edge Functions

Las edge functions están en el repo bajo `supabase/functions/`. Aquí el resumen:

| Función | Propósito | verify_jwt |
|---------|-----------|------------|
| `spot-feed-poller` | Consume feed SPOT Trace, inserta positions, calcula velocidad | false |
| `process-events` | Motor de eventos: procesa positions → genera events checkpoint/sector | false |
| `send-notification` | Envía notificaciones (webhook/email/sms) por evento | false |
| `pase-scraper` | Scraper del portal PASE para descargar movimientos de casetas | false |
| `webhook-cruces` | Recibe webhooks de cruces de casetas, registra en cruces_registrados | false |
| `create-test-users` | Crea usuarios de prueba (a@solu.mx / b@solu.mx) | false |
| `rebuild-sectors` | Reconstruye polígonos de sectores usando OSM/Mapbox | false |
| `update-odometer` | Calcula kilometraje acumulado desde positions GPS | false |

**Nota**: Todos los archivos fuente están en `supabase/functions/[nombre]/index.ts`

---

## 5. Secrets

Los siguientes secrets deben configurarse en Supabase → Settings → Edge Functions:

| Secret | Descripción |
|--------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key del proyecto |
| `SUPABASE_DB_URL` | URL de conexión a la DB |
| `SUPABASE_PUBLISHABLE_KEY` | Anon key |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Anon key (duplicado) |
| `PASE_USERNAME` | Credenciales portal PASE |
| `PASE_PASSWORD` | Credenciales portal PASE |
| `MAPBOX_ACCESS_TOKEN` | Token de Mapbox para rutas |

---

## 6. Cron Jobs

```sql
-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- spot-feed-poller cada minuto
SELECT cron.schedule(
  'spot-feed-poller-job',
  '* * * * *',
  $$
  SELECT net.http_post(
    url:='https://[TU_PROJECT_ID].supabase.co/functions/v1/spot-feed-poller',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [TU_ANON_KEY]"}'::jsonb
  ) as request_id;
  $$
);

-- process-events cada minuto
SELECT cron.schedule(
  'process-events-job',
  '* * * * *',
  $$
  SELECT pg_sleep(10);
  SELECT net.http_post(
    url:='https://[TU_PROJECT_ID].supabase.co/functions/v1/process-events',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [TU_ANON_KEY]"}'::jsonb
  ) as request_id;
  $$
);
```

---

## 7. config.toml

```toml
[functions.webhook-cruces]
verify_jwt = false

[functions.pase-scraper]
verify_jwt = false

[functions.create-test-users]
verify_jwt = false

[functions.spot-feed-poller]
verify_jwt = false

[functions.process-events]
verify_jwt = false

[functions.send-notification]
verify_jwt = false

[functions.update-odometer]
verify_jwt = false

[functions.rebuild-sectors]
verify_jwt = false
```

---

## 8. Usuarios de Prueba

| Email | Password | Tipo | Descripción |
|-------|----------|------|-------------|
| `a@solu.mx` | `Passw0rd!A` | tipo_a | Gestión completa |
| `b@solu.mx` | `Passw0rd!B` | tipo_b | Seguimiento |

---

## 9. Auth Config

- Signup habilitado
- Email confirmations deshabilitadas
- Anonymous sign-ins deshabilitados
- JWT expiry: 3600s

---

## 🔄 Pasos para Recrear

1. Crear nuevo proyecto en Supabase
2. Ejecutar SQL de tablas (Sección 1)
3. Ejecutar SQL de funciones (Sección 2)
4. Ejecutar SQL de RLS policies (Sección 3)
5. Configurar secrets (Sección 5)
6. Desplegar edge functions desde el repo
7. Actualizar `project_id` y keys en `.env` y `supabase/config.toml`
8. Configurar cron jobs si se necesitan (Sección 6)
9. Crear usuarios de prueba llamando a la edge function `create-test-users`
