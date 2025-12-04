import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, MapPin, Shield, Gauge, Bell, BarChart3, Route, Phone, Mail, Building2, Satellite, CreditCard, Target, Activity, Check } from "lucide-react";

const FichaServicios = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Botón de impresión flotante */}
      <Button
        onClick={handlePrint}
        className="fixed bottom-6 right-6 z-50 print:hidden shadow-lg"
        size="lg"
      >
        <Printer className="mr-2 h-5 w-5" />
        Imprimir / Descargar PDF
      </Button>

      {/* Página 1: Portada */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-gradient-to-br from-[#0F1A3D] to-[#1a2d5c] text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <span className="text-[#0F1A3D] font-bold text-2xl">RR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">RR Logistics</h1>
              <p className="text-white/70 text-sm">Tecnología para Transporte</p>
            </div>
          </div>
          <div className="text-right text-sm text-white/50 print:block hidden">
            <p>Ficha de Servicios</p>
            <p>{new Date().toLocaleDateString('es-MX')}</p>
          </div>
        </div>

        {/* Título principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Soluciones de Software y Hardware
          </h2>
          <p className="text-xl md:text-2xl text-emerald-400 font-medium">
            para el Transporte y la Logística en México
          </p>
        </div>

        {/* Tres columnas de información */}
        <div className="grid md:grid-cols-3 gap-8 flex-1">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-4">Acerca de Nosotros</h3>
            <p className="text-white/80 leading-relaxed">
              RR Logistics es una empresa de tecnología enfocada en la transformación digital 
              del sector de transporte y logística en México. Desarrollamos soluciones de 
              software y hardware que permiten a las empresas monitorear, controlar y 
              optimizar sus operaciones de manera eficiente y segura.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Contexto Actual</h3>
            <p className="text-white/80 leading-relaxed">
              El transporte en México enfrenta desafíos críticos: inseguridad en carreteras, 
              falta de visibilidad en tiempo real, control deficiente de gastos en peajes, 
              y procesos manuales que generan ineficiencias. Las empresas necesitan 
              herramientas tecnológicas para mantener competitividad y seguridad.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-bold text-sky-400 mb-4">Nuestra Solución</h3>
            <p className="text-white/80 leading-relaxed">
              Ofrecemos una plataforma integral de rastreo GPS dual que combina 
              dispositivos SPOT Trace con TAGs de peaje para lograr cobertura total 
              sin zonas muertas. Nuestro sistema incluye dashboards en tiempo real, 
              alertas inteligentes y reconciliación automática de gastos.
            </p>
          </div>
        </div>

        {/* Footer de página */}
        <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm text-white/50">
          <p>RR Logistics — Monterrey, Nuevo León, México — Página 1 de 5</p>
        </div>
      </section>

      {/* Página 2: Sistema de Monitoreo GPS */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0F1A3D] rounded-lg flex items-center justify-center">
            <Satellite className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#0F1A3D]">Sistema de Monitoreo GPS Dual</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-[#0F1A3D] to-[#1a2d5c] text-white rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Satellite className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">SPOT Trace</h3>
            </div>
            <p className="text-white/80 mb-4">
              Dispositivo satelital de rastreo que funciona en cualquier ubicación, 
              incluyendo zonas remotas sin cobertura celular.
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Cobertura satelital global
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Sin zonas muertas
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Batería de larga duración
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Actualización cada 5-10 minutos
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">TAGs de Peaje</h3>
            </div>
            <p className="text-white/90 mb-4">
              Integración con sistemas de telepeaje para rastreo complementario 
              y control automático de gastos en casetas.
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-white" />
                Registro automático de cruces
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-white" />
                Control de saldos en tiempo real
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-white" />
                Detección de cobros duplicados
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-white" />
                Alertas de saldo bajo
              </li>
            </ul>
          </div>
        </div>

        {/* Tabla de Impacto Operativo */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#0F1A3D] mb-4 text-center">
            Impacto Operativo: Antes vs Después
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0F1A3D] text-white">
                  <th className="border border-gray-300 p-4 text-left font-semibold">Dimensión</th>
                  <th className="border border-gray-300 p-4 text-left font-semibold text-red-300">❌ Sin RR Logistics</th>
                  <th className="border border-gray-300 p-4 text-left font-semibold text-emerald-300">✓ Con RR Logistics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-4 font-medium bg-gray-50">Visibilidad</td>
                  <td className="border border-gray-200 p-4 text-gray-600 bg-red-50">Zonas muertas, sin datos en tiempo real</td>
                  <td className="border border-gray-200 p-4 text-gray-700 bg-emerald-50">Rastreo 24/7 sin interrupciones en toda la ruta</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4 font-medium bg-gray-50">Control de Gastos</td>
                  <td className="border border-gray-200 p-4 text-gray-600 bg-red-50">Revisión manual de casetas y tickets físicos</td>
                  <td className="border border-gray-200 p-4 text-gray-700 bg-emerald-50">Reconciliación automática de peajes y alertas</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4 font-medium bg-gray-50">Seguridad</td>
                  <td className="border border-gray-200 p-4 text-gray-600 bg-red-50">Alertas tardías o inexistentes ante incidentes</td>
                  <td className="border border-gray-200 p-4 text-gray-700 bg-emerald-50">Alertas instantáneas en zonas críticas y desvíos</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4 font-medium bg-gray-50">Eficiencia</td>
                  <td className="border border-gray-200 p-4 text-gray-600 bg-red-50">Rutas no optimizadas, sin historial de recorridos</td>
                  <td className="border border-gray-200 p-4 text-gray-700 bg-emerald-50">Análisis de recorridos y optimización de rutas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Página 2 de 5</p>
        </div>
      </section>

      {/* Página 3: Soluciones Tecnológicas */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-gray-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0F1A3D] rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#0F1A3D]">Soluciones Tecnológicas</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {/* Rastreo GPS Dual */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#0F1A3D]/10 rounded-lg flex items-center justify-center mb-4">
              <Satellite className="h-6 w-6 text-[#0F1A3D]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-2">Rastreo GPS Dual</h3>
            <p className="text-sm text-gray-600">
              Combinación de SPOT Trace satelital y TAGs de peaje para cobertura 
              total sin zonas muertas. Posición actualizada cada 5 minutos.
            </p>
          </div>

          {/* Control de Peajes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-2">Control de Peajes</h3>
            <p className="text-sm text-gray-600">
              Reconciliación automática de cruces en casetas, alertas de saldo bajo, 
              y detección de cobros duplicados o no autorizados.
            </p>
          </div>

          {/* Geofencing Inteligente */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-2">Geofencing Inteligente</h3>
            <p className="text-sm text-gray-600">
              Definición de checkpoints y sectores con alertas automáticas 
              de entrada/salida. Ideal para control de rutas y seguridad.
            </p>
          </div>

          {/* Odómetro Automático */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Gauge className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-2">Odómetro Automático</h3>
            <p className="text-sm text-gray-600">
              Cálculo preciso de kilometraje recorrido basado en posiciones GPS. 
              Útil para mantenimiento preventivo y control de combustible.
            </p>
          </div>

          {/* Dashboards en Tiempo Real */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-2">Dashboards en Tiempo Real</h3>
            <p className="text-sm text-gray-600">
              Paneles personalizados por rol: vista operativa para monitoreo 
              diario y vista estratégica para análisis y toma de decisiones.
            </p>
          </div>

          {/* Sistema de Alertas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-2">Sistema de Alertas</h3>
            <p className="text-sm text-gray-600">
              Notificaciones configurables por velocidad excesiva, inactividad 
              prolongada, saldo bajo, y eventos de entrada/salida de zonas.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Página 3 de 5</p>
        </div>
      </section>

      {/* Página 4: Beneficios y Resultados */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0F1A3D] rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#0F1A3D]">Beneficios y Resultados</h2>
        </div>

        {/* Métricas destacadas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0F1A3D] text-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <p className="text-sm text-white/80">Monitoreo Continuo</p>
          </div>
          <div className="bg-emerald-500 text-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <p className="text-sm text-white/90">Disponibilidad</p>
          </div>
          <div className="bg-orange-500 text-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">-30%</div>
            <p className="text-sm text-white/90">Reducción de Costos</p>
          </div>
          <div className="bg-blue-500 text-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">+40%</div>
            <p className="text-sm text-white/90">Mejora en Eficiencia</p>
          </div>
        </div>

        {/* Beneficios detallados */}
        <div className="grid md:grid-cols-2 gap-6 flex-1">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#0F1A3D]" />
              Seguridad Mejorada
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#0F1A3D] rounded-full mt-2"></span>
                <span>Alertas instantáneas ante eventos de riesgo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#0F1A3D] rounded-full mt-2"></span>
                <span>Monitoreo de zonas de alto riesgo con geofencing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#0F1A3D] rounded-full mt-2"></span>
                <span>Historial completo de recorridos para auditoría</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#0F1A3D] rounded-full mt-2"></span>
                <span>Detección de desviaciones de ruta programada</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Control Financiero
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                <span>Reconciliación automática de gastos en peajes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                <span>Detección de cobros duplicados o fraudulentos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                <span>Reportes detallados de consumo por unidad</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                <span>Alertas de saldo bajo para evitar interrupciones</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-4 flex items-center gap-2">
              <Route className="h-5 w-5 text-orange-600" />
              Eficiencia Operativa
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <span>Visibilidad completa de la flota en tiempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <span>Optimización de rutas basada en datos históricos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <span>Reducción de tiempos muertos y paradas innecesarias</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <span>Planificación de mantenimiento basada en kilometraje</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#0F1A3D] mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              Tecnología de Punta
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <span>Plataforma web moderna (React + TypeScript)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <span>Base de datos en la nube (Supabase + PostgreSQL)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <span>Integración con API de SPOT y sistemas de peaje</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <span>Mapas interactivos con Leaflet/Mapbox</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Página 4 de 5</p>
        </div>
      </section>

      {/* Página 5: Contacto */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-gradient-to-br from-[#0F1A3D] to-[#1a2d5c] text-white">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Logo grande */}
          <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mb-8">
            <span className="text-[#0F1A3D] font-bold text-5xl">RR</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">RR Logistics</h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl">
            Transformamos la logística de transporte en México con tecnología 
            de vanguardia, ofreciendo visibilidad total y control de su flota.
          </p>

          {/* Información de contacto */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 w-full max-w-3xl">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <Phone className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-white/80">+52 (81) XXXX-XXXX</p>
              <p className="text-sm text-white/60">Lun - Vie, 9:00 - 18:00</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-white/80">contacto@rrlogistics.mx</p>
              <p className="text-sm text-white/60">Respuesta en 24 hrs</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <Building2 className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ubicación</h3>
              <p className="text-white/80">Monterrey, N.L.</p>
              <p className="text-sm text-white/60">México</p>
            </div>
          </div>

          {/* Llamado a la acción */}
          <div className="bg-white text-[#0F1A3D] rounded-2xl p-8 w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">¿Listo para optimizar su flota?</h3>
            <p className="mb-6 text-gray-600">
              Agenda una demostración personalizada y descubre cómo RR Logistics 
              puede transformar las operaciones de tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-[#0F1A3D] text-white px-6 py-3 rounded-lg font-semibold">
                Solicitar Demo Gratuita
              </div>
              <div className="border-2 border-[#0F1A3D] text-[#0F1A3D] px-6 py-3 rounded-lg font-semibold">
                Ver Más Información
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} RR Logistics — Todos los derechos reservados</p>
          <p className="mt-1">Monterrey, Nuevo León, México — Página 5 de 5</p>
        </div>
      </section>
    </div>
  );
};

export default FichaServicios;
