import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Service } from '@/pages/ServicePage';

const FETCH_TIMEOUT_MS = 8000;

/**
 * Strict single-source-of-truth service fetcher.
 * - 8s timeout via AbortController
 * - Race condition safe (fetchIdRef)
 * - Validates exactly 1 row, slug match, stripe_price_id starts with "price_"
 * - Cache-busted with no-store
 */
export function useServiceFetch(slug: string) {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const currentId = ++fetchIdRef.current;
    setIsLoading(true);
    setHasError(false);
    setService(null);
    setErrorDetail('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .abortSignal(controller.signal)
      .then(({ data, error }) => {
        clearTimeout(timeout);
        if (currentId !== fetchIdRef.current) return;

        if (error) {
          const msg = controller.signal.aborted
            ? `TIMEOUT: Fetch did not resolve within ${FETCH_TIMEOUT_MS}ms`
            : `FETCH_ERROR: ${error.message}`;
          console.error(`[ServiceFetch:${slug}] ${msg}`);
          setErrorDetail(msg);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Strict: exactly 1 row
        if (!data || data.length !== 1) {
          const msg = `HARD_FAIL: Expected exactly 1 record for slug="${slug}", got ${data?.length ?? 0}`;
          console.error(`[ServiceFetch:${slug}] ${msg}`);
          setErrorDetail(msg);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        const record = data[0];

        // Validate slug match + stripe_price_id
        if (
          !record ||
          typeof record.id !== 'string' ||
          !record.id.length ||
          record.slug !== slug ||
          typeof record.stripe_price_id !== 'string' ||
          !record.stripe_price_id.startsWith('price_')
        ) {
          const msg = `VALIDATION_FAIL: slug=${record?.slug}, price_id=${record?.stripe_price_id}`;
          console.error(`[ServiceFetch:${slug}] ${msg}`);
          setErrorDetail(msg);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        setService(record as unknown as Service);
        setIsLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  return { service, isLoading, hasError, errorDetail };
}
