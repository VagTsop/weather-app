import { Injectable, signal } from '@angular/core';

type Mode = 'auto' | 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  mode = signal<Mode>((localStorage.getItem('theme.mode') as Mode) || 'auto');

  set(mode: Mode) {
    this.mode.set(mode);
    localStorage.setItem('theme.mode', mode);
  }

  applyByDay(isDay: boolean) {
    const m = this.mode();
    const target = m === 'auto' ? (isDay ? 'light' : 'dark') : m;
    document.documentElement.setAttribute('data-theme', target);
  }
}
