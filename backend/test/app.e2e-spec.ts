import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { SnakeCaseInterceptor } from '../src/common/interceptors/snake-case.interceptor';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 테스트 환경에서는 외부 수집/스케줄러를 끈다(불안정 방지)
    process.env.OPEN_DATA_ENABLED = 'false';
    process.env.SCHEDULER_ENABLED = 'false';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new SnakeCaseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Health: GET /api/v1/health 200', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('Festival: GET /api/v1/festivals/page 200 + shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/festivals/page?offset=0&size=10')
      .expect(200);

    expect(res.body).toHaveProperty('total_page_num');
    expect(res.body).toHaveProperty('post_responses');
    expect(Array.isArray(res.body.post_responses)).toBe(true);
  });

  it('User: signup -> login -> get /users/:id (Bearer)', async () => {
    const suffix = Date.now();
    const email = `e2e${suffix}@example.com`;
    const username = `e2e${suffix}`;
    const password = 'pass';

    const signup = await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({ username, password, email, location: 'seoul' })
      .expect(201);

    expect(signup.body).toHaveProperty('id');
    const userId = signup.body.id;

    const login = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send({ email, password })
      .expect(201);

    expect(login.body).toHaveProperty('access_token');
    const accessToken = login.body.access_token;

    const me = await request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(me.body).toHaveProperty('id', userId);
    expect(me.body).toHaveProperty('email', email);
  });
});
