import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_APP_URL ?? ''],
    credentials: true,
  });
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
