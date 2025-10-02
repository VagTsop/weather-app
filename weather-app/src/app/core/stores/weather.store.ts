import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { UnitsStore } from './units.store';
import {
  CurrentWeather,
  DailyItem,
  HourlyItem,
  Units,
} from '../models/weather.model';
import { ThemeService } from '../services/theme.service';

@Injectable({ providedIn: 'root' })
export class WeatherStore {
  city = signal<string>('');
  coords = signal<{ lat: number; lon: number } | null>(null);

  loading = signal(false);
  error = signal<string | undefined>(undefined);

  current = signal<CurrentWeather | null>(null);
  daily = signal<DailyItem[]>([]);
  hourly = signal<HourlyItem[]>([]);
  selectedDay = signal<string | undefined>(undefined);

  constructor(
    private api: WeatherService,
    private unitsStore: UnitsStore,
    private theme: ThemeService
  ) {
    // REFRESH ON UNIT CHANGE — without touching coords (no loops)
    effect(() => {
      const units = this.unitsStore.units(); // track units
      const c = this.coords(); // track coords
      if (!c) return;
      // DO NOT write coords inside this effect!
      this.loadWithUnits(c.lat, c.lon, units);
    });
  }

  get units$() {
    return this.unitsStore.units;
  }

  readonly hourlyForSelected = computed(() => {
    const day = this.selectedDay();
    if (!day) return [] as HourlyItem[];
    return this.hourly().filter((h) => h.timeISO.startsWith(day));
  });

  /** Public fetch — can update coords, but only if value actually changes */
  fetch(lat: number, lon: number) {
    const cur = this.coords();
    if (!cur || cur.lat !== lat || cur.lon !== lon) {
      this.coords.set({ lat, lon }); // write once if changed
    }
    // Load with current units
    this.loadWithUnits(lat, lon, this.unitsStore.units());
  }

  /** Internal loader that NEVER writes to coords; avoids effect loops */
  private loadWithUnits(lat: number, lon: number, units: Units) {
    this.loading.set(true);
    this.error.set(undefined);
    this.api.get(lat, lon, units).subscribe({
      next: (p) => {
        this.current.set(p.current);
        this.daily.set(p.daily);
        this.hourly.set(p.hourly);
        this.selectedDay.set(p.daily[0]?.dateISO);
        this.theme.applyByDay(
          !!(p as any)?.current?.isDay || (p as any)?.current?.is_day === 1
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set('API error');
        this.loading.set(false);
      },
    });
  }
}
