import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    const error =
      (exception?.statusCode ? exception : null) ?? exception?.response;

    if (error?.statusCode) {
      status = error?.statusCode;
      message = error?.message;
    }
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
