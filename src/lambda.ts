import type { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from './app.module';
import { configureApp } from './bootstrap/configure-app';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await configureApp(app, { useGlobalPrefix: true });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

/**
 * AWS Lambda (API Gateway) entry. In the Lambda console or template, set the handler to the
 * compiled file, for example: `dist/lambda.handler` (path depends on your zip layout).
 * Do not point the handler at `main` — that file starts `listen()` and has no export.
 */
export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
