-- Update Walmart CheckPoint radius to 400 meters
UPDATE public.checkpoints 
SET radius_m = 400 
WHERE name = 'Walmart CheckPoint';