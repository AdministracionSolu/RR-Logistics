-- Ensure trigger to create profiles on new auth users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- Backfill profiles for existing auth users without a profile
INSERT INTO public.profiles (user_id, email, user_type, full_name)
SELECT 
  u.id, 
  u.email, 
  COALESCE(u.raw_user_meta_data ->> 'user_type', 'tipo_a') AS user_type,
  COALESCE(u.raw_user_meta_data ->> 'full_name', u.email) AS full_name
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;