import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import type { Request, Response } from 'express';

type MongoLikeError = Error & {
  code?: number;
  keyValue?: Record<string, unknown>;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { statusCode, message, errorCode } = this.mapException(exception);

    response.status(statusCode).json({
      statusCode,
      errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }

  private mapException(exception: unknown): {
    statusCode: number;
    message: string;
    errorCode: string;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusCode = exception.getStatus();
      const message =
        typeof response === 'string'
          ? response
          : Array.isArray((response as { message?: unknown }).message)
            ? ((response as { message?: string[] }).message ?? []).join(', ')
            : ((response as { message?: string }).message ?? exception.message);

      return {
        statusCode,
        message,
        errorCode: exception.name
      };
    }

    const mongoError = exception as MongoLikeError;
    if (mongoError?.code === 11000) {
      const duplicatedField = Object.keys(mongoError.keyValue ?? {})[0] ?? 'field';

      return {
        statusCode: HttpStatus.CONFLICT,
        message: `Duplicate value for ${duplicatedField}`,
        errorCode: 'DuplicateKeyError'
      };
    }

    const defaultMessage =
      exception instanceof Error ? exception.message : 'Unexpected server error';

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: defaultMessage,
      errorCode: 'InternalServerError'
    };
  }
}
