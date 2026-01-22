import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SnakeCaseInterceptor } from './common/interceptors/snake-case.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) 글로벌 prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // A) Swagger (OpenAPI) - /api/v1/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Seoul Festival API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: { persistAuthorization: true },
  });

  // 2) CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
    credentials: false,
  });

  // 3) 전역 ValidationPipe (class-validator 기반)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 4) 전역 ExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5) 모든 JSON 응답 snake_case
  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  await app.listen(3000);
}
bootstrap();
