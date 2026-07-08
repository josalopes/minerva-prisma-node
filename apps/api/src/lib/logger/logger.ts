import pino from "pino"

const isProduction =
  process.env.NODE_ENV === "production"

export const logger =
  pino({
    level:
      isProduction
        ? "info"
        : "trace",

    transport:
      isProduction
        ? undefined
        : {
            target:
              "pino-pretty",
            options: {
              colorize: true,
              translateTime:
                "HH:MM:ss",
              ignore:
                "pid,hostname",
            },
          },

    redact: {
      paths: [
        "password",
        "passwordHash",
    
        "accessToken",
        "refreshToken",
    
        "authorization",
        "headers.authorization",
    
        "cookie",
        "headers.cookie",
    
        "jwt",
        "token",
    
        "stripeSecret",
        "stripeWebhookSecret",
    
        "resendApiKey",
    
        "*.password",
        "*.passwordHash",
        "*.token",
        "*.authorization",
      ],
    
      censor: "***",
    },    
  })