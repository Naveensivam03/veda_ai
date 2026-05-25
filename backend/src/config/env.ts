/* Loads and validates environment configuration. */

import dotenv from "dotenv";

dotenv.config();

function readRequiredString(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readRequiredNumber(name: string): number {
  const value = readRequiredString(name);
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsed;
}

function readOptionalString(name: string): string | null {
  const value = process.env[name]?.trim();

  return value ? value : null;
}

const redisUrl = readOptionalString("REDIS_URL");
const redisHost = readOptionalString("REDIS_HOST");
const redisPortString = readOptionalString("REDIS_PORT");

if (!redisUrl && (!redisHost || !redisPortString)) {
  throw new Error("Either REDIS_URL or both REDIS_HOST and REDIS_PORT must be provided");
}

const redisPort = redisPortString ? Number.parseInt(redisPortString, 10) : undefined;
if (redisPortString && (!redisPort || !Number.isFinite(redisPort))) {
  throw new Error("REDIS_PORT must be a valid number");
}

export const env = Object.freeze({
  PORT: readRequiredNumber("PORT"),
  MONGODB_URI: readRequiredString("MONGODB_URI"),
  REDIS_URL: redisUrl,
  REDIS_HOST: redisHost,
  REDIS_PORT: redisPort,
  GEMINI_API_KEY: readOptionalString("GEMINI_API_KEY"),
  ADMIN_USERNAME: readOptionalString("ADMIN_USERNAME") || "admin",
  ADMIN_PASSWORD: readOptionalString("ADMIN_PASSWORD") || "vedaai-admin-secret",
});

export type Env = typeof env;
