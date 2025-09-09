import { logger } from "./logger";

export function withLogging(fn, { op } = {}) {
  return async function wrapped(...args) {
    logger.info("op:start", { op, args });
    try {
      const result = await fn(...args);
      logger.info("op:success", { op, result });
      return result;
    } catch (err) {
      logger.error("op:error", { op, error: String(err?.message || err) });
      throw err;
    } finally {
      logger.info("op:end", { op });
    }
  };
}
