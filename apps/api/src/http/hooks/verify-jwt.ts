import { FastifyRequest } from "fastify"

export const verifyJwt = async (
    request: FastifyRequest,
  ) => {
    await request.jwtVerify()
  }