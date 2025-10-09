-- Insertar Sector Ciudad con polígono urbano
INSERT INTO public.sectors (name, polygon, color, enabled, source)
VALUES (
  'Sector Ciudad',
  '{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-105.7201653,26.9345649],
            [-105.6717573,26.9060962],
            [-105.6513306,26.9109967],
            [-105.6309022,26.9201784],
            [-105.6422317,26.9495618],
            [-105.6395711,26.9596601],
            [-105.6379402,26.9702173],
            [-105.6434323,26.9965294],
            [-105.6576811,27.0113644],
            [-105.7201653,26.9345649]
          ]]
        },
        "properties": {
          "name": "Sector Ciudad",
          "fillColor": "#1200FF",
          "borderColor": "#000000",
          "fillOpacity": 0.35,
          "borderWeight": 2,
          "tessellate": true
        }
      }
    ]
  }'::jsonb,
  '#1200FF',
  true,
  'manual'
);