-- Add fields to sectors table for source tracking and buffer configuration
ALTER TABLE public.sectors 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS buffer_m integer DEFAULT 250,
ADD COLUMN IF NOT EXISTS color text DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS is_proposed boolean DEFAULT false;

-- Create routes table to store route lines for deviation calculation
CREATE TABLE IF NOT EXISTS public.routes (
  id bigserial PRIMARY KEY,
  sector_id bigint REFERENCES public.sectors(id) ON DELETE CASCADE,
  name text NOT NULL,
  line_geometry jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on routes
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Full access to routes" ON public.routes
  FOR ALL USING (true);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_routes_sector_id ON public.routes(sector_id);

-- Create sector_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.sector_history (
  id bigserial PRIMARY KEY,
  sector_id bigint NOT NULL,
  changed_by text,
  action text NOT NULL,
  old_geometry jsonb,
  new_geometry jsonb,
  parameters jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sector_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Full access to sector_history" ON public.sector_history
  FOR ALL USING (true);

-- Add trigger for routes updated_at
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();