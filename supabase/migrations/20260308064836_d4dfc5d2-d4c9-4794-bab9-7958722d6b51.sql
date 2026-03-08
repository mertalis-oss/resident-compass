
-- Fix overly permissive packages SELECT policy
DROP POLICY "Anyone can read packages" ON packages;
CREATE POLICY "Anyone can read packages for active services" ON packages FOR SELECT USING (
  EXISTS (SELECT 1 FROM services WHERE services.id = packages.service_id AND services.is_active = true)
);
