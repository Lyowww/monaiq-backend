import type { Request, Response } from 'express';
import express, { type Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './bootstrap/configure-app';

const isVercelRuntime = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV
);

let vercelExpressSingleton: Express | null = null;
let vercelExpressBoot: Promise<Express> | null = null;

/**
 * Vercel may freeze the invocation when the handler promise resolves before Express sends the
 * response. Wait for `finish` / `close` so the client receives the body reliably.
 */
function runExpressUntilResponseEnds(
  server: Express,
  request: Request,
  response: Response
): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = (): void => {
      response.removeListener('finish', onFinish);
      response.removeListener('close', onClose);
      response.removeListener('error', onError);
    };
    const settleOk = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve();
    };
    const onFinish = (): void => settleOk();
    const onClose = (): void => {
      if (!response.writableFinished) {
        settleOk();
      }
    };
    const onError = (err: Error): void => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(err);
    };
    response.once('finish', onFinish);
    response.once('close', onClose);
    response.once('error', onError);
    try {
      server(request, response);
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

async function createVercelExpressApp(): Promise<Express> {
  const expressApp = express();
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
  return expressApp;
}

async function getVercelExpressApp(): Promise<Express> {
  if (vercelExpressSingleton) {
    return vercelExpressSingleton;
  }
  if (!vercelExpressBoot) {
    vercelExpressBoot = createVercelExpressApp()
      .then((ex) => {
        vercelExpressSingleton = ex;
        return ex;
      })
      .catch((err) => {
        vercelExpressBoot = null;
        vercelExpressSingleton = null;
        throw err;
      });
  }
  return vercelExpressBoot;
}

/**
 * Vercel serverless entry (see `api/index.js`). Must keep the invocation alive until the response
 * is fully written.
 */
export default async function vercelHandler(
  request: Request,
  response: Response
): Promise<void> {
  const server = await getVercelExpressApp();
  await runExpressUntilResponseEnds(server, request, response);
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
