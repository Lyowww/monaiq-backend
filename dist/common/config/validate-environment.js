"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = validateEnvironment;
function requireString(value, key) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value.trim();
}
function requireNumber(value, key) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Environment variable ${key} must be a number`);
    }
    return parsed;
}
function validateEnvironment(config) {
    return {
        NODE_ENV: typeof config.NODE_ENV === 'string' ? config.NODE_ENV : 'development',
        PORT: requireNumber(config.PORT ?? 3000, 'PORT'),
        MONGODB_URI: requireString(config.MONGODB_URI, 'MONGODB_URI'),
        JWT_ACCESS_SECRET: requireString(config.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'),
        JWT_REFRESH_SECRET: requireString(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'),
        JWT_ACCESS_TTL_MINUTES: requireNumber(config.JWT_ACCESS_TTL_MINUTES ?? 15, 'JWT_ACCESS_TTL_MINUTES'),
        JWT_REFRESH_TTL_DAYS: requireNumber(config.JWT_REFRESH_TTL_DAYS ?? 30, 'JWT_REFRESH_TTL_DAYS'),
        GEMINI_API_KEY: typeof config.GEMINI_API_KEY === 'string' ? config.GEMINI_API_KEY : undefined,
        GEMINI_MODEL: typeof config.GEMINI_MODEL === 'string' ? config.GEMINI_MODEL : undefined,
        OPENROUTER_API_KEY: typeof config.OPENROUTER_API_KEY === 'string' ? config.OPENROUTER_API_KEY : undefined,
        OPENROUTER_MODEL: typeof config.OPENROUTER_MODEL === 'string' ? config.OPENROUTER_MODEL : undefined,
        CRON_SECRET: typeof config.CRON_SECRET === 'string' ? config.CRON_SECRET : undefined,
        ADMIN_EMAILS: typeof config.ADMIN_EMAILS === 'string' ? config.ADMIN_EMAILS : undefined,
        ADMIN_LOGIN_EMAIL: typeof config.ADMIN_LOGIN_EMAIL === 'string' ? config.ADMIN_LOGIN_EMAIL : undefined,
        ADMIN_LOGIN_PASSWORD: typeof config.ADMIN_LOGIN_PASSWORD === 'string' ? config.ADMIN_LOGIN_PASSWORD : undefined,
        FIREBASE_SERVICE_ACCOUNT_JSON: typeof config.FIREBASE_SERVICE_ACCOUNT_JSON === 'string'
            ? config.FIREBASE_SERVICE_ACCOUNT_JSON
            : undefined,
        TRANSLATION_SERVICE_URL: typeof config.TRANSLATION_SERVICE_URL === 'string'
            ? config.TRANSLATION_SERVICE_URL.trim()
            : undefined
    };
}
//# sourceMappingURL=validate-environment.js.map