import { Injectable, signal } from '@angular/core';
import { Units } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class UnitsStore {
  readonly units = signal<Units>({
    system: 'metric',
    temp: 'c',
    wind: 'kmh',
    precip: 'mm',
  });
  toggleSystem() {
    const u = this.units();
    const metric = u.system === 'imperial';
    this.units.set({
      system: metric ? 'metric' : 'imperial',
      temp: metric ? 'c' : 'f',
      wind: metric ? 'kmh' : 'mph',
      precip: metric ? 'mm' : 'in',
    });
  }
  set(partial: Partial<Units>) {
    this.units.set({ ...this.units(), ...partial });
  }
}
