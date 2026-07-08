import { Logger } from "pino"

export function startTimer(logger: Logger) {
  const started = performance.now()

  return {
    done(message: string, data?: object) {
      logger.info(
        {
          duration: `${Math.round(performance.now() - started)}ms`,
          ...data,
        },
        message
      )
    },
  }
}