-- Insert example sectors with polygon coordinates
INSERT INTO public.sectors (id, name, polygon, enabled, created_by) VALUES
(1, 'Sector Ciudad', 
 '{"type": "Polygon", "coordinates": [[[-105.704, 26.940], [-105.702, 26.942], [-105.700, 26.943], [-105.698, 26.942], [-105.697, 26.940], [-105.698, 26.938], [-105.700, 26.937], [-105.703, 26.938], [-105.704, 26.940]]]}',
 true, 'system'),
(2, 'Sector Carretera',
 '{"type": "Polygon", "coordinates": [[[-105.710, 26.950], [-105.709, 26.960], [-105.710, 26.970], [-105.712, 26.970], [-105.713, 26.960], [-105.712, 26.950], [-105.710, 26.950]]]}',
 true, 'system'),
(3, 'Sector San Francisco del Oro',
 '{"type": "Polygon", "coordinates": [[[-105.920, 26.800], [-105.918, 26.810], [-105.915, 26.815], [-105.913, 26.810], [-105.914, 26.805], [-105.916, 26.802], [-105.918, 26.800], [-105.920, 26.800]]]}',
 true, 'system'),
(4, 'Sector Mina',
 '{"type": "Polygon", "coordinates": [[[-105.930, 26.920], [-105.930, 26.940], [-105.933, 26.945], [-105.935, 26.940], [-105.935, 26.920], [-105.933, 26.915], [-105.930, 26.920]]]}',
 true, 'system')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  polygon = EXCLUDED.polygon,
  enabled = EXCLUDED.enabled,
  updated_at = now();