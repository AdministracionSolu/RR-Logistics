import React from 'react';
import { Printer, MapPin, Phone, Mail, Check, X, Clock, DollarSign, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FichaServicios = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg gap-2"
          size="lg"
        >
          <Printer className="h-5 w-5" />
          Imprimir / Descargar PDF
        </Button>
      </div>

      {/* Slide 1: Portada */}
      <section className="print-section min-h-screen flex flex-col bg-gradient-to-br from-[#0F1A3D] to-[#1a2d5c] text-white p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
            <span className="text-[#0F1A3D] font-bold text-xl">RR</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">RR Logistics</h1>
            <p className="text-white/70 text-sm">Soluciones Tecnológicas para Transporte</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Soluciones de software y hardware para el transporte y la logística en México
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-emerald-400">Acerca de Nosotros</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Somos una empresa emergente que ofrece soluciones tecnológicas adaptadas a las necesidades del sector transporte y logístico en México. Nuestro enfoque combina tecnología GPS avanzada con soluciones de firma digital para optimizar procesos operativos y administrativos.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-amber-400">Contexto Actual</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                El sector transporte enfrenta desafíos como la falta de visibilidad en tiempo real de sus flotillas, procesos documentales lentos, y la necesidad de herramientas accesibles que impulsen la eficiencia operativa.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-sky-400">Nuestra Solución</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Ofrecemos un ecosistema integral: desde el monitoreo satelital de unidades hasta la firma electrónica de documentos logísticos, todo diseñado para mejorar el control operativo y reducir tiempos.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-white/50 text-sm mt-8">
          Página 1 de 5
        </div>
      </section>

      {/* Slide 2: GPS Avanzado + Impacto */}
      <section className="print-section min-h-screen flex flex-col bg-white p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0F1A3D] rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F1A3D]">GPS Avanzado</h2>
        </div>

        <div className="bg-gradient-to-r from-[#0F1A3D] to-[#1a2d5c] text-white rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Monitoreo Satelital Inteligente</h3>
          <p className="text-white/90 leading-relaxed mb-4">
            Nuestra solución de rastreo GPS permite a las empresas de transporte tener visibilidad completa de su flotilla en tiempo real. Con tecnología de última generación, ofrecemos:
          </p>
          <ul className="grid md:grid-cols-2 gap-3">
            {[
              'Ubicación en tiempo real de todas las unidades',
              'Historial de recorridos y rutas',
              'Alertas de geocercas personalizables',
              'Reportes de velocidad y comportamiento',
              'Integración con sistemas existentes',
              'Dashboard intuitivo y fácil de usar'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-xl font-bold text-[#0F1A3D] mb-4">Impacto Operativo: Antes vs Después</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0F1A3D] text-white">
                <th className="p-4 text-left font-semibold">Dimensión</th>
                <th className="p-4 text-left font-semibold">
                  <span className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    Situación Actual
                  </span>
                </th>
                <th className="p-4 text-left font-semibold">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    Con SignSolú
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#0F1A3D]" />
                    Tiempo
                  </span>
                </td>
                <td className="p-4 text-gray-600 bg-red-50">Firma manual, presencial o procesos largos</td>
                <td className="p-4 text-gray-900 bg-emerald-50">Envío y firma digital en minutos desde cualquier lugar</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#0F1A3D]" />
                    Costo
                  </span>
                </td>
                <td className="p-4 text-gray-600 bg-red-50">Impresiones, escaneos, envío físico, almacenamiento</td>
                <td className="p-4 text-gray-900 bg-emerald-50">Hasta 90% más económico con documentos 100% digitales</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#0F1A3D]" />
                    Riesgo
                  </span>
                </td>
                <td className="p-4 text-gray-600 bg-red-50">Pérdida, deterioro o alteración de documentos</td>
                <td className="p-4 text-gray-900 bg-emerald-50">Documentos inalterables con sello de tiempo y respaldo en la nube</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#0F1A3D]" />
                    Imagen
                  </span>
                </td>
                <td className="p-4 text-gray-600 bg-red-50">Procesos percibidos como poco ágiles o anticuados</td>
                <td className="p-4 text-gray-900 bg-emerald-50">Mejor experiencia para clientes, socios y colaboradores</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-auto text-center text-gray-400 text-sm pt-8">
          Página 2 de 5
        </div>
      </section>

      {/* Slide 3: Dashboard SignSolú */}
      <section className="print-section min-h-screen flex flex-col bg-gray-50 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F1A3D]">SignSolú</h2>
            <p className="text-gray-500">Plataforma de Firma Electrónica</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 flex-1">
          <div>
            <h3 className="text-xl font-semibold text-[#0F1A3D] mb-4">Dashboard Principal</h3>
            <p className="text-gray-600 mb-6">
              Panel de control intuitivo que permite gestionar todos tus documentos desde un solo lugar. Visualiza métricas clave y accede rápidamente a las funciones más utilizadas.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-[#0F1A3D]">247</p>
                <p className="text-sm text-gray-500">Documentos Totales</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-emerald-500">189</p>
                <p className="text-sm text-gray-500">Completados</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-amber-500">42</p>
                <p className="text-sm text-gray-500">Pendientes</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-gray-400">16</p>
                <p className="text-sm text-gray-500">Borradores</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-[#0F1A3D] mb-3">Acciones Rápidas</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">+ Nuevo Documento</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Usar Plantilla</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Importar PDF</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0F1A3D] mb-4">Flujo de Trabajo</h3>
            <p className="text-gray-600 mb-6">
              Proceso simplificado en 5 pasos para crear, enviar y gestionar documentos firmados digitalmente.
            </p>
            
            <div className="space-y-4">
              {[
                { step: 1, title: 'Crear documento', desc: 'Sube un PDF o usa una plantilla prediseñada' },
                { step: 2, title: 'Agregar firmantes', desc: 'Añade los correos de quienes deben firmar' },
                { step: 3, title: 'Colocar campos', desc: 'Arrastra campos de firma, fecha e iniciales' },
                { step: 4, title: 'Enviar para firma', desc: 'Los firmantes reciben notificación por correo' },
                { step: 5, title: 'Documento completado', desc: 'Recibe el documento firmado con certificación' }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-8 h-8 bg-[#0F1A3D] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#0F1A3D]">{item.title}</h5>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm pt-8">
          Página 3 de 5
        </div>
      </section>

      {/* Slide 4: Interfaz del Cliente */}
      <section className="print-section min-h-screen flex flex-col bg-white p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F1A3D] mb-2">Interfaz del Firmante</h2>
        <p className="text-gray-500 mb-8">Experiencia simple y profesional para tus clientes</p>

        <div className="grid md:grid-cols-2 gap-8 flex-1">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#0F1A3D] mb-4">📧 Notificación por Correo</h3>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">De: SignSolú &lt;notificaciones@signsolu.com&gt;</p>
                <p className="text-sm text-gray-500 mb-3">Para: cliente@empresa.com</p>
                <div className="border-t pt-3">
                  <p className="font-medium text-[#0F1A3D]">Tienes un documento pendiente de firma</p>
                  <p className="text-sm text-gray-600 mt-2">RR Logistics te ha enviado "Contrato de Servicios" para tu firma electrónica.</p>
                  <div className="mt-4 bg-emerald-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium">
                    Revisar y Firmar Documento
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-[#0F1A3D] mb-4">✍️ Panel de Firma</h3>
              <p className="text-gray-600 text-sm mb-4">
                El firmante puede crear su firma de tres formas diferentes:
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 text-xs">T</span>
                  </div>
                  <span className="text-sm">Escribir nombre (genera firma tipográfica)</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-purple-600 text-xs">✏️</span>
                  </div>
                  <span className="text-sm">Dibujar firma con mouse o dedo</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                    <span className="text-amber-600 text-xs">📷</span>
                  </div>
                  <span className="text-sm">Subir imagen de firma existente</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#0F1A3D] rounded-2xl p-6 text-white h-full">
              <h3 className="text-lg font-semibold mb-4">Vista del Documento</h3>
              <p className="text-white/70 text-sm mb-6">
                El firmante visualiza el documento completo con los campos de firma claramente marcados.
              </p>
              
              <div className="bg-white rounded-xl p-4 text-gray-900">
                <div className="border-b pb-3 mb-3">
                  <p className="font-semibold text-sm">CONTRATO DE SERVICIOS LOGÍSTICOS</p>
                  <p className="text-xs text-gray-500">RR Logistics S.A. de C.V.</p>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>En la ciudad de Monterrey, N.L., a los...</p>
                  <p className="text-gray-400">...</p>
                  <p>Las partes acuerdan los siguientes términos...</p>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Firma del Cliente:</p>
                      <div className="border-2 border-dashed border-emerald-400 rounded-lg px-8 py-4 bg-emerald-50">
                        <span className="text-emerald-600 text-xs font-medium">CLICK PARA FIRMAR</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Fecha:</p>
                      <div className="border-2 border-dashed border-blue-400 rounded-lg px-4 py-2 bg-blue-50">
                        <span className="text-blue-600 text-xs">04/12/2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <div className="flex-1 bg-white/10 rounded-lg py-2 text-center text-sm">
                  Rechazar
                </div>
                <div className="flex-1 bg-emerald-500 rounded-lg py-2 text-center text-sm font-medium">
                  Confirmar Firma
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm pt-8">
          Página 4 de 5
        </div>
      </section>

      {/* Slide 5: Gestión + Precios + Contacto */}
      <section className="print-section min-h-screen flex flex-col bg-gradient-to-br from-[#0F1A3D] to-[#1a2d5c] text-white p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Gestión de Documentos & Precios</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">📁 Organización por Carpetas</h3>
            <p className="text-white/70 text-sm mb-4">
              Mantén todos tus documentos organizados con un sistema de carpetas intuitivo.
            </p>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-2">
              {['📂 Contratos 2025', '📂 Cartas Porte', '📂 Facturas Firmadas', '📂 Acuses de Recibo'].map((folder, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 hover:bg-white/5 rounded-lg">
                  <span className="text-sm">{folder}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">🔒 Seguridad y Cumplimiento</h3>
            <ul className="space-y-3">
              {[
                'Cifrado de extremo a extremo',
                'Sello de tiempo certificado',
                'Respaldo automático en la nube',
                'Cumplimiento NOM-151',
                'Auditoría completa de acciones'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 text-center">Planes SignSolú</h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <p className="text-white/60 text-sm mb-1">GRATIS</p>
            <p className="text-3xl font-bold mb-1">$0 <span className="text-base font-normal text-white/60">MXN/mes</span></p>
            <p className="text-emerald-400 text-sm mb-4">5 documentos/mes</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Firma ilimitada</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> 1 usuario</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Soporte por correo</li>
            </ul>
          </div>
          
          <div className="bg-emerald-500 rounded-2xl p-6 border-2 border-emerald-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-[#0F1A3D] text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <p className="text-white/80 text-sm mb-1">BÁSICO</p>
            <p className="text-3xl font-bold mb-1">$99 <span className="text-base font-normal text-white/80">MXN/mes</span></p>
            <p className="text-white text-sm mb-4">25 documentos/mes</p>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Todo lo anterior</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> 3 usuarios</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Plantillas personalizadas</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Soporte prioritario</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <p className="text-white/60 text-sm mb-1">PRO</p>
            <p className="text-3xl font-bold mb-1">$399 <span className="text-base font-normal text-white/60">MXN/mes</span></p>
            <p className="text-emerald-400 text-sm mb-4">500 documentos/mes</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Todo lo anterior</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Usuarios ilimitados</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> API de integración</li>
              <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Soporte 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-auto bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4 text-center">Contacto</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-400" />
              <span>info@solufintech.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-emerald-400" />
              <span>311-122-3365</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-emerald-400" />
              <span>81-1016-6812</span>
            </div>
          </div>
          <p className="text-center text-white/50 text-sm mt-4">
            www.solufintech.com | Monterrey, Nuevo León, México
          </p>
        </div>

        <div className="text-center text-white/50 text-sm pt-8">
          Página 5 de 5
        </div>
      </section>
    </div>
  );
};

export default FichaServicios;
