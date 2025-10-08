-- Enable Realtime for positions table
-- This allows the frontend to receive real-time updates when new positions are inserted

-- 1. Configure REPLICA IDENTITY to capture complete row data
ALTER TABLE public.positions REPLICA IDENTITY FULL;

-- 2. Add table to Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;