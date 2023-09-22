import {
  Inject,
  Injectable,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const themes: any = {
  soho: {
    dark: 'soho-dark',
    light: 'soho-light',
  },
  md: {
    dark: 'md-dark-deeppurple',
    light: 'md-light-deeppurple',
  },
};

type Theme = {
  mode: boolean;
  theme: string;
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme: WritableSignal<string> = signal('md');
  mode: WritableSignal<boolean> = signal(false);

  constructor(@Inject(DOCUMENT) private document: Document) {
    const theme = localStorage.getItem('theme');
    if (theme) {
      const themeData: Theme = JSON.parse(theme);
      this.mode.set(themeData.mode);
      this.theme.set(themeData.theme);
    } else {
      localStorage.setItem(
        'theme',
        JSON.stringify({
          theme: this.theme(),
          mode: this.mode(),
        })
      );
    }

    effect(() => {
      const theme = this.theme();
      const mode = this.mode() ? 'dark' : 'light';
      const currentTheme = themes[theme];
      localStorage.setItem(
        'theme',
        JSON.stringify({
          theme,
          mode: this.mode(),
        })
      );
      this.switchTheme(currentTheme[mode]);
    });
  }

  switchTheme(theme: string) {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }
}
