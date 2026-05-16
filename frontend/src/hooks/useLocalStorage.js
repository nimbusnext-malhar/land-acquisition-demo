import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage with error handling and type safety
 * Handles corrupted data gracefully by falling back to default value
 *
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist or data is corrupted
 * @returns {array} [storedValue, setValue] - Similar to useState
 */
export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // If key doesn't exist, use default
      if (item === null) {
        return defaultValue;
      }

      // Try to parse JSON
      try {
        return JSON.parse(item);
      } catch (e) {
        // If JSON parsing fails, it's corrupted data
        console.warn(`Corrupted localStorage data for key "${key}", using default value`);
        window.localStorage.removeItem(key);
        return defaultValue;
      }
    } catch (error) {
      // Handle storage access errors (e.g., in private browsing mode)
      console.warn(`Unable to access localStorage for key "${key}":`, error.message);
      return defaultValue;
    }
  });

  // Update localStorage when storedValue changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Unable to set localStorage for key "${key}":`, error.message);
    }
  };

  return [storedValue, setValue];
}
