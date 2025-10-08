-- Crear evento manual de entrada al checkpoint Casa
INSERT INTO events (
  unit_id,
  type,
  ref_type,
  ref_id,
  lat,
  lng,
  ts,
  meta
)
VALUES (
  '0-5066561',
  'checkpoint_enter',
  'checkpoint',
  10,
  25.5872136,
  -100.2619194,
  '2025-10-08 23:42:18+00',
  '{"checkpoint_name": "Casa Checkpoint 3"}'::jsonb
);