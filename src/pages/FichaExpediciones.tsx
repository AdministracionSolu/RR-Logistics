import { Button } from "@/components/ui/button";
import { Printer, MapPin, Shield, Heart, Users, Phone, Building2, Satellite, Mountain, Compass, Check, Globe, Clock, Eye, Lock, ChurchIcon, Tent, TreePine, Map, ArrowRight, Star } from "lucide-react";

const FichaExpediciones = () => {
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
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RR</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">RR Logistics</h1>
              <p className="text-slate-500 text-sm">Monitoreo para Expediciones</p>
            </div>
          </div>
        </div>

        {/* Título principal */}
        <div className="text-center mb-12 max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 mx-auto">
            <Satellite className="h-4 w-4" />
            Monitoreo Satelital para Expediciones
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Que sus familias los acompañen, aunque no puedan ir
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Plataforma de monitoreo en tiempo real para expediciones, senderismo, misiones y grupos de aventura.
          </p>
        </div>

        {/* Propuesta de valor dual */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Para las Familias</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Tranquilidad de saber dónde están en todo momento. Un link privado 
              donde pueden ver la ubicación del grupo sin depender de llamadas o mensajes.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Para tu Empresa</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Un valor agregado que te diferencia de la competencia. Mayor confianza 
              de los participantes y sus seres queridos al saber su ubicación en todo momento.
            </p>
          </div>
        </div>

        {/* Footer de página */}
        <div className="mt-auto pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
          <p>RR Logistics — Monterrey, Nuevo León, México — Página 1 de 5</p>
        </div>
      </section>

      {/* Página 2: Casos de Uso Específicos */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">¿Para Quién Es Este Servicio?</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Diseñado para empresas y organizaciones que llevan grupos a zonas sin señal celular 
          y quieren ofrecer tranquilidad a los familiares de los participantes.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {/* Misiones de Iglesias */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <ChurchIcon className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Misiones de Iglesias</h3>
            <p className="text-sm text-slate-600 mb-4">
              Grupos de voluntarios van a comunidades remotas. Sus familias pueden ver 
              en tiempo real cómo avanza el viaje y cuándo llegaron a destino.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Valor:</strong> Mayor tranquilidad para participantes y familias
            </div>
          </div>

          {/* Senderismo y Montañismo */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Mountain className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Senderismo y Montañismo</h3>
            <p className="text-sm text-slate-600 mb-4">
              Matacanes, La Huasteca, escalada de picos. Rutas donde no hay señal 
              por horas pero sí hay familias esperando noticias.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Valor:</strong> Diferenciación como tour premium
            </div>
          </div>

          {/* Campamentos Juveniles */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Tent className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Campamentos y Retiros</h3>
            <p className="text-sm text-slate-600 mb-4">
              Campamentos de verano, retiros espirituales, programas scout. 
              Las familias saben que el grupo llegó bien y dónde están instalados.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Valor:</strong> Mayor inscripción de participantes
            </div>
          </div>

          {/* Tours de Aventura */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Compass className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Tours de Aventura Premium</h3>
            <p className="text-sm text-slate-600 mb-4">
              Expediciones guiadas, turismo de naturaleza, tours fotográficos. 
              Un servicio premium para clientes que valoran la seguridad.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Valor:</strong> Posibilidad de cobro adicional
            </div>
          </div>

          {/* Viajes Escolares */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-teal-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Viajes de Grupos</h3>
            <p className="text-sm text-slate-600 mb-4">
              Excursiones, tours organizados, viajes corporativos a zonas sin señal. 
              Tranquilidad para organizadores y participantes.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Valor:</strong> Cumplimiento de protocolos de seguridad
            </div>
          </div>

          {/* Expediciones Científicas */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
              <TreePine className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Voluntariado y Expediciones</h3>
            <p className="text-sm text-slate-600 mb-4">
              Brigadas de ayuda, proyectos de reforestación, investigación de campo. 
              Coordinación a distancia y tranquilidad para los familiares.
            </p>
            <div className="text-xs text-slate-500 bg-white rounded px-3 py-2 border border-slate-100">
              <strong>Valor:</strong> Monitoreo sin depender de señal
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Página 2 de 5</p>
        </div>
      </section>

      {/* Página 3: Cómo Funciona */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-slate-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Map className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">¿Cómo Funciona?</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Un proceso simple: el dispositivo va con el guía, transmite vía satélite, 
          y los familiares pueden ver la ubicación desde cualquier dispositivo.
        </p>

        {/* Flujo visual */}
        <div className="grid md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">1. El Guía</h4>
            <p className="text-sm text-slate-600">
              Porta el dispositivo en mochila, vehículo o atado
            </p>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-slate-300 hidden md:block" />
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Satellite className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">2. Satélite</h4>
            <p className="text-sm text-slate-600">
              Transmisión directa sin depender de señal celular
            </p>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-slate-300 hidden md:block" />
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">3. Familias</h4>
            <p className="text-sm text-slate-600">
              Ven la ubicación en tiempo real desde cualquier lugar
            </p>
          </div>
        </div>

        {/* Funcionalidades de la plataforma */}
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Lo que Ven los Familiares</h3>
        
        <div className="grid md:grid-cols-2 gap-6 flex-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Mapa en Tiempo Real</h4>
            </div>
            <p className="text-slate-600 mb-4">
              Ubicación actual del grupo sobre un mapa interactivo. 
              Fácil de entender para cualquier persona, sin conocimientos técnicos.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                Posición actualizada cada pocos minutos
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                Zoom para ver detalle del terreno
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Historial de Ruta</h4>
            </div>
            <p className="text-slate-600 mb-4">
              Trazo completo del recorrido que ha hecho el grupo. 
              Pueden ver por dónde han pasado y hacia dónde van.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Línea de recorrido sobre el mapa
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Marcadores de paradas importantes
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Checkpoints Automáticos</h4>
            </div>
            <p className="text-slate-600 mb-4">
              Notificaciones cuando el grupo llega a puntos importantes: 
              salida, parada intermedia, destino final.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" />
                "El grupo salió a las 6:00 AM"
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" />
                "Llegaron al campamento base"
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 text-slate-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Acceso Controlado</h4>
            </div>
            <p className="text-slate-600 mb-4">
              Link privado o credenciales exclusivas para los familiares autorizados. 
              Solo ellos pueden ver la información.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-slate-600" />
                Acceso individual por familia
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-slate-600" />
                Privacidad y seguridad garantizada
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Página 3 de 5</p>
        </div>
      </section>

      {/* Página 4: Beneficios para tu Empresa */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Star className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Beneficios para tu Empresa</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          No es solo un servicio para los familiares. Es una herramienta estratégica 
          que mejora tu operación y te posiciona como líder en tu sector.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Diferenciación Competitiva</h4>
            </div>
            <p className="text-slate-600">
              Ofreces algo que otros no tienen. Cuando un cliente compare opciones, 
              tu servicio de monitoreo puede ser el factor decisivo.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Confianza de los Participantes</h4>
            </div>
            <p className="text-slate-600">
              Mayor conversión en reservaciones. Los participantes que antes dudaban, 
              ahora se animan porque saben que sus familias pueden verlos.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Posibilidad de Cobro</h4>
            </div>
            <p className="text-slate-600">
              Puedes ofrecerlo como servicio premium opcional o incluirlo en paquetes 
              de mayor valor. Un ingreso adicional que se paga solo.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Respaldo ante Incidentes</h4>
            </div>
            <p className="text-slate-600">
              Historial completo de la ruta como evidencia. Si algo pasa, 
              tienes documentado todo el recorrido con tiempos y ubicaciones.
            </p>
          </div>
        </div>

        {/* Tabla comparativa */}
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Comparativa: Con y Sin Monitoreo</h3>
        
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-4 font-semibold text-slate-800">Situación</th>
                <th className="text-left p-4 font-semibold text-red-600">Sin Monitoreo</th>
                <th className="text-left p-4 font-semibold text-blue-600">Con RR Logistics</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="p-4 text-slate-700 font-medium">Misión con 30 personas</td>
                <td className="p-4 text-slate-600">Familias 3 días sin noticias</td>
                <td className="p-4 text-slate-600">Ubicación visible en todo momento</td>
              </tr>
              <tr className="border-t border-slate-200 bg-white">
                <td className="p-4 text-slate-700 font-medium">Senderismo en Matacanes</td>
                <td className="p-4 text-slate-600">Sin señal por 8+ horas</td>
                <td className="p-4 text-slate-600">Posición cada pocos minutos vía satélite</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-4 text-slate-700 font-medium">Campamento en la sierra</td>
                <td className="p-4 text-slate-600">Incertidumbre hasta el regreso</td>
                <td className="p-4 text-slate-600">Checkpoints: llegó, instalado, seguro</td>
              </tr>
              <tr className="border-t border-slate-200 bg-white">
                <td className="p-4 text-slate-700 font-medium">Viaje grupal a zona remota</td>
                <td className="p-4 text-slate-600">Llamadas constantes sin respuesta</td>
                <td className="p-4 text-slate-600">Cada familia con acceso propio</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-4 text-slate-700 font-medium">Decisión de participar</td>
                <td className="p-4 text-slate-600">"Dudas sobre ir, muy riesgoso"</td>
                <td className="p-4 text-slate-600">"Confianza total, pueden verme"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Página 4 de 5</p>
        </div>
      </section>

      {/* Página 5: Contacto */}
      <section className="print-page min-h-screen p-8 md:p-12 flex flex-col bg-slate-50">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          {/* Logo grande */}
          <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-4xl">RR</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            ¿Organizas expediciones o viajes de aventura?
          </h2>
          
          <p className="text-xl text-slate-600 mb-8">
            Ofrece a los familiares la tranquilidad que merecen. 
            Conoce nuestra plataforma de monitoreo para grupos.
          </p>

          {/* Beneficios resumidos */}
          <div className="grid grid-cols-3 gap-6 mb-12 w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Satellite className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600">Sin depender de señal celular</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-slate-600">Familias ven en tiempo real</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-slate-600">Acceso controlado y seguro</p>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">
              Solicita una demostración sin compromiso
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500">Teléfonos</p>
                  <p className="font-semibold text-slate-800">81-1016-6812</p>
                  <p className="font-semibold text-slate-800">311-122-3365</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500">Ubicación</p>
                  <p className="font-semibold text-slate-800">Monterrey, Nuevo León</p>
                  <p className="text-sm text-slate-500">México</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="mt-8 p-6 bg-blue-600 rounded-xl text-white w-full">
            <p className="text-lg font-medium">
              "Que sus familias los acompañen, aunque no puedan ir"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
          <p>RR Logistics — Tecnología de Monitoreo para Expediciones — Página 5 de 5</p>
        </div>
      </section>
    </div>
  );
};

export default FichaExpediciones;
