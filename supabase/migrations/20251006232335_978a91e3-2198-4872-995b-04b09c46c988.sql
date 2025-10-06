-- Add polygon support to checkpoints table
ALTER TABLE public.checkpoints 
ADD COLUMN IF NOT EXISTS polygon jsonb,
ADD COLUMN IF NOT EXISTS geometry_type text NOT NULL DEFAULT 'circle';

-- Add check constraint for geometry_type
ALTER TABLE public.checkpoints 
ADD CONSTRAINT checkpoints_geometry_type_check 
CHECK (geometry_type IN ('circle', 'polygon'));

-- Make lat, lng, radius_m nullable (only required for circles)
ALTER TABLE public.checkpoints 
ALTER COLUMN lat DROP NOT NULL,
ALTER COLUMN lng DROP NOT NULL,
ALTER COLUMN radius_m DROP NOT NULL;

-- Migrate the 7 polygon checkpoints from sectors to checkpoints
INSERT INTO public.checkpoints (name, polygon, geometry_type, enabled, created_at)
SELECT 
  name,
  polygon,
  'polygon'::text,
  enabled,
  created_at
FROM public.sectors 
WHERE id IN (1, 2, 3, 4, 5, 6, 7);

-- Delete the migrated records from sectors
DELETE FROM public.sectors WHERE id IN (1, 2, 3, 4, 5, 6, 7);

-- Add validation trigger to ensure data integrity
CREATE OR REPLACE FUNCTION public.validate_checkpoint_geometry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.geometry_type = 'circle' THEN
    IF NEW.lat IS NULL OR NEW.lng IS NULL OR NEW.radius_m IS NULL THEN
      RAISE EXCEPTION 'Circular checkpoints require lat, lng, and radius_m';
    END IF;
    NEW.polygon = NULL; -- Clear polygon for circles
  ELSIF NEW.geometry_type = 'polygon' THEN
    IF NEW.polygon IS NULL THEN
      RAISE EXCEPTION 'Polygon checkpoints require polygon data';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_checkpoint_geometry_trigger
BEFORE INSERT OR UPDATE ON public.checkpoints
FOR EACH ROW
EXECUTE FUNCTION public.validate_checkpoint_geometry();