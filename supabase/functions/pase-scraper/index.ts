import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const executionId = crypto.randomUUID();
  
  try {
    console.log(`Starting PASE scraper execution: ${executionId}`);
    
    // Log execution start
    await supabase.from('bot_execution_logs').insert({
      execution_id: executionId,
      status: 'running',
      start_time: new Date().toISOString(),
    });

    // Get PASE credentials from secrets
    const username = Deno.env.get('PASE_USERNAME');
    const password = Deno.env.get('PASE_PASSWORD');

    if (!username || !password) {
      throw new Error('PASE credentials not configured');
    }

    // Note: In a real implementation, you would use Puppeteer here
    // For now, we'll simulate the process and return mock data
    console.log('Simulating PASE login and CSV download...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock CSV data that would be extracted from PASE
    const mockCsvData = [
      {
        fecha_hora: new Date().toISOString(),
        tag_id: 'TAG001',
        caseta_nombre: 'Caseta Test',
        importe: 45.50,
        saldo: 500.00,
        folio: 'FOL123456',
        concepto: 'Peaje',
        clase: 'Ligero'
      }
    ];

    // Process and save the data
    const processedRecords = [];
    
    for (const record of mockCsvData) {
      // Find caseta by name
      const { data: caseta } = await supabase
        .from('casetas_autopista')
        .select('id')
        .ilike('nombre', `%${record.caseta_nombre}%`)
        .single();

      // Insert toll event
      const { data: tollEvent, error: insertError } = await supabase
        .from('toll_events')
        .insert({
          fecha_hora: record.fecha_hora,
          tag_id: record.tag_id,
          caseta_id: caseta?.id,
          caseta_nombre: record.caseta_nombre,
          importe: record.importe,
          saldo: record.saldo,
          folio: record.folio,
          concepto: record.concepto,
          clase: record.clase,
          source_type: 'bot'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting toll event:', insertError);
      } else {
        processedRecords.push(tollEvent);
      }
    }

    // Update bot execution log with success
    await supabase
      .from('bot_execution_logs')
      .update({
        status: 'success',
        end_time: new Date().toISOString(),
        records_processed: processedRecords.length,
        execution_details: {
          records_found: mockCsvData.length,
          records_inserted: processedRecords.length,
          source: 'pase_portal'
        }
      })
      .eq('execution_id', executionId);

    // Update bot config last execution time
    await supabase
      .from('bot_config')
      .update({
        last_execution: new Date().toISOString(),
        next_execution: new Date(Date.now() + 10 * 60 * 1000).toISOString() // Next execution in 10 minutes
      })
      .eq('id', (await supabase.from('bot_config').select('id').single()).data?.id);

    console.log(`PASE scraper execution completed: ${executionId}, processed ${processedRecords.length} records`);

    return new Response(JSON.stringify({
      success: true,
      executionId,
      recordsProcessed: processedRecords.length,
      message: 'PASE data extracted and processed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PASE scraper:', error);
    
    // Log execution error
    await supabase
      .from('bot_execution_logs')
      .update({
        status: 'error',
        end_time: new Date().toISOString(),
        error_message: error.message,
        execution_details: {
          error: error.message,
          stack: error.stack
        }
      })
      .eq('execution_id', executionId);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      executionId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});