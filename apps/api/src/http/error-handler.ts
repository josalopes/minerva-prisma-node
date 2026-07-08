import type { FastifyInstance } from "fastify"
import { ZodError } from "zod"

import { logger } from "@/lib/logger"

import { BadRequestError } from "./routes/-errors/bad-request-error"
import { UnauthorizedError } from "./routes/-errors/unauthorized-error"

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (
  error,
  request,
  reply,
) => {

  if (error instanceof ZodError) {

    logger.warn(
      {
        method: request.method,
        url: request.url,
        errors: error.flatten().fieldErrors,
      },
      "Validation failed",
    )

    return reply.status(400).send({
      message: "Erro de validação",
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {

    logger.warn(
      {
        method: request.method,
        url: request.url,
        message: error.message,
      },
      "Bad request",
    )

    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {

    logger.warn(
      {
        method: request.method,
        url: request.url,
        message: error.message,
      },
      "Unauthorized request",
    )

    return reply.status(401).send({
      message: error.message,
    })
  }

  logger.error(
    {
      err: error,
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      body: request.body,
    },
    "Unhandled error",
  )

  return reply.status(500).send({
    message: "Internal server error",
  })
}
