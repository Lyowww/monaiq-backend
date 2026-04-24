import type { Handler } from 'aws-lambda';
/**
 * AWS Lambda (API Gateway) entry. In the Lambda console or template, set the handler to the
 * compiled file, for example: `dist/lambda.handler` (path depends on your zip layout).
 * Do not point the handler at `main` — that file starts `listen()` and has no export.
 */
export declare const handler: Handler;
