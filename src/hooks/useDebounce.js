import { useEffect, useState } from "react";

// Renvoie `value` avec un délai, pour éviter de déclencher une action
// (requête API, navigation...) à chaque frappe clavier.
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
