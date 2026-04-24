import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './bootstrap/configure-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  await configureApp(app, { useGlobalPrefix: true });
  const port = Number(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}

void bootstrap();
