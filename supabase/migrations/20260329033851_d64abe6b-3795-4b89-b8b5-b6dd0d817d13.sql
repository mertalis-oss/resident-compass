-- God-Mode: Auto-assign admin role to founder on signup
CREATE OR REPLACE FUNCTION public.auto_assign_founder_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'mertalis@gmail.com' THEN
    UPDATE public.profiles SET role = 'admin' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger fires AFTER handle_new_user creates the profile
CREATE OR REPLACE TRIGGER trg_auto_assign_founder_admin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_founder_admin();