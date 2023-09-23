import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { userFeature } from 'src/app/stores/user/user.reducer';
import { NgIf } from '@angular/common';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { UserSocketService } from 'src/app/shared/sockets/user-socket/user-socket.service';
import { MessageSocketService } from 'src/app/shared/sockets/message-socket/message-socket.service';
import { authFeature } from 'src/app/stores/auth/auth.reducer';
import { API } from 'src/app/shared/utils/api.endpoints';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ToastModule, RouterOutlet, NavbarComponent, NgIf, LoaderComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  store = inject(Store);
  isLoading = this.store.selectSignal(userFeature.selectIsLoading);

  // Initializing sockets
  private readonly userSocket = inject(UserSocketService);
  private readonly messageSocket = inject(MessageSocketService);

  private readonly apiService = inject(ApiService);

  private readonly accesssToken = this.store.selectSignal(
    authFeature?.selectAccessToken
  );
  private readonly refreshToken = this.store.selectSignal(
    authFeature?.selectRefreshToken
  );

  constructor() {
    const online = setInterval(() => {
      if (!this.accesssToken()) {
        clearInterval(online);
        return;
      }
      if (!this.refreshToken()) return;
        this.apiService.request(API.REFRESH, {
          refresh: this.refreshToken(),
        });
    }, 4000);
  }
}
