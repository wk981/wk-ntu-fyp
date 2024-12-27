import { ErrorResponse, PageRequest } from '@/types'
import { backendURL } from '@/utils'
import { CareerRecommendationResponse } from '../types'

interface ResultBody extends PageRequest {
  sector: string
  careerLevel: string
  careerSkillDTOList: {
    skillId: number
    profiency: string
  }
}

export const getAllSectors = async () => {
  const url = backendURL + '/api/v1/questionaire/sectors'
  const response = await fetch(url, {
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
  const json = response.json() as Promise<string[]>
  return json
}

export const resultPost = async (data: ResultBody) => {
  const url = backendURL + '/api/v1/questionaire/result'
  const body = {
    ...data,
    pageNumber: 1,
    pageSize: 5,
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
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
  const json = response.json() as Promise<CareerRecommendationResponse>
  return json
}
