import { z } from 'zod'

const apiEnvSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  MAIL_FROM: z.string(),
  CORS_ORIGINS: z.string(),
  APP_URL: z.url(),
})

export const env = apiEnvSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  APP_URL: process.env.APP_URL,
})
