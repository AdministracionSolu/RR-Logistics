-- Create table for duplicate charge alerts
CREATE TABLE public.duplicate_charge_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id TEXT NOT NULL,
  first_event JSONB NOT NULL,
  second_event JSONB NOT NULL,
  time_difference_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.duplicate_charge_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing all alerts (since this is an internal management system)
CREATE POLICY "Allow read access to duplicate charge alerts" 
ON public.duplicate_charge_alerts 
FOR SELECT 
USING (true);

-- Create policy for updating alerts (resolving them)
CREATE POLICY "Allow update access to duplicate charge alerts" 
ON public.duplicate_charge_alerts 
FOR UPDATE 
USING (true);

-- Create policy for inserting new alerts
CREATE POLICY "Allow insert access to duplicate charge alerts" 
ON public.duplicate_charge_alerts 
FOR INSERT 
WITH CHECK (true);

-- Create policy for deleting alerts
CREATE POLICY "Allow delete access to duplicate charge alerts" 
ON public.duplicate_charge_alerts 
FOR DELETE 
USING (true);

-- Add indexes for better performance
CREATE INDEX idx_duplicate_alerts_tag_id ON public.duplicate_charge_alerts(tag_id);
CREATE INDEX idx_duplicate_alerts_status ON public.duplicate_charge_alerts(status);
CREATE INDEX idx_duplicate_alerts_created_at ON public.duplicate_charge_alerts(created_at);

-- Add foreign key relationship to camiones table via tag_id
-- Note: We can't use a direct FK since tag_id is not the primary key of camiones
-- But we can add a comment to document the relationship
COMMENT ON COLUMN public.duplicate_charge_alerts.tag_id IS 'References camiones.tag_id for truck identification';