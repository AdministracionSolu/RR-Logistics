import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Satellite, Monitor, Code, MapPin, Shield, BarChart3, CheckCircle, Star, ArrowRight, Menu, X } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center space-x-2">
            
            <span className="text-xl font-bold">RR Logistics</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Solutions</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            
          </nav>

          <Link to="/login">
            <Button className="hidden md:flex">Log In</Button>
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
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  RR Logistics
                </h1>
                <p className="text-xl sm:text-2xl text-primary-foreground/90 font-medium">
                  Smart solutions for transport and logistics
                </p>
                <p className="text-lg text-primary-foreground/80 max-w-xl">
                  Soluciones de software y hardware para el transporte y la logística en México
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                    Log In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square w-full max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full opacity-20 blur-3xl" />
                <div className="relative bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-accent/20 rounded-xl flex items-center justify-center">
                      <Satellite className="h-8 w-8 text-white" />
                    </div>
                    <div className="aspect-square bg-primary/40 rounded-xl flex items-center justify-center">
                      <Monitor className="h-8 w-8 text-white" />
                    </div>
                    <div className="aspect-square bg-primary/40 rounded-xl flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="aspect-square bg-accent/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  About RR Logistics
                </h2>
                <p className="text-xl text-muted-foreground">
                  Innovating Mexican logistics industry
                </p>
              </div>
              
              <p className="text-lg leading-relaxed">
                Somos una empresa mexicana dedicada a diseñar soluciones de software y hardware 
                que ayudan a modernizar la industria del transporte y la logística. Nuestro 
                objetivo es mejorar la eficiencia, seguridad y visibilidad de las operaciones.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Vehicles Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-gradient-to-br from-card to-muted/50 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-2 bg-primary/20 rounded-full">
                      <div className="h-full w-4/5 bg-primary rounded-full" />
                    </div>
                    <div className="h-2 bg-accent/20 rounded-full">
                      <div className="h-full w-3/5 bg-accent rounded-full" />
                    </div>
                    <div className="h-2 bg-primary/20 rounded-full">
                      <div className="h-full w-4/5 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-primary" />
                      <span className="text-sm">Fleet Management Active</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-accent" />
                      <span className="text-sm">Real-time Location Tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-sm">Security Monitoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solutions */}
      <section id="solutions" className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive technology solutions for modern logistics operations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Satellite className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Rastreo Satelital</h3>
                <p className="text-muted-foreground">
                  Monitoreo GPS en tiempo real de toda tu flotilla con precisión y confiabilidad.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Code className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Hardware Integration</h3>
                <p className="text-muted-foreground">
                  Integración de sensores y dispositivos IoT para monitoreo avanzado.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Dashboards en Tiempo Real</h3>
                <p className="text-muted-foreground">
                  Paneles de control intuitivos con métricas y alertas personalizables.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Code className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Software a Medida</h3>
                <p className="text-muted-foreground">
                  Desarrollo de aplicaciones personalizadas para necesidades específicas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Key Benefits
                </h2>
                <p className="text-xl text-muted-foreground">
                  Transform your logistics operations with our advanced features
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Monitoreo en Tiempo Real</h3>
                    <p className="text-muted-foreground">
                      Visibilidad completa de tu flotilla las 24 horas del día
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Reducción de Riesgos en Zonas Críticas</h3>
                    <p className="text-muted-foreground">
                      Alertas automáticas y protocolos de seguridad avanzados
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Optimización de Rutas y Costos</h3>
                    <p className="text-muted-foreground">
                      Algoritmos inteligentes para eficiencia operativa máxima
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Integración con Infraestructura Existente</h3>
                    <p className="text-muted-foreground">
                      Fácil implementación sin interrumpir operaciones actuales
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-3xl" />
              <Card className="relative bg-card/50 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-muted-foreground">Monitoring</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-accent">-30%</div>
                      <div className="text-sm text-muted-foreground">Costs</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">+40%</div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Empieza a transformar tu operación hoy mismo</h2>
            <p className="text-xl text-primary-foreground/90">
              Únete a las empresas líderes que ya confían en RR Logistics para 
              modernizar sus operaciones de transporte y logística en México.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Log In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted/50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                  <Truck className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">RR Logistics</span>
              </div>
              <p className="text-muted-foreground">
                Smart solutions for transport and logistics in Mexico.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#solutions" className="block text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
                <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2">
                <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
              </div>
            </div>

            
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 RR Logistics. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;