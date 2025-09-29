import { Injectable, effect, signal } from '@angular/core';
import { Units } from '../models/weather.model';

const KEY = 'units.v1';

@Injectable({ providedIn: 'root' })
export class UnitsStore {
  readonly units = signal<Units>(
    load() ?? {
      system: 'metric',
      temp: 'c',
      wind: 'kmh',
      precip: 'mm',
    }
  );

  constructor() {
    effect(() => {
      localStorage.setItem(KEY, JSON.stringify(this.units()));
    });
  }

  toggleSystem() {
    const m = this.units().system === 'metric';
    this.units.set({
      system: m ? 'imperial' : 'metric',
      temp: m ? 'f' : 'c',
      wind: m ? 'mph' : 'kmh',
      precip: m ? 'in' : 'mm',
    });
  }

  set(partial: Partial<Units>) {
    const next = { ...this.units(), ...partial };
    // keep system coherent if a specific unit was forced
    next.system =
      next.temp === 'f' || next.wind === 'mph' || next.precip === 'in'
        ? 'imperial'
        : 'metric';
    this.units.set(next);
  }
}

function load(): Units | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}
