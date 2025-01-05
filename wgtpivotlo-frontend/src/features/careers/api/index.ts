import { ErrorResponse } from '@/types'
import { backendURL } from '@/utils'
import { CareerWithSkills } from '../types'

export const getCareer = async (careerId: number) => {
  try {
    const url =
      backendURL + `/api/v1/career-skill-association/career/${careerId}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorBody = (await response.json()) as ErrorResponse // Parse the error response
      const errorMessage: string = errorBody.message || 'Something went wrong' // Extract the error message
      throw new Error(errorMessage) // Throw a new Error with the message
    }

    const json = (await response.json()) as CareerWithSkills // Ensure proper return type
    return json
  } catch (error) {
    console.log(error)
  }
}
