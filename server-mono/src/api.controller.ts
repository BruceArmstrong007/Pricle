import { ApiExceptionFilter } from '@app/common';
import { Controller, Get, UseFilters } from '@nestjs/common';

@Controller('api')
@UseFilters(new ApiExceptionFilter())
export class ApiController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Server is up and running!'
  }
}
