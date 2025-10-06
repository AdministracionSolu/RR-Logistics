import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  unit: string;
  event: string;
  checkpoint?: string;
  sector?: string;
  timestamp: string;
  lat: number;
  lng: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_id } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    // Find matching notification rules
    const { data: rules } = await supabase
      .from('notify_rules')
      .select('*')
      .eq('enabled', true)
      .eq('target_type', event.ref_type)
      .eq('target_id', event.ref_id);

    if (!rules || rules.length === 0) {
      console.log('No active rules found for this event');
      return new Response(JSON.stringify({ notifications_sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let notificationsSent = 0;

    // Prepare notification payload
    const payload: NotificationPayload = {
      unit: event.unit_id,
      event: event.type,
      timestamp: event.ts,
      lat: parseFloat(event.lat),
      lng: parseFloat(event.lng),
    };

    if (event.ref_type === 'checkpoint') {
      payload.checkpoint = event.meta?.checkpoint_name || `Checkpoint ${event.ref_id}`;
    } else if (event.ref_type === 'sector') {
      payload.sector = event.meta?.sector_name || `Sector ${event.ref_id}`;
    }

    // Send notifications for each rule
    for (const rule of rules) {
      try {
        const channels = rule.channel;

        // Send webhook notifications
        if (channels.webhook) {
          try {
            const webhookResponse = await fetch(channels.webhook, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            if (webhookResponse.ok) {
              notificationsSent++;
              console.log(`Webhook sent to ${channels.webhook}`);
            }
          } catch (webhookError) {
            console.error('Webhook error:', webhookError);
          }
        }

        // Email notifications (placeholder - integrate with SendGrid/Mailgun)
        if (channels.email && Array.isArray(channels.email)) {
          console.log(`Would send email to: ${channels.email.join(', ')}`);
          // TODO: Integrate with email service
          notificationsSent++;
        }

        // SMS notifications (placeholder - integrate with Twilio)
        if (channels.sms && Array.isArray(channels.sms)) {
          console.log(`Would send SMS to: ${channels.sms.join(', ')}`);
          // TODO: Integrate with SMS service
          notificationsSent++;
        }
      } catch (ruleError) {
        console.error(`Error processing rule ${rule.id}:`, ruleError);
      }
    }

    console.log(`Sent ${notificationsSent} notifications for event ${event_id}`);

    return new Response(
      JSON.stringify({ success: true, notifications_sent: notificationsSent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
