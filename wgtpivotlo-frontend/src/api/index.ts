// import { toast } from 'react-toastify'

// export const interceptor = () => {
//   window.fetch = async (
//     ...args: [input: RequestInfo | URL, init?: RequestInit | undefined]
//   ) => {
//     const [resource, config] = args
//     try {
//       const response = await window.fetch(resource, config) // Use `window.fetch` directly
//       // Handle unauthorized or forbidden responses
//       if (response.status === 401 || response.status === 403) {
//         toast.error('You are not authorized')
//       }
//       return response
//     } catch (err) {
//       console.error('Network error:', err)
//       throw err
//     }
//   }
// }
