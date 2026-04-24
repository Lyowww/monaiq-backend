"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let HttpRequestLoggingInterceptor = class HttpRequestLoggingInterceptor {
    logger = new common_1.Logger('HTTP');
    intercept(context, next) {
        if (context.getType() !== 'http') {
            return next.handle();
        }
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const method = req.method;
        const path = (req.originalUrl ?? req.url).split('?')[0] ?? req.url;
        const started = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                res.on('finish', () => {
                    const durationMs = Date.now() - started;
                    this.logger.log(`${method} ${path} ${res.statusCode} ${durationMs}ms`);
                });
            },
            error: (err) => {
                const durationMs = Date.now() - started;
                const status = err instanceof common_1.HttpException
                    ? err.getStatus()
                    : err && typeof err === 'object' && 'status' in err && typeof err.status === 'number'
                        ? err.status
                        : 500;
                this.logger.log(`${method} ${path} ${status} ${durationMs}ms`);
            }
        }));
    }
};
exports.HttpRequestLoggingInterceptor = HttpRequestLoggingInterceptor;
exports.HttpRequestLoggingInterceptor = HttpRequestLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpRequestLoggingInterceptor);
//# sourceMappingURL=http-request-logging.interceptor.js.map