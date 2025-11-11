import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Satellite, 
  DollarSign, 
  MapPin, 
  Monitor, 
  Bell, 
  Gauge, 
  Webhook, 
  Code,
  ArrowRight,
  CheckCircle,
  Truck,
  Menu,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

const Soluciones = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">RR Logistics</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/#about" className="text-sm font-medium hover:text-primary transition-colors">Nosotros</Link>
            <Link to="/soluciones" className="text-sm font-medium text-primary">Soluciones</Link>
            <Link to="/#features" className="text-sm font-medium hover:text-primary transition-colors">Características</Link>
          </nav>

          <Link to="/login">
            <Button className="hidden md:flex">Iniciar Sesión</Button>
          </Link>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/20 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Soluciones en Acción
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Desarrollamos software a la medida para transporte y logística
            </h1>
            
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Resolvemos problemas operativos reales con soluciones tecnológicas personalizadas. 
              Sin plantillas genéricas, solo software diseñado específicamente para tu operación.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Ver Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We've Built */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Sistema Real: Monitoreo de Flotillas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un ejemplo de nuestras capacidades: sistema completo de rastreo y control para operaciones de autotransporte
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Satellite className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Rastreo GPS Dual</h3>
                <p className="text-muted-foreground">
                  Integración simultánea de SPOT Trace (GPS satelital) + TAGs de peaje. 
                  Posicionamiento en tiempo real sin zonas muertas.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">SPOT API</Badge>
                  <Badge variant="outline" className="text-xs">WebSockets</Badge>
                  <Badge variant="outline" className="text-xs">Real-time</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Control de Peajes</h3>
                <p className="text-muted-foreground">
                  Reconciliación automática de gastos de casetas. Alertas de saldo bajo, 
                  detección de cobros duplicados y auditoría completa de transacciones.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">CSV Import</Badge>
                  <Badge variant="outline" className="text-xs">Auto-matching</Badge>
                  <Badge variant="outline" className="text-xs">Alerts</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Geofencing Inteligente</h3>
                <p className="text-muted-foreground">
                  Checkpoints circulares y poligonales con detección automática de entrada/salida. 
                  Alertas por permanencia prolongada en zonas críticas.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">Turf.js</Badge>
                  <Badge variant="outline" className="text-xs">Polygons</Badge>
                  <Badge variant="outline" className="text-xs">Events</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Odómetro Automático</h3>
                <p className="text-muted-foreground">
                  Cálculo preciso de kilometraje usando fórmula Haversine. Actualización cada 30s 
                  con filtrado de saltos GPS. Historial acumulativo por período.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">Edge Functions</Badge>
                  <Badge variant="outline" className="text-xs">Haversine</Badge>
                  <Badge variant="outline" className="text-xs">Cron Jobs</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Dashboards Diferenciados</h3>
                <p className="text-muted-foreground">
                  Interfaces por rol: Dashboard A (monitoreo operativo) y Dashboard B (gestión estratégica). 
                  Mapas en tiempo real, métricas y trails históricos.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">React Leaflet</Badge>
                  <Badge variant="outline" className="text-xs">Role-based</Badge>
                  <Badge variant="outline" className="text-xs">Charts</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Bell className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Sistema de Alertas</h3>
                <p className="text-muted-foreground">
                  Motor de alertas configurable: saldo bajo, inactividad prolongada, 
                  velocidad excesiva. Notificaciones priorizadas con resolución tracking.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">Rule Engine</Badge>
                  <Badge variant="outline" className="text-xs">Priorities</Badge>
                  <Badge variant="outline" className="text-xs">History</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Capabilities */}
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Capacidades Adicionales Implementadas</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Webhooks de Integración:</span> Recepción automática de eventos de cruces de caseta desde sistemas externos
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Bot de Scraping:</span> Automatización de extracción de datos del portal PASE con ejecución programada
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Gestión de Sectores:</span> Reconstrucción automática de polígonos viales con buffer configurable
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Historial de Movimientos:</span> Trails de recorrido con secuencia ordenada y dirección inferida
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Autenticación Multi-rol:</span> Sistema de permisos con roles diferenciados (Tipo A/B) y rutas protegidas
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Cálculo de Velocidad:</span> Velocidad instantánea calculada entre posiciones GPS consecutivas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stack Tecnológico
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologías modernas y probadas para soluciones escalables y mantenibles
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Frontend</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>React 18 + TypeScript</p>
                  <p>Tailwind CSS</p>
                  <p>React Query (TanStack)</p>
                  <p>React Router</p>
                  <p>Leaflet + Mapbox</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">Backend</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Supabase Cloud</p>
                  <p>PostgreSQL + PostGIS</p>
                  <p>Edge Functions (Deno)</p>
                  <p>Row Level Security</p>
                  <p>Realtime Subscriptions</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Seguridad</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Supabase Auth</p>
                  <p>RLS Policies</p>
                  <p>Secret Management</p>
                  <p>JWT Tokens</p>
                  <p>HTTPS/WSS</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">Integraciones</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>SPOT Trace API</p>
                  <p>Webhooks REST</p>
                  <p>CSV Processing</p>
                  <p>Web Scraping</p>
                  <p>Turf.js (GIS)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Arquitectura full-stack:</strong> React + TypeScript en frontend, 
                  Supabase + PostgreSQL en backend, despliegue automático con CI/CD
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What This Means */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                ¿Qué significa esto para tu operación?
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Soluciones Personalizadas</h3>
                  <p className="text-muted-foreground">
                    No vendemos un software "estándar". Analizamos tu operación específica 
                    y desarrollamos la solución exacta que necesitas, integrando solo 
                    las funcionalidades relevantes para tu negocio.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Webhook className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">Integración Real</h3>
                  <p className="text-muted-foreground">
                    Conectamos con tus sistemas existentes (GPS, ERPs, portales de proveedores) 
                    sin importar la tecnología. APIs, webhooks, scraping, CSV... lo que tu operación requiera.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Visibilidad Total</h3>
                  <p className="text-muted-foreground">
                    Dashboards diseñados para tu equipo, mostrando exactamente lo que necesitan ver. 
                    Desde operadores hasta directores, cada rol tiene la información relevante.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">Automatización Inteligente</h3>
                  <p className="text-muted-foreground">
                    Bots, webhooks, procesos programados... automatizamos tareas repetitivas 
                    para que tu equipo se enfoque en decisiones estratégicas, no en captura de datos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Operaciones que Podemos Digitalizar
            </h2>
            <p className="text-xl text-muted-foreground">
              Enfocados en transporte y logística en México, con experiencia en:
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-left">
              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Autotransporte de Carga</h3>
                  <p className="text-sm text-muted-foreground">
                    Full Truckload (FTL), consolidación, rutas fijas o variables
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Flotillas Refrigeradas</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitoreo de temperatura, control de cadena de frío
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Distribución Regional</h3>
                  <p className="text-sm text-muted-foreground">
                    Múltiples entregas, optimización de rutas, POD digital
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Control de Gastos</h3>
                  <p className="text-sm text-muted-foreground">
                    Peajes, combustible, mantenimiento, auditoría financiera
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Compliance & Reportes</h3>
                  <p className="text-sm text-muted-foreground">
                    Auditoría de rutas, tiempos de servicio, SLAs con clientes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Seguridad Operativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Geofencing, botones de pánico, protocolos de zonas críticas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              ¿Tienes un reto operativo que resolver?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              No importa si es rastreo, control de gastos, automatización de procesos o 
              integración con sistemas existentes. Si está relacionado con transporte y 
              logística, podemos construir la solución.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Ver Demo del Sistema <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-primary-foreground/70 pt-4">
              Solicita una demo personalizada o platícanos sobre tu operación
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                  <Truck className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">RR Logistics</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Software a la medida para transporte y logística
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Empresa</h3>
              <div className="space-y-2">
                <Link to="/#about" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Nosotros
                </Link>
                <Link to="/soluciones" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Soluciones
                </Link>
                <Link to="/#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Características
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Tecnología</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">React + TypeScript</p>
                <p className="text-sm text-muted-foreground">Supabase Backend</p>
                <p className="text-sm text-muted-foreground">Real-time GPS</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Acceso</h3>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 RR Logistics. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Soluciones;