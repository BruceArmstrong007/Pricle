import { RequestMethods } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  sendToClient(
    client: ClientProxy,
    method: RequestMethods,
    route: string,
    data: any,
    authHeader?: string,
  ): Observable<any> {
    return client.send(method, {
      route,
      data,
      Authentication: authHeader?.split(' ')[1],
    });
  }

  sendToClientRoute(
    client: ClientProxy,
    route: string,
    data: any,
    authHeader?: string,
  ): Observable<any> {
    return client.send(route, {
      data,
      Authentication: authHeader?.split(' ')[1],
    });
  }
}
