import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

function extractMessage(exception: unknown): string {
  if (exception instanceof HttpException) {
    const res = exception.getResponse() as
      | string
      | { message?: string | string[]; error?: string; [key: string]: unknown };

    if (typeof res === 'string') return res;

    const msg = res?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;

    return exception.message || 'Error';
  }

  if (exception && typeof exception === 'object' && 'message' in exception) {
    const msg = (exception as any).message;
    if (typeof msg === 'string') return msg;
  }

  return 'Internal server error';
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = extractMessage(exception);

    // 4) 최소한 Validation 에러는 400 + { "message": "..." }
    //    그 외 에러도 기본적으로 { "message": "..." } 형태로 통일
    response.status(status).json({ message });
  }
}

