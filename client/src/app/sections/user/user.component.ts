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

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ToastModule,
    RouterOutlet,
    NavbarComponent,
    NgIf,
    LoaderComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  store = inject(Store);
  isLoading = this.store.selectSignal(userFeature.selectIsLoading);

  // Initializing sockets
  private readonly userSocket = inject(UserSocketService);
  private readonly messageSocket = inject(MessageSocketService);
}
