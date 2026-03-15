import { useState, useEffect, useCallback } from 'react';

export const useMockData = (importFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      const result = importFn();
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    }, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [importFn]);

  const refetch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setData(importFn());
      setLoading(false);
    }, 200);
  }, [importFn]);

  return { data, loading, refetch };
};

export default useMockData;
