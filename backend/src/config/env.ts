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

export const env = Object.freeze({
  PORT: readRequiredNumber("PORT"),
  MONGODB_URI: readRequiredString("MONGODB_URI"),
  REDIS_HOST: readRequiredString("REDIS_HOST"),
  REDIS_PORT: readRequiredNumber("REDIS_PORT"),
  GEMINI_API_KEY: readOptionalString("GEMINI_API_KEY"),
});

export type Env = typeof env;
