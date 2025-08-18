import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CrucePayload {
  placa?: string;
  caseta_id?: string;
  caseta_nombre?: string;
  autopista?: string;
  tipo_cruce?: 'entrada' | 'salida';
  timestamp?: string;
  ruta_id?: string;
  // Campos adicionales que pueden venir del proveedor del TAG
  tag_id?: string;
  monto?: number;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Webhook recibido - método:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método no permitido' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Leer el payload
    const payload: CrucePayload = await req.json();
    console.log('Payload recibido:', payload);

    // Validar campos requeridos
    if (!payload.placa) {
      return new Response(
        JSON.stringify({ error: 'Campo placa es requerido' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Buscar el camión por placa
    const { data: camion, error: camionError } = await supabase
      .from('camiones')
      .select('id')
      .eq('placas', payload.placa)
      .single();

    if (camionError || !camion) {
      console.error('Camión no encontrado:', camionError);
      return new Response(
        JSON.stringify({ error: `Camión con placa ${payload.placa} no encontrado` }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Buscar o crear la caseta
    let caseta_id = payload.caseta_id;
    
    if (!caseta_id && payload.caseta_nombre && payload.autopista) {
      // Buscar caseta existente
      const { data: casetaExistente } = await supabase
        .from('casetas_autopista')
        .select('id')
        .eq('nombre', payload.caseta_nombre)
        .eq('autopista', payload.autopista)
        .single();

      if (casetaExistente) {
        caseta_id = casetaExistente.id;
      } else if (payload.coordenadas) {
        // Crear nueva caseta si se proporcionan coordenadas
        const { data: nuevaCaseta, error: casetaError } = await supabase
          .from('casetas_autopista')
          .insert([{
            nombre: payload.caseta_nombre,
            autopista: payload.autopista,
            lat: payload.coordenadas.lat,
            lng: payload.coordenadas.lng,
            activa: true
          }])
          .select('id')
          .single();

        if (casetaError) {
          console.error('Error creando caseta:', casetaError);
          return new Response(
            JSON.stringify({ error: 'Error creando caseta' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        caseta_id = nuevaCaseta.id;
      }
    }

    if (!caseta_id) {
      return new Response(
        JSON.stringify({ error: 'No se pudo identificar la caseta' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Registrar el cruce
    const cruceData = {
      camion_id: camion.id,
      caseta_id: caseta_id,
      tipo_cruce: payload.tipo_cruce || 'entrada',
      ruta_id: payload.ruta_id || null,
      timestamp: payload.timestamp ? new Date(payload.timestamp).toISOString() : new Date().toISOString()
    };

    const { data: cruce, error: cruceError } = await supabase
      .from('cruces_registrados')
      .insert([cruceData])
      .select()
      .single();

    if (cruceError) {
      console.error('Error registrando cruce:', cruceError);
      return new Response(
        JSON.stringify({ error: 'Error registrando cruce' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Si se proporciona información de ubicación, actualizar la ubicación del camión
    if (payload.coordenadas) {
      const { error: ubicacionError } = await supabase
        .from('ubicaciones_tiempo_real')
        .insert([{
          camion_id: camion.id,
          lat: payload.coordenadas.lat,
          lng: payload.coordenadas.lng,
          velocidad: 0, // Velocidad 0 al pasar por caseta
          direccion: `Caseta ${payload.caseta_nombre || 'TAG'}`
        }]);

      if (ubicacionError) {
        console.error('Error actualizando ubicación:', ubicacionError);
      }
    }

    console.log('Cruce registrado exitosamente:', cruce);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cruce registrado exitosamente',
        cruce_id: cruce.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});