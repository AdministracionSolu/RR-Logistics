-- Add sample casetas with correct sentido values (norte/sur only)
INSERT INTO public.casetas_autopista (nombre, autopista, lat, lng, km, sentido) VALUES
('Caseta 366', 'Autopista México-Toluca', 19.4326, -99.1332, 25.5, 'norte'),
('Caseta 782', 'Autopista Chamapa-Lechería', 19.5500, -99.2500, 12.3, 'norte'),
('Caseta 639', 'Autopista México-Cuernavaca', 19.3500, -99.1800, 45.2, 'sur'),
('Caseta 783', 'Autopista México-Puebla', 19.4000, -98.9000, 67.8, 'norte'),
('Caseta 752', 'Autopista México-Querétaro', 19.7000, -99.2000, 89.1, 'norte'),
('Caseta 341', 'Autopista Circuito Exterior Mexiquense', 19.6000, -99.3000, 34.6, 'sur'),
('Caseta 372', 'Autopista México-Toluca', 19.4500, -99.2500, 42.1, 'sur'),
('Caseta 787', 'Autopista México-Pachuca', 19.6500, -98.8000, 56.7, 'norte'),
('Caseta 788', 'Autopista México-Texcoco', 19.4800, -98.9500, 23.4, 'norte'),
('Caseta 767', 'Autopista Viaducto Elevado', 19.4200, -99.1600, 15.8, 'sur');

-- Add sample trucks to link with tags
INSERT INTO public.camiones (placas, modelo, tag_id, estado) VALUES
('ABC-123', 'Freightliner Cascadia', 'IMDM26585511', 'activo'),
('DEF-456', 'Kenworth T680', 'IMDM26585512', 'activo'),
('GHI-789', 'Volvo VNL', 'IMDM26585513', 'activo');