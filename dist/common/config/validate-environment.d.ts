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
export declare function validateEnvironment(config: Record<string, unknown>): EnvironmentShape;
export {};
