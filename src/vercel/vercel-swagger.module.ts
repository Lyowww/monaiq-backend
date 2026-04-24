import { Module } from '@nestjs/common';
import { VercelSwaggerHtmlController } from './vercel-swagger-html.controller';

@Module({
  controllers: [VercelSwaggerHtmlController]
})
export class VercelSwaggerModule {}
