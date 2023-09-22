import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
import { NgFor } from '@angular/common';
import { DividerModule } from 'primeng/divider';

interface Category {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-settings-list',
  standalone: true,
  imports: [NgFor, DividerModule, RouterLink, RouterLinkActive],
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss'],
})
export class SettingsListComponent {
  readonly Routes: RoutesInterface = Routes;
  readonly catergory = signal([
    {
      name: 'Personal Details',
      url: Routes.User.Settings.Personal,
      icon: 'account_circle',
    },
    {
      name: 'Account Details',
      url: Routes.User.Settings.Account,
      icon: 'manage_accounts',
    },
  ]);

  trackBy(index: number, catergory: Category) {
    return catergory.url;
  }
}
