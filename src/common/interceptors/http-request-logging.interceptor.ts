import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  type NestInterceptor
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type Observable } from 'rxjs';
import { tap } from 'rxjs';

@Injectable()
export class HttpRequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const method = req.method;
    const path = (req.originalUrl ?? req.url).split('?')[0] ?? req.url;
    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          res.on('finish', () => {
            const durationMs = Date.now() - started;
            this.logger.log(`${method} ${path} ${res.statusCode} ${durationMs}ms`);
          });
        },
        error: (err: unknown) => {
          const durationMs = Date.now() - started;
          const status =
            err instanceof HttpException
              ? err.getStatus()
              : err && typeof err === 'object' && 'status' in err && typeof (err as { status: number }).status === 'number'
                ? (err as { status: number }).status
                : 500;
          this.logger.log(`${method} ${path} ${status} ${durationMs}ms`);
        }
      })
    );
  }
}
