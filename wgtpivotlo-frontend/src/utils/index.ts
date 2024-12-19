import { ReactNode } from 'react'

export function capitalizeFirstChar(str: string) {
  if (!str) return '' // Handle empty string or null/undefined
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const backendURL: string = import.meta.env.VITE_BACKEND_URL as string

export interface ProviderProps {
  children: ReactNode
}
