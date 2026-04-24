import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface SwaggerSetupOptions {
  useGlobalPrefix: boolean;
}

export function setupSwagger(
  app: INestApplication,
  options: SwaggerSetupOptions
): void {
  const config = new DocumentBuilder()
    .setTitle('AI Finance Coach API')
    .setDescription(
      'Production-grade fintech backend for authentication, dashboard analytics, transactions, OCR, and AI finance coaching.'
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Use an access token for protected routes.'
      },
      'bearer'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: options.useGlobalPrefix,
    jsonDocumentUrl: 'docs/json',
    yamlDocumentUrl: 'docs/yaml',
    customSiteTitle: 'AI Finance Coach API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list'
    }
  });
}
