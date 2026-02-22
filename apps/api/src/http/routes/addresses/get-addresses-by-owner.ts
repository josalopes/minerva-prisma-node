import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { getAddressesByOwner } from '../../../services/addresses/get-addresses-by-owner'

export async function getAddressesByOwnerRoute(app: FastifyInstance) {
  app.get('/addresses/owner', async (request) => {
    const querySchema = z.object({
      ownerType: z.string(),
      ownerId: z.string(),
    })

    const { ownerType, ownerId } = querySchema.parse(request.query)

    const addresses = await getAddressesByOwner(ownerType, ownerId)

    return addresses
  })
}