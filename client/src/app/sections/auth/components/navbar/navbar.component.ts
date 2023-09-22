import { Component, inject } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUrl } from '../../../../shared/router-store/router-selector';
import { NgIf } from '@angular/common';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
import { AvatarModule } from 'primeng/avatar';
import { App } from '../../../../shared/utils/app.const';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, RouterLink, NgIf, AvatarModule,],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly theme = inject(ThemeService);
  readonly store = inject(Store);
  readonly routePath = this.store.selectSignal(selectUrl);
  readonly Routes: RoutesInterface = Routes;
  readonly AppIcon = App.ICON;


}
