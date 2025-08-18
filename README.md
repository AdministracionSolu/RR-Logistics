# FleetWatch - Sistema de Monitoreo de Flotas

Sistema de monitoreo y seguimiento de flotas en tiempo real desarrollado con React, TypeScript y Tailwind CSS.

## Características

- Monitoreo en tiempo real de vehículos
- Dashboard con métricas y estadísticas
- Mapas interactivos con Mapbox
- Notificaciones de eventos
- Interfaz responsive y moderna

## Tecnologías Utilizadas

- **Frontend Framework**: React 18 con TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Maps**: Mapbox GL JS
- **Backend**: Supabase
- **State Management**: React Query

## Instalación Local

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con las claves necesarias

# Ejecutar en modo desarrollo
npm run dev
```

## Configuración

### Mapbox Token
El sistema requiere un token de Mapbox para mostrar los mapas. Obtén tu token en [mapbox.com](https://mapbox.com) y configúralo en la aplicación.

### Supabase
Configura tu proyecto de Supabase y las credenciales necesarias para la base de datos y autenticación.

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
├── pages/              # Páginas de la aplicación
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuración
├── integrations/       # Integraciones externas
└── assets/            # Recursos estáticos
```

## Despliegue

El proyecto puede ser desplegado en cualquier plataforma que soporte aplicaciones React estáticas.

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.