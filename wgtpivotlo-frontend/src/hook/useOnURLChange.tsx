import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseURLChangeInterface {
  fn: () => void; // Callback function to execute on URL change
}

export const useOnURLChange = ({ fn }: UseURLChangeInterface) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof fn === 'function') {
      fn(); // Execute the callback function when the URL changes
    }
  }, [location, fn]); // Include fn to handle dynamic changes in the callback
};
