"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = configureApp;
const common_1 = require("@nestjs/common");
const global_exception_filter_1 = require("../common/filters/global-exception.filter");
const http_request_logging_interceptor_1 = require("../common/interceptors/http-request-logging.interceptor");
const setup_swagger_1 = require("./setup-swagger");
async function configureApp(app, options = {}) {
    const useGlobalPrefix = options.useGlobalPrefix ?? true;
    const httpAdapter = app.getHttpAdapter();
    if (httpAdapter.getType() === 'express') {
        const adapterInstance = httpAdapter.getInstance();
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new http_request_logging_interceptor_1.HttpRequestLoggingInterceptor());
    (0, setup_swagger_1.setupSwagger)(app, { useGlobalPrefix });
}
//# sourceMappingURL=configure-app.js.map