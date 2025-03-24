import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); // for setting global prefix
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  ); // for setting global validation
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
