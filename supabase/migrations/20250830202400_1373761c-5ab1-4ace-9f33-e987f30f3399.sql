-- Crear casetas para las ciudades mexicanas mencionadas en el archivo CSV
INSERT INTO public.casetas_autopista (nombre, autopista, lat, lng, activa, tipo_caseta) VALUES
-- Ruta Tijuana-Mérida
('Caseta Tijuana-Tecate', 'Autopista Tijuana-Tecate', 32.5149, -117.0382, true, 'peaje'),
('Caseta Mexicali', 'Autopista Mexicali', 32.6245, -115.4523, true, 'peaje'),
('Caseta Hermosillo', 'Autopista Hermosillo', 29.0729, -110.9559, true, 'peaje'),
('Caseta Culiacán', 'Autopista Culiacán', 24.8048, -107.3971, true, 'peaje'),
('Caseta Mazatlán', 'Autopista Mazatlán', 23.2494, -106.4103, true, 'peaje'),
('Caseta Tepic', 'Autopista Tepic', 21.5041, -104.8455, true, 'peaje'),
('Caseta Guadalajara', 'Autopista Guadalajara', 20.6597, -103.3496, true, 'peaje'),
('Caseta León', 'Autopista León', 21.1250, -101.6854, true, 'peaje'),
('Caseta Querétaro', 'Autopista Querétaro', 20.5888, -100.3899, true, 'peaje'),
('Caseta Pachuca', 'Autopista Pachuca', 20.1011, -98.7591, true, 'peaje'),
('Caseta Veracruz', 'Autopista Veracruz', 19.1738, -96.1342, true, 'peaje'),
('Caseta Campeche', 'Autopista Campeche', 19.8301, -90.5349, true, 'peaje'),
('Caseta Mérida', 'Autopista Mérida', 20.9674, -89.5926, true, 'peaje'),
('Caseta Mérida-Cancún', 'Autopista Mérida-Cancún', 20.9674, -89.5926, true, 'peaje'),
('Caseta Valladolid', 'Autopista Valladolid', 20.6906, -88.2025, true, 'peaje'),

-- Ruta Acapulco
('Caseta Acapulco-Cuernavaca', 'Autopista Acapulco-Cuernavaca', 16.8531, -99.8237, true, 'peaje'),
('Caseta Cuernavaca', 'Autopista Cuernavaca', 18.9231, -99.2558, true, 'peaje'),
('Caseta México-Toluca', 'Autopista México-Toluca', 19.3371, -99.6928, true, 'peaje'),
('Caseta Toluca', 'Autopista Toluca', 19.2933, -99.6570, true, 'peaje'),
('Caseta Morelia', 'Autopista Morelia', 19.7060, -101.1953, true, 'peaje'),

-- Ruta Monterrey
('Caseta Monterrey-Saltillo', 'Autopista Monterrey-Saltillo', 25.6866, -100.3161, true, 'peaje'),
('Caseta Saltillo', 'Autopista Saltillo', 25.4232, -101.0053, true, 'peaje'),
('Caseta San Luis Potosí', 'Autopista San Luis Potosí', 22.1565, -100.9855, true, 'peaje'),
('Caseta Aguascalientes', 'Autopista Aguascalientes', 21.8853, -102.2916, true, 'peaje'),
('Caseta Zacatecas', 'Autopista Zacatecas', 22.7709, -102.5832, true, 'peaje'),
('Caseta Puerto Vallarta', 'Autopista Puerto Vallarta', 20.6534, -105.2253, true, 'peaje'),

-- Ruta León-Chihuahua  
('Caseta León-Aguascalientes', 'Autopista León-Aguascalientes', 21.1250, -101.6854, true, 'peaje'),
('Caseta Durango', 'Autopista Durango', 24.0277, -104.6532, true, 'peaje'),
('Caseta Torreón', 'Autopista Torreón', 25.5428, -103.4068, true, 'peaje'),
('Caseta Chihuahua', 'Autopista Chihuahua', 28.6353, -106.0889, true, 'peaje'),
('Caseta Cuauhtémoc', 'Autopista Cuauhtémoc', 28.4056, -106.8714, true, 'peaje');