import { logger } from "./logger"

export function createLogger(
  module: string,
) {
    return logger.child({
      module,
    })
}