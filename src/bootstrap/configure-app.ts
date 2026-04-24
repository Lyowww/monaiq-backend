import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { HttpRequestLoggingInterceptor } from '../common/interceptors/http-request-logging.interceptor';
import { setupSwagger } from './setup-swagger';

interface ConfigureAppOptions {
  useGlobalPrefix?: boolean;
}

type ExpressLikeInstance = {
  disable?: (setting: string) => void;
  set?: (setting: string, value: unknown) => void;
};

export async function configureApp(
  app: INestApplication,
  options: ConfigureAppOptions = {}
): Promise<void> {
  const useGlobalPrefix = options.useGlobalPrefix ?? true;
  const httpAdapter = app.getHttpAdapter();

  if (httpAdapter.getType() === 'express') {
    const adapterInstance = httpAdapter.getInstance() as ExpressLikeInstance;
    adapterInstance.disable?.('x-powered-by');
    adapterInstance.set?.('trust proxy', 1);
  }

  if (useGlobalPrefix) {
    app.setGlobalPrefix('api');
  }

  app.enableCors({
    origin: true,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new HttpRequestLoggingInterceptor());

  setupSwagger(app, { useGlobalPrefix });
}
