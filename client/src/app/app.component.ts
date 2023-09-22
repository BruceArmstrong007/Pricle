import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <div class="w-full h-screen"><router-outlet /></div> `,
})
export class AppComponent {
  constructor(readonly theme: ThemeService) {}
}
