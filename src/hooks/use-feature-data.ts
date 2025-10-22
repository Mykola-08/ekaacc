import { useEffect, useState } from 'react';

export type DataSource = 'mock' | 'firebase';

export function useFeatureData<T>(fetchMock: () => Promise<T>, fetchFirebase: () => Promise<T>, source: DataSource = 'mock') {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetch = source === 'firebase' ? fetchFirebase : fetchMock;
    fetch()
      .then(setData)
      .catch(e => setError(e.message || 'Unknown error'))
      .finally(() => setLoading(false));
  }, [source]);

  return { data, loading, error };
}
