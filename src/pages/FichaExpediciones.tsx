import { useState } from "react";
import { MapPin, Shield, Heart, Users, Phone, Building2, Satellite, Mountain, Compass, Check, Globe, Clock, Eye, Lock, ChurchIcon, Tent, TreePine, Map, ArrowRight, Star } from "lucide-react";

const tabs = [
  { id: 0, label: "Inicio", short: "Inicio" },
  { id: 1, label: "¿Para Quién?", short: "Servicios" },
  { id: 2, label: "Cómo Funciona", short: "Proceso" },
  { id: 3, label: "Beneficios", short: "Beneficios" },
  { id: 4, label: "Contacto", short: "Contacto" },
];

// Sección 1: Portada
const PortadaSection = () => (
  <section className="min-h-[calc(100vh-60px)] md:min-h-screen p-4 md:p-12 flex flex-col bg-slate-50">
    {/* Header */}
    <div className="flex items-center justify-between mb-6 md:mb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-800 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-base md:text-xl">RR</span>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800">RR Logistics</h1>
          <p className="text-slate-500 text-xs md:text-sm">Monitoreo para Expediciones</p>
        </div>
      </div>
    </div>

    {/* Título principal */}
    <div className="text-center mb-6 md:mb-12 max-w-4xl mx-auto flex-1 flex flex-col justify-center">
      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 mx-auto">
        <Satellite className="h-3 w-3 md:h-4 md:w-4" />
        Monitoreo Satelital para Expediciones
      </div>
      <h2 className="text-2xl md:text-5xl font-bold text-slate-800 mb-4 md:mb-6 leading-tight">
        Que sus familias los acompañen, aunque no puedan ir
      </h2>
      <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto">
        Plataforma de monitoreo en tiempo real para expediciones, senderismo, misiones y grupos de aventura.
      </p>
    </div>

    {/* Propuesta de valor dual */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto mb-4 md:mb-8">
      <div className="bg-white rounded-xl p-4 md:p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Para las Familias</h3>
        </div>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Tranquilidad de saber dónde están en todo momento. Un link privado 
          donde pueden ver la ubicación del grupo sin depender de llamadas o mensajes.
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Star className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Para tu Empresa</h3>
        </div>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Un valor agregado que te diferencia de la competencia. Mayor confianza 
          de los participantes y sus seres queridos al saber su ubicación en todo momento.
        </p>
      </div>
    </div>

    {/* Footer de página - solo desktop */}
    <div className="hidden md:block mt-auto pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
      <p>RR Logistics — Monterrey, Nuevo León, México — Página 1 de 5</p>
    </div>
  </section>
);

// Sección 2: Casos de Uso
const CasosUsoSection = () => (
  <section className="min-h-[calc(100vh-60px)] md:min-h-screen p-4 md:p-12 flex flex-col bg-white">
    <div className="flex items-center gap-3 mb-4 md:mb-8">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center">
        <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>
      <h2 className="text-xl md:text-3xl font-bold text-slate-800">¿Para Quién Es?</h2>
    </div>

    <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-8 max-w-3xl">
      Diseñado para empresas y organizaciones que llevan grupos a zonas sin señal celular 
      y quieren ofrecer tranquilidad a los familiares.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 flex-1 overflow-y-auto">
      {/* Misiones de Iglesias */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ChurchIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-700" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Misiones de Iglesias</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4">
          Grupos de voluntarios van a comunidades remotas. Sus familias pueden ver 
          en tiempo real cómo avanza el viaje.
        </p>
        <div className="text-xs text-slate-500 bg-white rounded px-2 py-1 md:px-3 md:py-2 border border-slate-100">
          <strong>Valor:</strong> Mayor tranquilidad para participantes
        </div>
      </div>

      {/* Senderismo y Montañismo */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Mountain className="h-5 w-5 md:h-6 md:w-6 text-green-700" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Senderismo</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4">
          Matacanes, La Huasteca, escalada. Rutas donde no hay señal 
          por horas pero sí hay familias esperando.
        </p>
        <div className="text-xs text-slate-500 bg-white rounded px-2 py-1 md:px-3 md:py-2 border border-slate-100">
          <strong>Valor:</strong> Tour premium diferenciado
        </div>
      </div>

      {/* Campamentos Juveniles */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Tent className="h-5 w-5 md:h-6 md:w-6 text-amber-700" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Campamentos</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4">
          Campamentos de verano, retiros espirituales, programas scout. 
          Las familias saben que el grupo llegó bien.
        </p>
        <div className="text-xs text-slate-500 bg-white rounded px-2 py-1 md:px-3 md:py-2 border border-slate-100">
          <strong>Valor:</strong> Mayor inscripción
        </div>
      </div>

      {/* Tours de Aventura */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Compass className="h-5 w-5 md:h-6 md:w-6 text-blue-700" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Tours de Aventura</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4">
          Expediciones guiadas, turismo de naturaleza. 
          Un servicio premium para clientes exigentes.
        </p>
        <div className="text-xs text-slate-500 bg-white rounded px-2 py-1 md:px-3 md:py-2 border border-slate-100">
          <strong>Valor:</strong> Cobro adicional
        </div>
      </div>

      {/* Viajes de Grupos */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <Globe className="h-5 w-5 md:h-6 md:w-6 text-teal-700" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Viajes de Grupos</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4">
          Excursiones, tours organizados, viajes corporativos a zonas sin señal.
        </p>
        <div className="text-xs text-slate-500 bg-white rounded px-2 py-1 md:px-3 md:py-2 border border-slate-100">
          <strong>Valor:</strong> Protocolos de seguridad
        </div>
      </div>

      {/* Voluntariado */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-lg flex items-center justify-center">
            <TreePine className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-800">Voluntariado</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4">
          Brigadas de ayuda, reforestación, investigación de campo.
        </p>
        <div className="text-xs text-slate-500 bg-white rounded px-2 py-1 md:px-3 md:py-2 border border-slate-100">
          <strong>Valor:</strong> Monitoreo sin señal
        </div>
      </div>
    </div>

    <div className="hidden md:block mt-6 text-center text-sm text-slate-400">
      <p>Página 2 de 5</p>
    </div>
  </section>
);

// Sección 3: Cómo Funciona
const ComoFuncionaSection = () => (
  <section className="min-h-[calc(100vh-60px)] md:min-h-screen p-4 md:p-12 flex flex-col bg-slate-50">
    <div className="flex items-center gap-3 mb-4 md:mb-8">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center">
        <Map className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>
      <h2 className="text-xl md:text-3xl font-bold text-slate-800">¿Cómo Funciona?</h2>
    </div>

    <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-8 max-w-3xl">
      Un proceso simple: el dispositivo va con el guía, transmite vía satélite, 
      y los familiares pueden ver la ubicación desde cualquier dispositivo.
    </p>

    {/* Flujo visual - móvil: vertical, desktop: horizontal */}
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6 md:mb-12">
      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 text-center flex-1">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <Users className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
        </div>
        <h4 className="font-semibold text-slate-800 mb-1 md:mb-2">1. El Guía</h4>
        <p className="text-xs md:text-sm text-slate-600">
          Porta el dispositivo en mochila o vehículo
        </p>
      </div>

      <ArrowRight className="h-5 w-5 text-slate-300 mx-auto rotate-90 md:rotate-0" />

      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 text-center flex-1">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <Satellite className="h-6 w-6 md:h-7 md:w-7 text-purple-600" />
        </div>
        <h4 className="font-semibold text-slate-800 mb-1 md:mb-2">2. Satélite</h4>
        <p className="text-xs md:text-sm text-slate-600">
          Transmisión directa sin señal celular
        </p>
      </div>

      <ArrowRight className="h-5 w-5 text-slate-300 mx-auto rotate-90 md:rotate-0" />

      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 text-center flex-1">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <Heart className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
        </div>
        <h4 className="font-semibold text-slate-800 mb-1 md:mb-2">3. Familias</h4>
        <p className="text-xs md:text-sm text-slate-600">
          Ven la ubicación en tiempo real
        </p>
      </div>
    </div>

    {/* Funcionalidades de la plataforma */}
    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-4 md:mb-6">Lo que Ven los Familiares</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 flex-1 overflow-y-auto">
      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Mapa en Tiempo Real</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
          Ubicación actual del grupo sobre un mapa interactivo.
        </p>
        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600 shrink-0" />
            Posición actualizada cada pocos minutos
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600 shrink-0" />
            Zoom para ver detalle del terreno
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Historial de Ruta</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
          Trazo completo del recorrido que ha hecho el grupo.
        </p>
        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600 shrink-0" />
            Línea de recorrido sobre el mapa
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600 shrink-0" />
            Marcadores de paradas importantes
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Checkpoints</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
          Notificaciones cuando el grupo llega a puntos importantes.
        </p>
        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-amber-600 shrink-0" />
            "El grupo salió a las 6:00 AM"
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-amber-600 shrink-0" />
            "Llegaron al campamento base"
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg flex items-center justify-center">
            <Lock className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Acceso Controlado</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
          Link privado o credenciales para los familiares autorizados.
        </p>
        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-slate-600 shrink-0" />
            Acceso individual por familia
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-slate-600 shrink-0" />
            Privacidad garantizada
          </li>
        </ul>
      </div>
    </div>

    <div className="hidden md:block mt-6 text-center text-sm text-slate-400">
      <p>Página 3 de 5</p>
    </div>
  </section>
);

// Sección 4: Beneficios
const BeneficiosSection = () => (
  <section className="min-h-[calc(100vh-60px)] md:min-h-screen p-4 md:p-12 flex flex-col bg-white">
    <div className="flex items-center gap-3 mb-4 md:mb-8">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center">
        <Star className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>
      <h2 className="text-xl md:text-3xl font-bold text-slate-800">Beneficios para tu Empresa</h2>
    </div>

    <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-8 max-w-3xl">
      No es solo un servicio para los familiares. Es una herramienta estratégica 
      que mejora tu operación y te posiciona como líder.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8">
      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Star className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Diferenciación</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          Ofreces algo que otros no tienen. Tu servicio de monitoreo puede ser el factor decisivo.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Mayor Confianza</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          Mayor conversión en reservaciones. Los participantes que antes dudaban, ahora se animan.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Ingreso Adicional</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          Ofrécelo como servicio premium opcional o inclúyelo en paquetes de mayor valor.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-slate-800">Respaldo Legal</h4>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          Historial completo de la ruta como evidencia. Tienes documentado todo el recorrido.
        </p>
      </div>
    </div>

    {/* Tabla comparativa - versión simplificada en móvil */}
    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 md:mb-4">Comparativa</h3>
    
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex-1 overflow-y-auto">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 md:p-4 font-semibold text-slate-800 text-xs md:text-sm">Situación</th>
              <th className="text-left p-2 md:p-4 font-semibold text-red-600 text-xs md:text-sm">Sin Monitoreo</th>
              <th className="text-left p-2 md:p-4 font-semibold text-blue-600 text-xs md:text-sm">Con RR Logistics</th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm">
            <tr className="border-t border-slate-200">
              <td className="p-2 md:p-4 text-slate-700 font-medium">Misión con 30 personas</td>
              <td className="p-2 md:p-4 text-slate-600">Familias 3 días sin noticias</td>
              <td className="p-2 md:p-4 text-slate-600">Ubicación visible siempre</td>
            </tr>
            <tr className="border-t border-slate-200 bg-white">
              <td className="p-2 md:p-4 text-slate-700 font-medium">Senderismo en Matacanes</td>
              <td className="p-2 md:p-4 text-slate-600">Sin señal 8+ horas</td>
              <td className="p-2 md:p-4 text-slate-600">Posición vía satélite</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="p-2 md:p-4 text-slate-700 font-medium">Campamento en la sierra</td>
              <td className="p-2 md:p-4 text-slate-600">Incertidumbre total</td>
              <td className="p-2 md:p-4 text-slate-600">Checkpoints automáticos</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="hidden md:block mt-6 text-center text-sm text-slate-400">
      <p>Página 4 de 5</p>
    </div>
  </section>
);

// Sección 5: Contacto
const ContactoSection = () => (
  <section className="min-h-[calc(100vh-60px)] md:min-h-screen p-4 md:p-12 flex flex-col bg-slate-50">
    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
      {/* Logo grande */}
      <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 md:mb-8">
        <span className="text-white font-bold text-2xl md:text-4xl">RR</span>
      </div>

      <h2 className="text-xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">
        ¿Organizas expediciones?
      </h2>
      
      <p className="text-sm md:text-xl text-slate-600 mb-6 md:mb-8">
        Ofrece a los familiares la tranquilidad que merecen. 
        Conoce nuestra plataforma de monitoreo.
      </p>

      {/* Beneficios resumidos */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-12 w-full">
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
            <Satellite className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          </div>
          <p className="text-xs md:text-sm text-slate-600">Sin señal celular</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
            <Eye className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
          </div>
          <p className="text-xs md:text-sm text-slate-600">Tiempo real</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
            <Lock className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
          </div>
          <p className="text-xs md:text-sm text-slate-600">Acceso seguro</p>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-white rounded-xl p-4 md:p-8 border border-slate-200 w-full">
        <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-4 md:mb-6">
          Solicita una demostración
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm text-slate-500">Teléfonos</p>
              <p className="font-semibold text-slate-800 text-sm md:text-base">81-1016-6812</p>
              <p className="font-semibold text-slate-800 text-sm md:text-base">311-122-3365</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm text-slate-500">Ubicación</p>
              <p className="font-semibold text-slate-800 text-sm md:text-base">Monterrey, Nuevo León</p>
              <p className="text-xs md:text-sm text-slate-500">México</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-4 md:mt-8 p-4 md:p-6 bg-blue-600 rounded-xl text-white w-full">
        <p className="text-sm md:text-lg font-medium">
          "Que sus familias los acompañen, aunque no puedan ir"
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="hidden md:block mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
      <p>RR Logistics — Tecnología de Monitoreo para Expediciones — Página 5 de 5</p>
    </div>
  </section>
);

const FichaExpediciones = () => {
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    <PortadaSection key="portada" />,
    <CasosUsoSection key="casos" />,
    <ComoFuncionaSection key="como" />,
    <BeneficiosSection key="beneficios" />,
    <ContactoSection key="contacto" />,
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Tab Navigation - Solo móvil */}
      <nav className="md:hidden sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[70px] px-3 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.short}
            </button>
          ))}
        </div>
        {/* Progress indicator */}
        <div className="h-0.5 bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }}
          />
        </div>
      </nav>

      {/* Contenido móvil - Solo la sección activa */}
      <div className="md:hidden">
        {sections[activeTab]}
      </div>

      {/* Contenido desktop - Todas las secciones con scroll */}
      <div className="hidden md:block">
        {sections}
      </div>
    </div>
  );
};

export default FichaExpediciones;
