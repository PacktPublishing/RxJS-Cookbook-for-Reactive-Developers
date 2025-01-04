import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BulkheadInterceptor } from './interceptors/bulkhead/bulkhead.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new BulkheadInterceptor());
  await app.listen(4000);
}
bootstrap();
