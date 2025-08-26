import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Servicio para generar alertas automáticas basadas en patrones
const AlertsGenerator = () => {
  
  useEffect(() => {
    const checkAndGenerateAlerts = async () => {
      try {
        await Promise.all([
          checkLowBalanceAlerts(),
          checkInactivityAlerts(),
          checkUnusualPatternAlerts()
        ]);
      } catch (error) {
        console.error('Error generating alerts:', error);
      }
    };

    // Ejecutar al inicio
    checkAndGenerateAlerts();

    // Ejecutar cada 10 minutos
    const interval = setInterval(checkAndGenerateAlerts, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const checkLowBalanceAlerts = async () => {
    try {
      // Buscar camiones con saldo bajo (menos de $100)
      const { data: lowBalanceTrucks } = await supabase
        .from('camiones')
        .select('id, placas, tag_id, saldo_actual')
        .lt('saldo_actual', 100)
        .eq('estado', 'activo')
        .not('tag_id', 'is', null);

      if (!lowBalanceTrucks) return;

      for (const truck of lowBalanceTrucks) {
        // Verificar si ya existe una alerta reciente para este camión
        const { data: existingAlert } = await supabase
          .from('alertas')
          .select('id')
          .eq('camion_id', truck.id)
          .eq('tipo', 'saldo_bajo')
          .eq('estado', 'activa')
          .gte('timestamp', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()) // Últimas 2 horas
          .limit(1);

        if (!existingAlert || existingAlert.length === 0) {
          // Crear nueva alerta
          await supabase
            .from('alertas')
            .insert({
              camion_id: truck.id,
              titulo: `Saldo bajo en unidad ${truck.placas}`,
              descripcion: `La unidad ${truck.placas} tiene un saldo de $${truck.saldo_actual?.toFixed(2) || '0.00'}. Se recomienda recargar el TAG.`,
              tipo: 'saldo_bajo',
              prioridad: truck.saldo_actual < 50 ? 'alta' : 'media',
              tag_relacionado: truck.tag_id,
              saldo_alerta: truck.saldo_actual
            });
        }
      }
    } catch (error) {
      console.error('Error checking low balance alerts:', error);
    }
  };

  const checkInactivityAlerts = async () => {
    try {
      // Buscar camiones sin cruces en las últimas 4 horas durante horario laboral
      const currentHour = new Date().getHours();
      if (currentHour < 6 || currentHour > 22) return; // No alertar fuera de horario laboral

      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

      const { data: inactiveTrucks } = await supabase
        .from('camiones')
        .select('id, placas, tag_id, ultimo_cruce_timestamp')
        .eq('estado', 'activo')
        .not('tag_id', 'is', null)
        .or(`ultimo_cruce_timestamp.is.null,ultimo_cruce_timestamp.lt.${fourHoursAgo.toISOString()}`);

      if (!inactiveTrucks) return;

      for (const truck of inactiveTrucks) {
        // Verificar si ya existe una alerta reciente
        const { data: existingAlert } = await supabase
          .from('alertas')
          .select('id')
          .eq('camion_id', truck.id)
          .eq('tipo', 'sin_actividad')
          .eq('estado', 'activa')
          .gte('timestamp', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (!existingAlert || existingAlert.length === 0) {
          const minutosSinCruce = truck.ultimo_cruce_timestamp 
            ? Math.floor((Date.now() - new Date(truck.ultimo_cruce_timestamp).getTime()) / (1000 * 60))
            : null;

          await supabase
            .from('alertas')
            .insert({
              camion_id: truck.id,
              titulo: `Sin actividad en unidad ${truck.placas}`,
              descripcion: `La unidad ${truck.placas} no registra cruces de caseta desde hace ${minutosSinCruce ? `${Math.floor(minutosSinCruce / 60)} horas` : 'más de 4 horas'}.`,
              tipo: 'sin_actividad',
              prioridad: 'media',
              tag_relacionado: truck.tag_id,
              minutos_sin_cruce: minutosSinCruce
            });
        }
      }
    } catch (error) {
      console.error('Error checking inactivity alerts:', error);
    }
  };

  const checkUnusualPatternAlerts = async () => {
    try {
      // Detectar patrones inusuales (por ejemplo, demasiados cruces en poco tiempo)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const { data: highActivityTrucks } = await supabase
        .from('toll_events')
        .select(`
          tag_id,
          camiones!inner (
            id,
            placas
          )
        `)
        .gte('fecha_hora', oneHourAgo.toISOString())
        .order('tag_id');

      if (!highActivityTrucks) return;

      // Agrupar por tag_id y contar eventos
      const activityCount: { [key: string]: { count: number; truck: any } } = {};
      
      highActivityTrucks.forEach(event => {
        if (!activityCount[event.tag_id]) {
          activityCount[event.tag_id] = { count: 0, truck: event.camiones };
        }
        activityCount[event.tag_id].count++;
      });

      // Alertar si más de 10 cruces en 1 hora (patrón inusual)
      for (const [tagId, data] of Object.entries(activityCount)) {
        if (data.count > 10) {
          // Verificar si ya existe alerta reciente
          const { data: existingAlert } = await supabase
            .from('alertas')
            .select('id')
            .eq('camion_id', data.truck.id)
            .eq('tipo', 'patron_inusual')
            .eq('estado', 'activa')
            .gte('timestamp', oneHourAgo.toISOString())
            .limit(1);

          if (!existingAlert || existingAlert.length === 0) {
            await supabase
              .from('alertas')
              .insert({
                camion_id: data.truck.id,
                titulo: `Patrón inusual en unidad ${data.truck.placas}`,
                descripcion: `La unidad ${data.truck.placas} registró ${data.count} cruces en la última hora, lo cual es inusual.`,
                tipo: 'patron_inusual',
                prioridad: 'baja',
                tag_relacionado: tagId
              });
          }
        }
      }
    } catch (error) {
      console.error('Error checking unusual pattern alerts:', error);
    }
  };

  // Este componente no renderiza nada, solo ejecuta la lógica de alertas
  return null;
};

export default AlertsGenerator;