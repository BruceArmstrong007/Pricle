import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-pricle-ui',
  standalone: true,
  imports: [ButtonModule, SelectButtonModule, NgFor, OverlayPanelModule],
  templateUrl: './pricle-ui.component.html',
  styleUrls: ['./pricle-ui.component.scss'],
})
export class PricleUiComponent {
  readonly themeService = inject(ThemeService);
  stateOptions = signal([
    { label: 'Material', value: 'md' },
    { label: 'Soho', value: 'soho' },
  ]);

  themeSelect(theme: string | undefined) {
    if (!theme) return;
    this.themeService.theme.set(theme)
  }

  trackBy(index: number, selectOption: { label: string; value: string }) {
    return selectOption?.value;
  }
}
