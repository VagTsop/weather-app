import { Injectable, computed, signal } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { UnitsStore } from './units.store';
import { CurrentWeather, DailyItem, HourlyItem } from '../models/weather.model';

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

  constructor(private api: WeatherService, private units: UnitsStore) {}
  get units$() {
    return this.units.units;
  } // avoid field init before ctor
  readonly hourlyForSelected = computed(() => {
    const day = this.selectedDay();
    if (!day) return [] as HourlyItem[];
    return this.hourly().filter((h) => h.timeISO.startsWith(day));
  });

  fetch(lat: number, lon: number) {
    this.loading.set(true);
    this.error.set(undefined);
    this.coords.set({ lat, lon });
    this.api.get(lat, lon, this.units.units()).subscribe({
      next: (p) => {
        this.current.set(p.current);
        this.daily.set(p.daily);
        this.hourly.set(p.hourly);
        this.selectedDay.set(p.daily[0]?.dateISO);
        this.loading.set(false);
      },
      error: (_) => {
        this.error.set('API error');
        this.loading.set(false);
      },
    });
  }
}
