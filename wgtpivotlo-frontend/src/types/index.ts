export interface Response {
  message?: string
}

export interface ErrorResponse extends Response {
  timestamp: Date
  status: string
}
