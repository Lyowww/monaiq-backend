import type { Request, Response } from 'express';
import express, { type Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './bootstrap/configure-app';

const isVercelRuntime = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV
);

/** Cached Nest-backed Express app for Vercel (same pattern as `api/[...route].ts` in the monorepo). */
let vercelExpressApp: Express | null = null;

async function getVercelExpressApp(): Promise<Express> {
  if (vercelExpressApp) {
    return vercelExpressApp;
  }
  const expressApp = express();
  /** Rewrites send every path to `/api`; restore the real path for Nest routing. */
  expressApp.use((req, _res, next) => {
    if (req.originalUrl && req.url !== req.originalUrl) {
      req.url = req.originalUrl;
    }
    next();
  });
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { bufferLogs: true }
  );
  await configureApp(app, { useGlobalPrefix: true });
  await app.init();
  vercelExpressApp = expressApp;
  return expressApp;
}

/**
 * Vercel may treat `src/main` as the serverless entry; a default export is required
 * (see "No exports found in module" / "Did you forget to export a function or a server?").
 */
export default async function vercelHandler(
  request: Request,
  response: Response
): Promise<void> {
  const server = await getVercelExpressApp();
  server(request, response);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  await configureApp(app, { useGlobalPrefix: true });
  const port = Number(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}

if (!isVercelRuntime) {
  void bootstrap();
}
