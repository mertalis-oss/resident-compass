CREATE OR REPLACE FUNCTION public.check_visa_status(p_user_id uuid)
 RETURNS TABLE(country text, days_spent integer, tax_resident boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  year_start DATE := DATE_TRUNC('year', CURRENT_DATE)::date;
  year_end DATE := (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day')::date;
BEGIN
  IF auth.uid() IS NULL OR (
     auth.uid() <> p_user_id
     AND NOT public.has_role(auth.uid(), 'admin'::user_role)
     AND NOT public.has_role(auth.uid(), 'agent'::user_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: Unauthorized visa status check.';
  END IF;

RETURN QUERY
SELECT
  v.country,
  COALESCE(
    SUM(
      LEAST(COALESCE(v.exit_date, CURRENT_DATE), year_end)
      - GREATEST(v.entry_date, year_start)
    ) + COUNT(v.id),
    0
  )::INT AS days_spent,
  CASE
    WHEN COALESCE(
      SUM(
        LEAST(COALESCE(v.exit_date, CURRENT_DATE), year_end)
        - GREATEST(v.entry_date, year_start)
      ) + COUNT(v.id),
      0
    ) >= 180
    THEN TRUE
    ELSE FALSE
  END AS tax_resident
FROM visa_entries v
WHERE v.user_id = p_user_id
  AND v.entry_date <= year_end
  AND COALESCE(v.exit_date, CURRENT_DATE) >= year_start
GROUP BY v.country;
END;
$function$;