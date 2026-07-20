import { HTTPError } from 'ky'
import { ApiError } from './api-error'

export async function parseHttpError(error: HTTPError): Promise<ApiError> {
  const response = error.response

  const contentType = response.headers.get('content-type') ?? ''

  // JSON
  if (contentType.includes('application/json')) {
    const body = await response.json<any>()

    return new ApiError(
      body.code ?? 'API_ERROR',
      body.message ?? 'Erro ao processar a solicitação.',
      response.status,
    )
  }

  // HTML
  if (contentType.includes('text/html')) {
    const html = await response.text()

    if (html.includes('This service has been suspended')) {
      return new ApiError(
        'SERVICE_SUSPENDED',
        'Não foi possível conectar ao servidor. O serviço pode estar temporariamente indisponível. Tente novamente em alguns instantes.',
        response.status,
      )
    }

    return new ApiError(
      'INVALID_HTML_RESPONSE',
      'O servidor retornou uma resposta inesperada.',
      response.status,
    )
  }

  // Texto puro

  const text = await response.text()

  return new ApiError(
    'UNKNOWN_HTTP_ERROR',
    text || 'Erro inesperado.',
    response.status,
  )
}
