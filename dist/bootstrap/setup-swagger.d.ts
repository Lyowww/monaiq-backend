import type { INestApplication } from '@nestjs/common';
interface SwaggerSetupOptions {
    useGlobalPrefix: boolean;
}
export declare function setupSwagger(app: INestApplication, options: SwaggerSetupOptions): void;
export {};
