import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Custom hook for fetching data with loading, error, and retry states
 * Provides standardized error handling and retry logic
 *
 * @param {string} url - The URL to fetch from
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {boolean} skip - Skip fetching if true (useful for conditional requests)
 * @returns {object} { data, loading, error, retry }
 */
export function useFetch(url, options = {}, skip = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);
  const maxRetries = options.maxRetries ?? 2;
  const retryDelay = options.retryDelay ?? 1000;

  const fetchData = useCallback(async () => {
    if (skip || !url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API ${response.status}: ${errorBody.slice(0, 200)}`
        );
      }

      const result = await response.json();
      setData(result);
      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      const isNetworkError = err instanceof TypeError;

      // Retry logic for network errors
      if (isNetworkError && retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1); // Exponential backoff
        setTimeout(fetchData, delay);
        return;
      }

      setError({
        message: err.message,
        isNetworkError,
      });
      setLoading(false);
    }

    setLoading(false);
  }, [url, options, skip, maxRetries, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  return { data, loading, error, retry };
}
