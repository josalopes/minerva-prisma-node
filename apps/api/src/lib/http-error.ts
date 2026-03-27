// lib/http-error.ts

type ApiError = {
  success: false
  error: {
    message: string
    code?: string
  }
}

export function apiError(message: string, code?: string): ApiError {
  return {
    success: false,
    error: {
      message,
      code
    }
  }
}