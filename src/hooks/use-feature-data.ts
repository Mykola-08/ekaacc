import { useEffect, useState } from 'react';

export type DataSource = 'mock' | 'firebase';

interface UseFeatureDataOptions {
  enabled?: boolean;
}

export function useFeatureData<T>(
  fetchMock: () => Promise<T>,
  fetchFirebase: () => Promise<T>,
  source: DataSource = 'mock',
  options: UseFeatureDataOptions = {}
) {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    const fetcher = source === 'firebase' ? fetchFirebase : fetchMock;

    fetcher()
      .then(result => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch(e => {
        if (isMounted) {
          setError(e?.message || 'Unknown error');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [enabled, fetchFirebase, fetchMock, source]);

  return { data, loading, error };
}
