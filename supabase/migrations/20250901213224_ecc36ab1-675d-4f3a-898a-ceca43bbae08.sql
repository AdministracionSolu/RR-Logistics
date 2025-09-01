-- Create bot configuration table
CREATE TABLE public.bot_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  interval_minutes INTEGER NOT NULL DEFAULT 10,
  last_execution TIMESTAMP WITH TIME ZONE,
  next_execution TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bot execution logs table
CREATE TABLE public.bot_execution_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'error', 'timeout')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  execution_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_execution_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for full access
CREATE POLICY "Full access to bot_config" 
ON public.bot_config 
FOR ALL 
USING (true);

CREATE POLICY "Full access to bot_execution_logs" 
ON public.bot_execution_logs 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_bot_config_updated_at
BEFORE UPDATE ON public.bot_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default bot configuration
INSERT INTO public.bot_config (enabled, interval_minutes) 
VALUES (false, 10);

-- Create indexes for performance
CREATE INDEX idx_bot_execution_logs_status ON public.bot_execution_logs(status);
CREATE INDEX idx_bot_execution_logs_start_time ON public.bot_execution_logs(start_time DESC);
CREATE INDEX idx_bot_config_next_execution ON public.bot_config(next_execution);