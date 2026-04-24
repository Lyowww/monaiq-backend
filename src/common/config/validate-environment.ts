type EnvironmentShape = {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_TTL_MINUTES: number;
  JWT_REFRESH_TTL_DAYS: number;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  OPENROUTER_API_KEY?: string;
  /** Overrides the first OpenRouter fallback (default primary: google/gemma-3-12b-it:free) */
  OPENROUTER_MODEL?: string;
  CRON_SECRET?: string;
  /** Comma-separated emails treated as admin (in addition to user.isAdmin) */
  ADMIN_EMAILS?: string;
  /** Optional: bootstrap admin login without pre-seeding the user document */
  ADMIN_LOGIN_EMAIL?: string;
  ADMIN_LOGIN_PASSWORD?: string;
  /** JSON string of a Firebase service account (private_key, client_email, project_id) for FCM */
  FIREBASE_SERVICE_ACCOUNT_JSON?: string;
  /** Base URL for the Go translation sidecar (`POST /translate`). Default: http://127.0.0.1:8000 */
  TRANSLATION_SERVICE_URL?: string;
};

function requireString(value: unknown, key: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
}

function requireNumber(value: unknown, key: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  return parsed;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentShape {
  return {
    NODE_ENV: typeof config.NODE_ENV === 'string' ? config.NODE_ENV : 'development',
    PORT: requireNumber(config.PORT ?? 3000, 'PORT'),
    MONGODB_URI: requireString(config.MONGODB_URI, 'MONGODB_URI'),
    JWT_ACCESS_SECRET: requireString(config.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: requireString(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'),
    JWT_ACCESS_TTL_MINUTES: requireNumber(
      config.JWT_ACCESS_TTL_MINUTES ?? 15,
      'JWT_ACCESS_TTL_MINUTES'
    ),
    JWT_REFRESH_TTL_DAYS: requireNumber(
      config.JWT_REFRESH_TTL_DAYS ?? 30,
      'JWT_REFRESH_TTL_DAYS'
    ),
    GEMINI_API_KEY:
      typeof config.GEMINI_API_KEY === 'string' ? config.GEMINI_API_KEY : undefined,
    GEMINI_MODEL: typeof config.GEMINI_MODEL === 'string' ? config.GEMINI_MODEL : undefined,
    OPENROUTER_API_KEY:
      typeof config.OPENROUTER_API_KEY === 'string' ? config.OPENROUTER_API_KEY : undefined,
    OPENROUTER_MODEL:
      typeof config.OPENROUTER_MODEL === 'string' ? config.OPENROUTER_MODEL : undefined,
    CRON_SECRET: typeof config.CRON_SECRET === 'string' ? config.CRON_SECRET : undefined,
    ADMIN_EMAILS: typeof config.ADMIN_EMAILS === 'string' ? config.ADMIN_EMAILS : undefined,
    ADMIN_LOGIN_EMAIL:
      typeof config.ADMIN_LOGIN_EMAIL === 'string' ? config.ADMIN_LOGIN_EMAIL : undefined,
    ADMIN_LOGIN_PASSWORD:
      typeof config.ADMIN_LOGIN_PASSWORD === 'string' ? config.ADMIN_LOGIN_PASSWORD : undefined,
    FIREBASE_SERVICE_ACCOUNT_JSON:
      typeof config.FIREBASE_SERVICE_ACCOUNT_JSON === 'string'
        ? config.FIREBASE_SERVICE_ACCOUNT_JSON
        : undefined,
    TRANSLATION_SERVICE_URL:
      typeof config.TRANSLATION_SERVICE_URL === 'string'
        ? config.TRANSLATION_SERVICE_URL.trim()
        : undefined
  };
}
