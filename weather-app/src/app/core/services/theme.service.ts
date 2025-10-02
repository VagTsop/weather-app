import { Injectable, effect, signal } from '@angular/core';

type ThemeMode = 'auto' | 'light' | 'dark';
const KEY = 'theme.mode.v1';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // persisted mode
  readonly mode = signal<ThemeMode>(
    (() => {
      try {
        return (localStorage.getItem(KEY) as ThemeMode) || 'auto';
      } catch {
        return 'auto';
      }
    })()
  );

  // current applied theme class on <body>
  readonly current = signal<'theme-light' | 'theme-dark'>('theme-dark');

  constructor() {
    // persist and re-apply whenever mode changes
    effect(() => {
      const m = this.mode();
      localStorage.setItem(KEY, m);
      this.applyByClock(); // for 'auto' we evaluate time-of-day
    });
  }

  /** User intent */
  set(mode: ThemeMode) {
    this.mode.set(mode);
  }

  /** Call this after each weather fetch (so Auto can follow is_day) */
  applyByIsDay(isDay: boolean | number | undefined) {
    if (this.mode() === 'auto' && isDay != null) {
      this.apply(isDay ? 'theme-light' : 'theme-dark');
    } else {
      this.applyByClock();
    }
  }

  /** Fallback when we don’t know is_day yet */
  private applyByClock() {
    const m = this.mode();
    if (m === 'light') return this.apply('theme-light');
    if (m === 'dark') return this.apply('theme-dark');

    const hour = new Date().getHours();
    const lightNow = hour >= 7 && hour < 19;
    this.apply(lightNow ? 'theme-light' : 'theme-dark');
  }

  private apply(cls: 'theme-light' | 'theme-dark') {
    this.current.set(cls);
    const b = document.body;
    b.classList.remove('theme-light', 'theme-dark');
    b.classList.add(cls);
  }
}
