import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

function toSnakeKey(key: string): string {
  // camelCase / PascalCase / kebab-case 섞여 있어도 최대한 snake_case로 통일
  return key
    .replace(/-/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1_$2')
    .toLowerCase();
}

function toSnakeCaseDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((v) => toSnakeCaseDeep(v)) as unknown as T;
  }

  if (isPlainObject(input)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      out[toSnakeKey(k)] = toSnakeCaseDeep(v);
    }
    return out as unknown as T;
  }

  return input;
}

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => toSnakeCaseDeep(data)));
  }
}

