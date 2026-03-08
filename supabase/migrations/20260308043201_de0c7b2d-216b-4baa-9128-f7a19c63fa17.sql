
-- Tax Residency Engine
CREATE OR REPLACE FUNCTION check_visa_status(p_user_id UUID)
RETURNS TABLE (
  country text,
  days_spent INT,
  tax_resident BOOLEAN
)
AS $$
DECLARE
  year_start DATE := DATE_TRUNC('year', CURRENT_DATE)::date;
  year_end DATE := (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day')::date;
BEGIN
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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- State Machine
CREATE OR REPLACE FUNCTION enforce_state_transition()
RETURNS trigger
AS $$
DECLARE
  allowed BOOLEAN := FALSE;
  actor uuid;
BEGIN
  actor := COALESCE(auth.uid(), NEW.user_id);

  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'lead' AND NEW.status = 'applicant' THEN allowed := TRUE; END IF;
  IF OLD.status = 'applicant' AND NEW.status IN ('pending_deposit','rejected','cancelled') THEN allowed := TRUE; END IF;
  IF OLD.status = 'pending_deposit' AND NEW.status IN ('deposit_paid','cancelled') THEN allowed := TRUE; END IF;
  IF OLD.status = 'deposit_paid' AND NEW.status IN ('doc_verification','refund_pending') THEN allowed := TRUE; END IF;
  IF OLD.status = 'doc_verification' AND NEW.status IN ('filing','rejected','compliance_alert') THEN allowed := TRUE; END IF;
  IF OLD.status = 'filing' AND NEW.status IN ('active_resident','rejected') THEN allowed := TRUE; END IF;
  IF OLD.status = 'compliance_alert' AND NEW.status IN ('doc_verification','rejected','cancelled') THEN allowed := TRUE; END IF;
  IF OLD.status = 'rejected' AND NEW.status = 'refund_pending' THEN allowed := TRUE; END IF;
  IF OLD.status = 'refund_pending' AND NEW.status = 'refunded' THEN allowed := TRUE; END IF;

  IF NOT allowed THEN
    RAISE EXCEPTION 'Illegal Status Transition: % -> %', OLD.status, NEW.status;
  END IF;

  INSERT INTO status_history (enrollment_id, old_status, new_status, reason, changed_by)
  VALUES (NEW.id, OLD.status, NEW.status, 'State Machine Audit', actor);

  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Trigger
DROP TRIGGER IF EXISTS trg_enrollments_state_machine ON enrollments;
CREATE TRIGGER trg_enrollments_state_machine
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION enforce_state_transition();
