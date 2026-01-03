-- Notify PostgREST to reload the schema cache
-- This is useful when table structure changes are not picked up immediately
NOTIFY pgrst, 'reload config';
