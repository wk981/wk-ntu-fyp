import { ReactNode } from 'react';

export function capitalizeFirstChar(str: string) {
  if (!str) return ''; // Handle empty string or null/undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeEveryFirstChar(str: string): string {
  const strArray = str.split(' ');
  let res = '';
  for (let i = 0; i < strArray.length; i++) {
    // Corrected loop condition
    if (strArray[i]) {
      // Check for empty strings (e.g., multiple spaces)
      res += strArray[i][0].toUpperCase() + strArray[i].slice(1).toLowerCase();
    }
    if (i < strArray.length - 1) {
      res += ' '; // Add a space between words except for the last word
    }
  }
  return res;
}

export const areSetsEqual = <T>(setA: Set<T>, setB: Set<T>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};

export const backendURL: string = import.meta.env.VITE_BACKEND_URL as string;

export interface ProviderProps {
  children: ReactNode;
}
