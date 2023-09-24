import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomRouterStateSerializer } from './shared/router-store/router-serializer';
import { RequestInterceptor } from './shared/interceptors/request.interceptor';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { authFeature } from './stores/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import * as authEffects from './stores/auth/auth.effect';
import { LoginStore } from './sections/auth/components/login/store/login.store';
import { ResetPasswordStore } from './sections/auth/components/reset-password/store/reset-password.store';
import { RegisterStore } from './sections/auth/components/register/store/register.store';
import { VerifyAccountStore } from './sections/auth/components/verify-account/store/verify-account.store';
import { userFeature } from './stores/user/user.reducer';
import { contactsFeature } from './stores/contacts/contacts.reducer';
import { CookieService } from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    DialogService,
    LoginStore,
    ResetPasswordStore,
    CookieService,
    VerifyAccountStore,
    RegisterStore,
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideStore({
      router: routerReducer,
      auth: authFeature.reducer,
      user: userFeature.reducer,
      contacts: contactsFeature.reducer,
    }),
    provideEffects([authEffects]),
    provideRouterStore({ serializer: CustomRouterStateSerializer }),
    (isDevMode() ? provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }) : []),
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
    ),
  ],
};
