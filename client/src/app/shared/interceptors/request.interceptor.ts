import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { authFeature } from 'src/app/stores/auth/auth.reducer';
import { ApiService } from '../services/api/api.service';
import { API } from '../utils/api.endpoints';
import { authActions } from 'src/app/stores/auth/auth.action';
import { Router } from '@angular/router';
import { Routes } from '../utils/client.routes';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly token = this.store.selectSignal(
    authFeature.selectAccessToken
  );
  private readonly apiService = inject(ApiService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthHeader(request)).pipe(
      catchError((response: HttpErrorResponse) => {
        return this.handle401Error(request, next, response);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    response: HttpErrorResponse
  ) {
    if (response.status === 0) {
      this.logout(request);
    }

    if (response.status === 401 && this.token()) {
      return this.apiService
        .request(API.REFRESH)
        .pipe(
          tap((res: any) => {
            this.store.dispatch(
              authActions.refreshToken({ accessToken: res?.accessToken })
            );
          }),
          switchMap(() => {

            return next.handle(this.addAuthHeader(request));
          }),
          catchError((error) => {
            this.logout(request);
            return throwError(() => error);
          })
        );
    }
    return throwError(() => response);
  }

  private addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const accessToken = this.token();
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return request;
  }

  private logout(request: HttpRequest<unknown>) {
    if (request.url.includes('user')) {
      this.router.navigateByUrl(Routes.Auth.Root);
      return;
    }
    this.store.dispatch(authActions.logout());
    return;
  }
}
