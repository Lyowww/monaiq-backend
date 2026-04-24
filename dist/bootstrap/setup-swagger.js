"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app, options) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AI Finance Coach API')
        .setDescription('Production-grade fintech backend for authentication, dashboard analytics, transactions, OCR, and AI finance coaching.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Use an access token for protected routes.'
    }, 'bearer')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
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
//# sourceMappingURL=setup-swagger.js.map