import { Button } from "@/components/ui/button";
import { Printer, MapPin, Shield, Bell, BarChart3, Phone, Building2, Satellite, Mountain, Compass, Truck, HardHat, Users, Check, Radio, Globe, AlertTriangle, Clock, Target } from "lucide-react";

const FichaServicios = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Botón de impresión flotante */}
      <Button
        onClick={handlePrint}
        className="fixed bottom-6 right-6 z-50 print:hidden shadow-lg bg-slate-800 hover:bg-slate-700"
        size="lg"
      >
        <Printer className="mr-2 h-5 w-5" />
        Imprimir / Descargar PDF
      </Button>

      {/* Página 1: Portada */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RR</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">RR Logistics</h1>
              <p className="text-slate-500 text-sm">Tecnología para Transporte</p>
            </div>
          </div>
          <div className="text-right text-sm text-slate-400 print:block hidden">
            <p>Ficha de Servicios</p>
            <p>{new Date().toLocaleDateString('es-MX')}</p>
          </div>
        </div>

        {/* Título principal */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Satellite className="h-4 w-4" />
            Tecnología Satelital
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Monitoreo Satelital para Operaciones en Zonas Remotas
          </h2>
          <p className="text-xl text-slate-600">
            Cuando la señal celular no llega, nosotros sí.
          </p>
        </div>

        {/* Propuesta de valor */}
        <div className="grid md:grid-cols-2 gap-8 flex-1 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">El Desafío</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Operaciones críticas en zonas montañosas, desiertos, áreas rurales y 
              rutas aisladas donde el GPS tradicional basado en señal celular 
              simplemente no funciona. <strong>Sin visibilidad, sin control, sin seguridad.</strong>
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Satellite className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Nuestra Solución</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Rastreo satelital mediante dispositivos <strong>SPOT Trace</strong> que funcionan 
              en cualquier lugar del mundo, sin depender de torres celulares. 
              Cobertura garantizada donde otros sistemas fallan.
            </p>
          </div>
        </div>

        {/* Diagrama de cobertura */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="space-y-3">
                <Radio className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-medium text-slate-400">GPS Celular</p>
                <p className="text-sm text-slate-400">Depende de cobertura móvil</p>
                <div className="flex justify-center gap-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                  <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                  <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                </div>
              </div>
              <div className="space-y-3">
                <Globe className="h-10 w-10 text-blue-600 mx-auto" />
                <p className="font-medium text-slate-800">GPS Satelital (SPOT)</p>
                <p className="text-sm text-slate-600">Cobertura global garantizada</p>
                <div className="flex justify-center gap-1">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer de página */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
          <p>RR Logistics — Monterrey, Nuevo León, México — Página 1 de 5</p>
        </div>
      </section>

      {/* Página 2: Casos de Uso por Industria */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Casos de Uso por Industria</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Nuestra solución está diseñada para operaciones de alto valor que requieren 
          monitoreo confiable en zonas donde la tecnología convencional no alcanza.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {/* Minería y Extracción */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <HardHat className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Minería y Extracción</h3>
            <p className="text-sm text-slate-600 mb-4">
              Monitoreo de camiones entre planta y mina. Control de tiempos de llegada 
              y salida en zonas de extracción remotas.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Ejemplo:</strong> Salida de fábrica → Llegada a mina → Retorno
            </div>
          </div>

          {/* Turismo de Aventura */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Compass className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Turismo de Aventura</h3>
            <p className="text-sm text-slate-600 mb-4">
              Seguimiento de grupos en senderismo, expediciones, tours de lujo y 
              misiones. Tranquilidad para operadores y familiares.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Ejemplo:</strong> Tours en montaña, cañones, zonas arqueológicas
            </div>
          </div>

          {/* Logística Especializada */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Logística Especializada</h3>
            <p className="text-sm text-slate-600 mb-4">
              Cargas de alto valor en rutas rurales o remotas. Distribución de 
              productos especializados donde la conectividad falla.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Ejemplo:</strong> Mariscos congelados, medicamentos, equipos
            </div>
          </div>

          {/* Maquinaria y Equipo Pesado */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Mountain className="h-6 w-6 text-orange-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Maquinaria Pesada</h3>
            <p className="text-sm text-slate-600 mb-4">
              Ubicación de equipos en obras aisladas, proyectos de construcción 
              en zonas rurales y desarrollo de infraestructura.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Ejemplo:</strong> Excavadoras, grúas, equipos de perforación
            </div>
          </div>

          {/* Flotas Selectivas */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Flotas Selectivas</h3>
            <p className="text-sm text-slate-600 mb-4">
              Para la unidad que sí va a zonas complicadas. No necesitas monitorear 
              toda tu flota, solo las que realmente lo requieren.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Ejemplo:</strong> 9 unidades en ruta normal, 1 en zona crítica
            </div>
          </div>

          {/* Expediciones y Misiones */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-teal-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Expediciones y Misiones</h3>
            <p className="text-sm text-slate-600 mb-4">
              Grupos de voluntarios, misiones humanitarias, expediciones científicas. 
              Monitoreo a distancia para coordinadores y familias.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Ejemplo:</strong> Brigadas de ayuda, campamentos, investigación
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Página 2 de 5</p>
        </div>
      </section>

      {/* Página 3: Funcionalidades del Sistema */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-slate-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Funcionalidades del Sistema</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Plataforma web completa con herramientas diseñadas para el control operativo 
          y la toma de decisiones en tiempo real.
        </p>

        <div className="grid md:grid-cols-2 gap-8 flex-1">
          {/* Checkpoints de Control */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Checkpoints de Control</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Define puntos de control específicos en tu operación: salida, llegada, 
              paradas programadas. El sistema registra automáticamente cada paso.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                Registro de hora de entrada y salida
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                Notificación automática a coordinadores
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                Historial completo de pasos por checkpoint
              </li>
            </ul>
          </div>


          {/* Sistema de Alertas */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Sistema de Alertas</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Notificaciones configurables para mantener informado a tu equipo 
              sobre eventos importantes en la operación.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-red-600" />
                Alertas por entrada/salida de zonas
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-red-600" />
                Notificación por inactividad prolongada
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-red-600" />
                Envío por email, SMS o WhatsApp
              </li>
            </ul>
          </div>

          {/* Dashboard en Tiempo Real */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Dashboard en Tiempo Real</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Paneles visuales con mapa interactivo, estado de unidades y eventos 
              recientes. Acceso desde cualquier dispositivo.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-600" />
                Mapa con ubicación de todas las unidades
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-600" />
                Vista operativa y estratégica por rol
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-600" />
                Historial de recorridos y análisis
              </li>
            </ul>
          </div>


          {/* Historial de Eventos */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Historial de Eventos</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Registro completo de todos los eventos para análisis posterior, 
              auditoría y mejora continua de operaciones.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-slate-600" />
                Exportación de datos a Excel
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-slate-600" />
                Filtros por fecha, unidad y tipo de evento
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-slate-600" />
                Reportes personalizados
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Página 3 de 5</p>
        </div>
      </section>

      {/* Página 4: ¿Para Quién es Esta Solución? */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">¿Para Quién es Esta Solución?</h2>
        </div>

        {/* Mensaje de posicionamiento */}
        <div className="bg-slate-800 text-white rounded-xl p-8 mb-8 max-w-4xl">
          <p className="text-xl font-medium leading-relaxed">
            "Cuidamos lo que más importa: <span className="text-blue-400">personas</span>, 
            <span className="text-blue-400">expediciones</span> y 
            <span className="text-blue-400">cargas de alto valor</span> en lugares donde 
            la tecnología convencional simplemente no llega."
          </p>
        </div>

        {/* Tabla comparativa */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">¿Es esta solución para ti?</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-4 text-left font-semibold text-slate-700">Situación</th>
                  <th className="border border-slate-200 p-4 text-center font-semibold text-slate-700">GPS Celular</th>
                  <th className="border border-slate-200 p-4 text-center font-semibold text-blue-700 bg-blue-50">RR Logistics (Satelital)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 p-4 text-slate-600">Rutas en zonas urbanas con buena cobertura</td>
                  <td className="border border-slate-200 p-4 text-center text-green-600">✓ Suficiente</td>
                  <td className="border border-slate-200 p-4 text-center text-slate-400 bg-blue-50/50">No necesario</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 p-4 text-slate-700 font-medium">Operaciones en zonas remotas sin señal</td>
                  <td className="border border-slate-200 p-4 text-center text-red-600">✗ No funciona</td>
                  <td className="border border-slate-200 p-4 text-center text-blue-600 font-semibold bg-blue-50">✓ Ideal</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 p-4 text-slate-700 font-medium">Cargas de alto valor en rutas aisladas</td>
                  <td className="border border-slate-200 p-4 text-center text-red-600">✗ Riesgo alto</td>
                  <td className="border border-slate-200 p-4 text-center text-blue-600 font-semibold bg-blue-50">✓ Ideal</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 p-4 text-slate-700 font-medium">Tours y expediciones en montaña/desierto</td>
                  <td className="border border-slate-200 p-4 text-center text-red-600">✗ No confiable</td>
                  <td className="border border-slate-200 p-4 text-center text-blue-600 font-semibold bg-blue-50">✓ Ideal</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 p-4 text-slate-700 font-medium">Maquinaria en obras de construcción aisladas</td>
                  <td className="border border-slate-200 p-4 text-center text-red-600">✗ Sin cobertura</td>
                  <td className="border border-slate-200 p-4 text-center text-blue-600 font-semibold bg-blue-50">✓ Ideal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Página 4 de 5</p>
        </div>
      </section>

      {/* Página 5: Contacto */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-slate-50">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-4xl">RR</span>
          </div>

          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            ¿Tienes operaciones en zonas remotas?
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl">
            Agenda una demostración personalizada y conoce cómo podemos ayudarte 
            a mantener visibilidad donde otros sistemas fallan.
          </p>

          {/* Información de contacto */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-2xl w-full">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">Teléfono</h3>
              <p className="text-slate-600">311-122-3365</p>
              <p className="text-slate-600">81-1016-6812</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">Ubicación</h3>
              <p className="text-slate-600">Monterrey, Nuevo León</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-slate-800 text-white rounded-xl p-8 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Solicita una Demo</h3>
            <p className="text-slate-300 mb-4">
              Te mostramos en vivo cómo funciona el sistema con ejemplos reales 
              de monitoreo satelital en operaciones mineras y de transporte.
            </p>
            <p className="text-sm text-slate-400">
              Sin compromiso • Personalizada a tu industria • 30 minutos
            </p>
          </div>
        </div>

        {/* Footer de página */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
          <p>RR Logistics — Monterrey, Nuevo León, México — Página 5 de 5</p>
        </div>
      </section>
    </div>
  );
};

export default FichaServicios;
