import { FastifyInstance } from 'fastify'

export async function healthCheck(app: FastifyInstance) {
  app.get('/health', async () => {
    return {
      status: 'ok',
    }
  })
}
