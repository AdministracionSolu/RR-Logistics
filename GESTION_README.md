# Sistema de Gestión - Checkpoints y Sectores

## Descripción General

Sistema completo de gestión de checkpoints, sectores y notificaciones para RR Logistics. Procesa datos de ubicación de SPOT Trace y genera eventos automáticos cuando los vehículos entran/salen de zonas definidas.

## Componentes

### Base de Datos

Se crearon las siguientes tablas:

- **positions**: Almacena posiciones GPS recibidas del feed SPOT
- **checkpoints**: Define puntos con radio en metros
- **sectors**: Define polígonos/áreas
- **events**: Registra eventos de entrada/salida/dwell
- **notify_rules**: Reglas de notificación por email/SMS/webhook
- **unit_states**: Estado actual de cada unidad en checkpoints/sectores

### Edge Functions

#### 1. spot-feed-poller
**Propósito**: Consumir el feed de SPOT Trace cada 60 segundos y almacenar posiciones nuevas.

**Endpoint**: `https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/spot-feed-poller`

**Cómo ejecutar manualmente**:
```bash
curl -X POST https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/spot-feed-poller \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

#### 2. process-events
**Propósito**: Motor de eventos que procesa posiciones y genera eventos de checkpoint/sector.

**Endpoint**: `https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/process-events`

**Lógica**:
- Lee posiciones no procesadas
- Calcula distancia a checkpoints (Haversine)
- Verifica si está dentro de sectores (point-in-polygon)
- Genera eventos: enter, exit, dwell
- Marca posiciones como procesadas

**Cómo ejecutar manualmente**:
```bash
curl -X POST https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/process-events \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

#### 3. send-notification
**Propósito**: Envía notificaciones cuando se genera un evento.

**Endpoint**: `https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/send-notification`

**Parámetros**:
```json
{
  "event_id": 123
}
```

## Interfaz de Usuario

### Acceso
Los usuarios tipo B pueden acceder al módulo de Gestión desde el botón "Gestión" en el header del DashboardB.

**URL**: `/gestion`

### Secciones

#### 1. Eventos en Vivo
- Lista de eventos en tiempo real
- Filtros por unidad y tipo de evento
- Actualización automática vía realtime

#### 2. Gestión de Checkpoints
- CRUD completo de checkpoints
- Campos: nombre, latitud, longitud, radio (metros)
- Estado activo/inactivo

#### 3. Gestión de Sectores
- CRUD completo de sectores
- Definir polígonos mediante array de coordenadas
- Formato: `[[-100.1, 25.6], [-100.2, 25.7], ...]`

#### 4. Reglas de Notificación
- Crear reglas para checkpoints o sectores
- Canales: email, SMS, webhook
- Estado activo/inactivo

## Configuración de Ejecución Automática

### Opción 1: Cron Jobs de Supabase (Recomendado)

Para ejecutar las funciones automáticamente cada 60 segundos, ejecuta este SQL en Supabase:

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Ejecutar spot-feed-poller cada 60 segundos
SELECT cron.schedule(
  'spot-feed-poller-job',
  '* * * * *', -- cada minuto
  $$
  SELECT net.http_post(
    url:='https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/spot-feed-poller',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYm1ycnBzc2RtbW9xeWd0a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzQ1MTIsImV4cCI6MjA3MTA1MDUxMn0.A8CriuvTLVFE02ZW5ULZ4pSpNutER47X-sqr7K6lm-o"}'::jsonb
  ) as request_id;
  $$
);

-- Ejecutar process-events cada 60 segundos (con 10 segundos de delay)
SELECT cron.schedule(
  'process-events-job',
  '* * * * *',
  $$
  SELECT pg_sleep(10);
  SELECT net.http_post(
    url:='https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/process-events',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYm1ycnBzc2RtbW9xeWd0a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzQ1MTIsImV4cCI6MjA3MTA1MDUxMn0.A8CriuvTLVFE02ZW5ULZ4pSpNutER47X-sqr7K6lm-o"}'::jsonb
  ) as request_id;
  $$
);
```

**Ver jobs activos**:
```sql
SELECT * FROM cron.job;
```

**Eliminar un job**:
```sql
SELECT cron.unschedule('spot-feed-poller-job');
SELECT cron.unschedule('process-events-job');
```

### Opción 2: Servicio Externo

Usar un servicio como **cron-job.org** o **EasyCron** para llamar las funciones cada minuto:

1. Crear cuenta en https://cron-job.org
2. Agregar dos jobs:
   - URL: `https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/spot-feed-poller`
   - URL: `https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/process-events`
3. Configurar intervalo: cada 1 minuto
4. Header: `Authorization: Bearer YOUR_ANON_KEY`

## Flujo de Datos

```
SPOT API → spot-feed-poller → positions (DB)
                                    ↓
                            process-events (motor)
                                    ↓
                          events (DB) ← notify_rules
                                    ↓
                            send-notification
                                    ↓
                        Email / SMS / Webhook
```

## Tipos de Eventos

- **checkpoint_enter**: Unidad entra a checkpoint
- **checkpoint_exit**: Unidad sale de checkpoint
- **sector_enter**: Unidad entra a sector
- **sector_exit**: Unidad sale de sector
- **dwell**: Unidad permanece >10 min en checkpoint

## Configuración de Notificaciones

### Email
```json
{
  "email": ["user1@example.com", "user2@example.com"]
}
```

### Webhook
```json
{
  "webhook": "https://tu-servidor.com/webhook"
}
```

**Payload enviado**:
```json
{
  "unit": "IMDM26585513",
  "event": "checkpoint_enter",
  "checkpoint": "Planta Monterrey",
  "timestamp": "2025-10-06T16:32:00Z",
  "lat": 25.653,
  "lng": -100.287
}
```

### SMS (Placeholder)
```json
{
  "sms": ["+521234567890"]
}
```

## Monitoreo

### Ver logs de edge functions
- Supabase Dashboard → Edge Functions → [nombre función] → Logs
- O en código: `console.log()` aparece en logs

### Verificar que funcione
```sql
-- Ver posiciones recientes
SELECT * FROM positions ORDER BY created_at DESC LIMIT 10;

-- Ver eventos recientes
SELECT * FROM events ORDER BY ts DESC LIMIT 20;

-- Ver estados de unidades
SELECT * FROM unit_states;
```

## Próximos Pasos / Mejoras

1. **Integrar servicios reales**:
   - SendGrid/Mailgun para emails
   - Twilio para SMS

2. **Editor visual de polígonos**:
   - Integrar react-leaflet-draw o mapbox-gl-draw

3. **Mapa en módulo Gestión**:
   - Mostrar checkpoints como círculos
   - Mostrar sectores como polígonos
   - Posiciones de vehículos en tiempo real

4. **Dashboard de métricas**:
   - Tiempo promedio en checkpoints
   - Frecuencia de cruces
   - Alertas por unidad

5. **Múltiples feeds SPOT**:
   - Tabla de configuración de feeds
   - Soporte para múltiples cuentas

## Soporte

Para cualquier duda o problema:
- Revisar logs de edge functions en Supabase
- Verificar que los cron jobs estén activos
- Validar formato de polígonos en sectores
- Confirmar que las coordenadas sean correctas (lng, lat)
