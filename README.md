# Gestión Flotilla - Sistema de Monitoreo

Sistema de gestión y monitoreo de flotilla con dashboards específicos por usuario y seguimiento GPS en tiempo real.

## Credenciales de Usuario (Desarrollo)

### Usuario A - Gestión Completa
- **Email:** a@solu.mx
- **Password:** Passw0rd!A
- **Acceso:** Dashboard completo con casetas, alertas, rastro y saldo actual

### Usuario B - Solo Seguimiento
- **Email:** b@solu.mx  
- **Password:** Passw0rd!B
- **Acceso:** Dashboard con mapa SPOT GPS únicamente

## Cómo Ejecutar Localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - El proyecto ya está configurado con Supabase
   - Las credenciales están en los secrets de Supabase

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

4. **Crear usuarios de prueba:**
   - Ir a `/login`
   - Usar el botón "Crear Usuarios de Prueba"
   - Esto creará ambos usuarios automáticamente

## Estructura de Usuarios

- **Tipo A (`tipo_a`)**: Acceso completo al sistema de gestión
- **Tipo B (`tipo_b`)**: Solo acceso al mapa de seguimiento GPS

## Configuración del Mapa SPOT

El mapa GPS está incrustado desde: `https://maps.findmespot.com/s/K16M`

**Para cambiar la URL del embed:**
1. Editar el archivo `src/components/SpotEmbed.tsx`
2. Modificar la variable `spotUrl` con la nueva URL
3. El sistema incluye fallback automático si el mapa no se puede cargar

## Arquitectura

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **Autenticación:** Supabase Auth con roles personalizados
- **Mapas:** Mapbox GL para Dashboard A, SPOT GPS para Dashboard B

## Rutas Protegidas

- `/` → Redirige a `/login`
- `/login` → Página de inicio de sesión
- `/dashboard-a` → Solo usuarios tipo A
- `/dashboard-b` → Solo usuarios tipo B
- `/eventos` → Solo usuarios tipo A
- `/bot-admin` → Solo usuarios tipo A

Todos los dashboards requieren autenticación y verifican permisos automáticamente.

