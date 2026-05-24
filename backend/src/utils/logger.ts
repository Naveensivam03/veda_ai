/* Provides lightweight structured logging helpers. */

type LogMeta = Record<string, string | number | boolean | null | undefined>;

function formatMessage(level: string, message: string, meta?: LogMeta): string {
  const timestamp = new Date().toISOString();
  const serializedMeta = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] ${level.toUpperCase()} ${message}${serializedMeta}`;
}

function serializeError(error: unknown): LogMeta {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: String(error),
  };
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    console.log(formatMessage("info", message, meta));
  },
  warn(message: string, meta?: LogMeta): void {
    console.warn(formatMessage("warn", message, meta));
  },
  error(message: string, error?: unknown, meta?: LogMeta): void {
    const errorMeta = error === undefined ? undefined : serializeError(error);
    const mergedMeta = {
      ...meta,
      ...errorMeta,
    };

    console.error(formatMessage("error", message, mergedMeta));
  },
};
