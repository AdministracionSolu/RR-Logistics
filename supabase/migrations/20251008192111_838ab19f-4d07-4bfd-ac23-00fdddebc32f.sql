-- Insert CheckPoints B for user type B
INSERT INTO public.checkpoints (name, lat, lng, radius_m, geometry_type, created_by, enabled)
VALUES 
  ('Costco CheckPoint', 25.6401205, -100.3176854, 200, 'circle', 'tipo_b', true),
  ('Walmart CheckPoint', 25.6162971, -100.2737063, 200, 'circle', 'tipo_b', true),
  ('Casa Checkpoint 3', 25.5872136, -100.2619194, 200, 'circle', 'tipo_b', true);