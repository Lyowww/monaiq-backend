import type { MongooseModuleOptions } from '@nestjs/mongoose';

const isVercelRuntime = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV
);

const isServerlessish =
  isVercelRuntime ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.K_SERVICE);

/**
 * Options tuned for short-lived / bursty runtimes (Vercel, Lambda, Cloud Run).
 *
 * **Atlas on Vercel (and most serverless):** In MongoDB Atlas → Network Access, you must allow
 * connections from the deployment platform. Vercel uses **variable outbound IPs**; add entry
 * `0.0.0.0/0` (or temporary “add current IP” while testing). Without this, the driver may fail
 * during TLS with `tlsv1 alert internal error` or `ServerSelectionError`, not a clear “blocked IP”
 * message. Ensure `MONGODB_URI` uses a user with password **URL-encoded** if it contains special
 * characters (`@`, `:` `#`, etc.).
 */
export function getMongooseModuleOptions(
  uri: string
): Pick<MongooseModuleOptions, keyof MongooseModuleOptions> {
  if (!isServerlessish) {
    return { uri };
  }

  return {
    uri,
    minPoolSize: 0,
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 30_000,
    socketTimeoutMS: 45_000,
    connectTimeoutMS: 20_000,
    maxIdleTimeMS: 30_000,
    retryWrites: true
  };
}
