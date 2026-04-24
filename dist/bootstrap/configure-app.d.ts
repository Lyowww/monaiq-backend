import { type INestApplication } from '@nestjs/common';
interface ConfigureAppOptions {
    useGlobalPrefix?: boolean;
}
export declare function configureApp(app: INestApplication, options?: ConfigureAppOptions): Promise<void>;
export {};
