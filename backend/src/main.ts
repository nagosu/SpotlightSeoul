import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SnakeCaseInterceptor } from './common/interceptors/snake-case.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { FieldError } from './common/dto/error-response';

/**
 * class-validator ValidationError 배열을 FieldError 배열로 변환
 */
function flattenValidationErrors(errors: ValidationError[]): FieldError[] {
  const result: FieldError[] = [];

  for (const err of errors) {
    // 현재 필드의 constraints
    if (err.constraints) {
      for (const reason of Object.values(err.constraints)) {
        result.push({ field: err.property, reason });
      }
    }
    // 중첩 객체의 오류 재귀 처리
    if (err.children && err.children.length > 0) {
      const nested = flattenValidationErrors(err.children);
      for (const ne of nested) {
        result.push({ field: `${err.property}.${ne.field}`, reason: ne.reason });
      }
    }
  }

  return result;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) 글로벌 prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // A) Swagger (OpenAPI) - /api/v1/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Seoul Festival API')
    .setDescription(
      '서울 축제 정보 API\n\n' +
        '## 공통 헤더\n' +
        '- **X-Request-Id**: 요청 추적 ID. 클라이언트가 요청 시 전송하면 그 값을 사용하고, 없으면 서버가 자동 생성합니다. ' +
        '모든 응답의 `X-Request-Id` 헤더와 에러 바디의 `request_id` 필드에 포함됩니다.\n\n' +
        '## 에러 응답 포맷\n' +
        '모든 에러는 아래 형태로 응답합니다:\n' +
        '```json\n' +
        '{\n' +
        '  "request_id": "uuid",\n' +
        '  "status_code": 400,\n' +
        '  "code": "VALIDATION_ERROR",\n' +
        '  "message": "요청 값이 올바르지 않습니다.",\n' +
        '  "errors": [{ "field": "email", "reason": "must be an email" }]\n' +
        '}\n' +
        '```',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'X-Request-Id',
      in: 'header',
      required: false,
      description: '요청 추적 ID (선택). 미전송 시 서버가 자동 생성',
      schema: { type: 'string', format: 'uuid' },
    })
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
  //    - whitelist: DTO에 정의되지 않은 필드 제거(보안/스펙 안정성)
  //    - exceptionFactory: 필드 단위 오류 정보를 유지하여 HttpExceptionFilter에서 표준 포맷으로 변환
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      // forbidNonWhitelisted: true, // 필요 시 활성화(불필요 필드 전송 시 400 에러)
      exceptionFactory: (errors: ValidationError[]) => {
        const fieldErrors = flattenValidationErrors(errors);
        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: '요청 값이 올바르지 않습니다.',
          errors: fieldErrors,
        });
      },
    }),
  );

  // 4) 전역 ExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5) 모든 JSON 응답 snake_case (성공 응답에만 적용, 에러는 필터에서 직접 처리)
  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  await app.listen(3000);
}
bootstrap();
