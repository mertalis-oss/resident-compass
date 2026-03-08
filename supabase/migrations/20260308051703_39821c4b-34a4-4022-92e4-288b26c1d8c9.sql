
-- Fix search_path on prevent_ledger_modification
CREATE OR REPLACE FUNCTION prevent_ledger_modification() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'Ledger is strictly immutable'; END;
$$ LANGUAGE plpgsql SET search_path = public;
