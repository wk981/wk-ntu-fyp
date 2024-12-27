import { Skills } from '@/features/questionaire/types'
import { ErrorResponse } from '@/types'
import { backendURL } from '@/utils'

export const getSkill = async (q: string) => {
  const url = backendURL + `/api/v1/questionaire/search?q=${q}`
  const response = await fetch(url)

  if (!response.ok) {
    const errorBody = (await response.json()) as ErrorResponse // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong' // Extract the error message
    throw new Error(errorMessage) // Throw a new Error with the message
  }
  const json = response.json() as Promise<Skills[]>
  return json
}
