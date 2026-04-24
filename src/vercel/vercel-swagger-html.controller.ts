import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';

/** Keep in sync with `swagger-ui-dist` from `@nestjs/swagger` (lockfile). */
const SWAGGER_UI_CDN_BASE =
  'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.4';

function buildSwaggerUiHtml(specUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI Finance Coach API Docs</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN_BASE}/swagger-ui.css" />
  <style>html{box-sizing:border-box;overflow-y:scroll}*,*:before,*:after{box-sizing:inherit}body{margin:0;background:#fafafa}</style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="${SWAGGER_UI_CDN_BASE}/swagger-ui-bundle.js"></script>
<script src="${SWAGGER_UI_CDN_BASE}/swagger-ui-standalone-preset.js"></script>
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
    layout: 'StandaloneLayout'
  });
};
</script>
</body>
</html>`;
}

/**
 * On Vercel, `@nestjs/swagger` static UI assets do not work (platform ignores Express static).
 * This controller serves a CDN-backed Swagger UI; OpenAPI JSON stays on Nest routes.
 */
@Controller('docs')
export class VercelSwaggerHtmlController {
  @Get()
  @Header('Cache-Control', 'public, max-age=0, must-revalidate')
  index(@Res() res: Response): void {
    res.type('text/html').send(buildSwaggerUiHtml('/api/docs/json'));
  }
}
