import { QueryMeta } from '@tanstack/react-query'

export interface Response {
  message?: string
}

export interface ErrorResponse extends Response {
  timestamp: Date
  status: string
}

export interface PageRequest {
  pageNumber: number
  pageSize: number
}

export interface QueryKeyInterface {
  queryKey: string[]
  signal: AbortSignal
  meta: QueryMeta | undefined
  pageParam?: unknown
  direction?: unknown
}
