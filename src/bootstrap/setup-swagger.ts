import type { INestApplication } from '@nestjs/common';
import type { Express } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface SwaggerSetupOptions {
  useGlobalPrefix: boolean;
}

const isVercelRuntime = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV
);

/** Matches `swagger-ui-dist` used by `@nestjs/swagger` in this repo (CDN bundles). */
const SWAGGER_UI_CDN_BASE =
  'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.4';

function vercelSwaggerUiHtml(specUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI Finance Coach API Docs</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN_BASE}/swagger-ui.css" />
  <style>html { box-sizing: border-box; overflow-y: scroll; } *, *:before, *:after { box-sizing: inherit; } body { margin:0; background: #fafafa; }</style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="${SWAGGER_UI_CDN_BASE}/swagger-ui-bundle.js" crossorigin></script>
<script src="${SWAGGER_UI_CDN_BASE}/swagger-ui-standalone-preset.js" crossorigin></script>
<script>
window.onload = function () {
  window.ui = SwaggerUIBundle({
    url: ${JSON.stringify(specUrl)},
    dom_id: '#swagger-ui',
    deepLinking: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    persistAuthorization: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'StandaloneLayout',
  });
};
</script>
</body>
</html>`;
}

function mountVercelSwaggerUi(app: INestApplication, specPath: string): void {
  const httpAdapter = app.getHttpAdapter();
  if (httpAdapter.getType() !== 'express') {
    return;
  }
  const expressApp = httpAdapter.getInstance() as Express;
  const html = vercelSwaggerUiHtml(specPath);
  expressApp.get(['/api/docs', '/api/docs/'], (_req, res) => {
    res.type('text/html').send(html);
  });
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

  if (isVercelRuntime) {
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: options.useGlobalPrefix,
      ui: false,
      raw: true,
      jsonDocumentUrl: 'docs/json',
      yamlDocumentUrl: 'docs/yaml'
    });
    mountVercelSwaggerUi(app, '/api/docs/json');
    return;
  }

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
