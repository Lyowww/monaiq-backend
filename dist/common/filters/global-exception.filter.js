"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const { statusCode, message, errorCode } = this.mapException(exception);
        response.status(statusCode).json({
            statusCode,
            errorCode,
            message,
            path: request.url,
            timestamp: new Date().toISOString()
        });
    }
    mapException(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            const statusCode = exception.getStatus();
            const message = typeof response === 'string'
                ? response
                : Array.isArray(response.message)
                    ? (response.message ?? []).join(', ')
                    : (response.message ?? exception.message);
            return {
                statusCode,
                message,
                errorCode: exception.name
            };
        }
        const mongoError = exception;
        if (mongoError?.code === 11000) {
            const duplicatedField = Object.keys(mongoError.keyValue ?? {})[0] ?? 'field';
            return {
                statusCode: common_1.HttpStatus.CONFLICT,
                message: `Duplicate value for ${duplicatedField}`,
                errorCode: 'DuplicateKeyError'
            };
        }
        const defaultMessage = exception instanceof Error ? exception.message : 'Unexpected server error';
        return {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: defaultMessage,
            errorCode: 'InternalServerError'
        };
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map