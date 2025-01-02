// import { interceptor } from '@/api'
import { AuthProvider } from '@/contexts/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // const interceptorRef = useRef(false)

  // useEffect(() => {
  //   if (!interceptorRef.current) {
  //     interceptor() // Call your interceptor function
  //     interceptorRef.current = true // Mark as initialized
  //   }
  // }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <ToastContainer />
      </AuthProvider>
    </QueryClientProvider>
  )
}
