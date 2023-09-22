import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsListComponent } from './components/settings-list/settings-list.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SettingsListComponent, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {}
