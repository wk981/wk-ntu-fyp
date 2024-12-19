import { backendURL } from '@/utils'
import { User } from '../types'
import { ErrorResponse, Response } from '@/types'

export interface loginBody {
  username: string
  password: string
}

export interface registerBody extends loginBody {
  email: string
}

export const loginPost = async (data: loginBody) => {
  const url = backendURL + '/login'
  const body = {
    username: data.username,
    password: data.password,
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
  const json = response.json() as Promise<Response>
  return json
}

export const registerPost = async (data: registerBody) => {
  try {
    const url = backendURL + '/register'
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      const errorBody: ErrorResponse = (await response.json()) as ErrorResponse // Parse the error response
      const errorMessage: string = errorBody.message || 'Something went wrong' // Extract the error message
      throw new Error(errorMessage) // Throw a new Error with the message
    }
    const json = response.json() as Promise<Response>
    return json
  } catch (e) {
    console.log(e)
  }
}

export const meGet = async () => {
  const url = backendURL + '/me'
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong' // Extract the error message
    throw new Error(errorMessage) // Throw a new Error with the message
  }
  const json = response.json() as Promise<User>
  return json
}
