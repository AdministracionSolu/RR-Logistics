-- Habilitar extensiones necesarias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Ejecutar spot-feed-poller cada 60 segundos
SELECT cron.schedule(
  'spot-feed-poller-job',
  '* * * * *', -- cada minuto
  $$
  SELECT net.http_post(
    url:='https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/spot-feed-poller',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYm1ycnBzc2RtbW9xeWd0a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzQ1MTIsImV4cCI6MjA3MTA1MDUxMn0.A8CriuvTLVFE02ZW5ULZ4pSpNutER47X-sqr7K6lm-o"}'::jsonb
  ) as request_id;
  $$
);

-- Ejecutar process-events cada 60 segundos (con 10 segundos de delay)
SELECT cron.schedule(
  'process-events-job',
  '* * * * *',
  $$
  SELECT pg_sleep(10);
  SELECT net.http_post(
    url:='https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/process-events',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYm1ycnBzc2RtbW9xeWd0a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzQ1MTIsImV4cCI6MjA3MTA1MDUxMn0.A8CriuvTLVFE02ZW5ULZ4pSpNutER47X-sqr7K6lm-o"}'::jsonb
  ) as request_id;
  $$
);