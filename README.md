# RR Logistics - Por Adrian Reyes y Diego Rosales


## Características Principales

- **Monitoreo GPS en Tiempo Real**: Seguimiento continuo de vehículos con tecnología SPOT GPS
- **Dashboards Personalizados**: Interfaces adaptadas según el tipo de usuario y permisos
- **Sistema de Alertas**: Notificaciones automáticas para eventos críticos
- **Gestión de Casetas**: Control y seguimiento de pagos de peaje
- **Reportes y Analytics**: Análisis detallado de rutas y rendimiento de flotilla
- **Control de Acceso**: Sistema robusto de autenticación y autorización

## Arquitectura Técnica

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Autenticación, Base de Datos, Edge Functions)
- **Mapas**: Mapbox GL + Integración SPOT GPS
- **Estado**: React Query para gestión de datos
- **UI**: Sistema de componentes personalizado con Radix UI

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ o Bun
- Cuenta de Supabase configurada
- Token de Mapbox (opcional para funciones avanzadas)


El sistema estará disponible en `http://localhost:8080`

## Estructura de Usuarios

### Administrador Completo (Tipo A)
- Acceso completo al sistema de gestión
- Dashboard con casetas, alertas, rastro y saldo
- Administración de eventos y configuración de bots
- **Credenciales de desarrollo**: a@solu.mx / Passw0rd!A

### Usuario de Seguimiento (Tipo B)  
- Acceso limitado solo al mapa de seguimiento GPS
- Dashboard simplificado con vista SPOT GPS
- **Credenciales de desarrollo**: b@solu.mx / Passw0rd!B

## Rutas del Sistema

- `/` → Página principal con información corporativa
- `/login` → Autenticación de usuarios
- `/dashboard-a` → Panel completo (Tipo A únicamente)
- `/dashboard-b` → Panel de seguimiento (Tipo B únicamente)
- `/eventos` → Gestión de eventos (Tipo A únicamente)
- `/bot-admin` → Administración de bots (Tipo A únicamente)

## Seguridad

- Autenticación basada en Supabase Auth
- Rutas protegidas con verificación de roles
- Row Level Security (RLS) en base de datos
- Validación de tipos con TypeScript
- Sanitización de datos de entrada

## Desarrollo

### Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Sistema de componentes base
│   └── ...             # Componentes específicos
├── hooks/              # Hooks personalizados
├── pages/              # Páginas principales
├── integrations/       # Integraciones externas
└── lib/                # Utilidades y configuración
```

### Comandos Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Análisis de código
```



Este proyecto es propietario de RR Logistics. Todos los derechos reservados.

