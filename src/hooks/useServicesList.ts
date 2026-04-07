import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Service } from '@/pages/ServicePage';

const FETCH_TIMEOUT_MS = 8000;

/**
 * Fetches an ARRAY of active services by category pattern and visibility scope.
 * Filters to only services with valid stripe_price_id starting with "price_" (not placeholders).
 * Orders by price ascending.
 */
export function useServicesList(categoryPattern: string, scope: 'tr' | 'global') {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const currentId = ++fetchIdRef.current;
    setIsLoading(true);
    setHasError(false);
    setServices([]);
    setErrorDetail('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .ilike('category', categoryPattern)
      .in('visible_on', [scope, 'both'])
      .order('price', { ascending: true })
      .abortSignal(controller.signal)
      .then(({ data, error }) => {
        clearTimeout(timeout);
        if (currentId !== fetchIdRef.current) return;

        if (error) {
          const msg = controller.signal.aborted
            ? `TIMEOUT: Fetch did not resolve within ${FETCH_TIMEOUT_MS}ms`
            : `FETCH_ERROR: ${error.message}`;
          console.error(`[ServicesList:${categoryPattern}] ${msg}`);
          setErrorDetail(msg);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Filter to only valid stripe price IDs (not placeholders)
        const valid = ((data || []) as unknown as Service[]).filter(
          (s) =>
            s.stripe_price_id &&
            s.stripe_price_id.startsWith('price_') &&
            !s.stripe_price_id.includes('placeholder')
        );

        console.log(
          `[ServicesList:${categoryPattern}] Fetched ${data?.length ?? 0} total, ${valid.length} with valid Stripe IDs`
        );

        if (valid.length === 0) {
          const msg = `NO_VALID_SERVICES: category="${categoryPattern}", scope="${scope}", raw=${data?.length ?? 0}`;
          console.warn(`[ServicesList:${categoryPattern}] ${msg}`);
          setErrorDetail(msg);
          // Not setting hasError — let the page decide how to handle 0 services
        }

        setServices(valid);
        setIsLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [categoryPattern, scope]);

  return { services, isLoading, hasError, errorDetail };
}
