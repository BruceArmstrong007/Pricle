import {
  ApiExceptionFilter,
  RMQClientService,
  RequestMethods,
} from '@app/common';
import {
  Controller,
  Body,
  Post,
  Inject,
  Param,
  Headers,
  Delete,
  Get,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Controller('api')
@UseFilters(new ApiExceptionFilter())
export class ApiController {
  constructor(
    @Inject(RMQClientService.AUTH) private readonly authClient: ClientProxy,
    @Inject(RMQClientService.USER) private readonly userClient: ClientProxy,
    @Inject(RMQClientService.CONTACT)
    private readonly contactClient: ClientProxy,
    private readonly apiService: ApiService,
  ) {}

  // Auth Routes here
  @Post('auth/:params')
  postAuth(
    @Headers('authorization') authHeader: string,
    @Param('params') params: string,
    @Body() data: any,
  ): Observable<any> {
    if (params === 'refresh') {
      return this.apiService.sendToClientRoute(
        this.authClient,
        params,
        data,
        authHeader,
      );
    }
    return this.apiService.sendToClient(
      this.authClient,
      RequestMethods.POST,
      params,
      data,
      authHeader,
    );
  }

  // User Routes here
  @Get('user/:params')
  getUser(
    @Headers('authorization') authHeader: string,
    @Param('params') params: string,
    @Body() data: any,
  ): Observable<any> {
    return this.apiService.sendToClient(
      this.userClient,
      RequestMethods.GET,
      params,
      data,
      authHeader,
    );
  }

  @Post('user/:params')
  postUser(
    @Headers('authorization') authHeader: string,
    @Param('params') params: string,
    @Body() data: any,
  ): Observable<any> {
    return this.apiService.sendToClient(
      this.userClient,
      RequestMethods.POST,
      params,
      data,
      authHeader,
    );
  }

  @Delete('user/:params')
  deleteUser(
    @Headers('authorization') authHeader: string,
    @Param('params') params: string,
    @Body() data: any,
  ): Observable<any> {
    return this.apiService.sendToClient(
      this.userClient,
      RequestMethods.DELETE,
      params,
      data,
      authHeader,
    );
  }

  // Contact Routes here
  @Post('contact/:params')
  postContact(
    @Headers('authorization') authHeader: string,
    @Param('params') params: string,
    @Body() data: any,
  ): Observable<any> {
    return this.apiService.sendToClient(
      this.contactClient,
      RequestMethods.POST,
      params,
      data,
      authHeader,
    );
  }
  @Get('contact/:params')
  getContact(
    @Headers('authorization') authHeader: string,
    @Param('params') params: string,
    @Body() data: any,
  ): Observable<any> {
    return this.apiService.sendToClient(
      this.contactClient,
      RequestMethods.GET,
      params,
      data,
      authHeader,
    );
  }
}
