// src/app/features/compare/compare.component.ts
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeoService } from '../../core/services/geo.service';
import { WeatherService } from '../../core/services/weather.service';
import { UnitsStore } from '../../core/stores/units.store';
import { WeatherIconComponent } from '../../shared/components/weather-icon/weather-icon.component';

type Units = 'metric' | 'imperial';
interface Place {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}
interface CardData {
  // persist coords to re-fetch on unit changes
  place: Place;
  loading: boolean;
  error?: string;
  // current slice we show
  timeISO?: string;
  temp?: number;
  apparent?: number;
  humidity?: number;
  wind?: number;
  precip?: number;
  code?: number;
  uv?: number | null;
  visibilityKm?: number | null;
  pressureHpa?: number | null;
  sunriseISO?: string | null;
  sunsetISO?: string | null;
}

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, WeatherIconComponent],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent {
  private geo = inject(GeoService);
  private api = inject(WeatherService);
  private units = inject(UnitsStore);

  q = '';
  searching = signal(false);
  results = signal<Place[]>([]);
  cards = signal<CardData[]>([]);

  constructor() {
    effect(() => {
      // Track only unit changes
      const _ = this.units.units();

      // Refetch current cards WITHOUT tracking cards()
      untracked(() => {
        const arr = this.cards();
        arr.forEach((c, idx) => this.load(idx, c.place));
      });
    });
  }

  // Search UI
  search() {
    const query = this.q.trim();
    if (!query) return;
    this.searching.set(true);
    this.geo.search(query).subscribe({
      next: (r) => this.results.set(r),
      error: () => this.results.set([]),
      complete: () => this.searching.set(false),
    });
  }

  pick(p: Place) {
    this.results.set([]);
    this.q = p.name;
    this.add(p);
  }

  // Cards
  add(place: Place) {
    // prevent duplicates (by coords)
    const exists = this.cards().some(
      (c) =>
        c.place.latitude === place.latitude &&
        c.place.longitude === place.longitude
    );
    if (exists) return;

    this.cards.update((arr) => [...arr, { place, loading: true }]);
    const idx = this.cards().length - 1;
    this.load(idx, place);
  }

  remove(index: number) {
    this.cards.update((arr) => arr.filter((_, i) => i !== index));
  }

  private load(index: number, place: Place) {
    // snapshot cards untracked to avoid accidental tracking (optional)
    const snapshot = this.cards();
    if (!snapshot[index]) return;

    // mark loading
    this.cards.update((arr) => {
      const copy = [...arr];
      if (!copy[index]) return arr; // index might have changed
      copy[index] = { ...copy[index], loading: true, error: undefined };
      return copy;
    });

    const u = this.units.units(); // reading a signal here is fine

    this.api
      .get(place.latitude, place.longitude, {
        system: u.system,
        temp: u.temp,
        wind: u.wind,
        precip: u.precip,
      } as any)
      .subscribe({
        next: (packed) => {
          this.cards.update((arr) => {
            const copy = [...arr];
            if (!copy[index]) return arr;
            copy[index] = {
              ...copy[index],
              loading: false,
              timeISO: packed.current.timeISO,
              temp: packed.current.temp,
              apparent: packed.current.apparent,
              humidity: packed.current.humidity,
              wind: packed.current.wind,
              precip: packed.current.precip,
              code: packed.current.code,
              // fill extras here if your service returns them
              uv: (packed as any).uv ?? copy[index].uv ?? null,
              visibilityKm:
                (packed as any).visibilityKm ??
                copy[index].visibilityKm ??
                null,
              pressureHpa:
                (packed as any).pressureHpa ?? copy[index].pressureHpa ?? null,
              sunriseISO:
                (packed as any).sunriseISO ?? copy[index].sunriseISO ?? null,
              sunsetISO:
                (packed as any).sunsetISO ?? copy[index].sunsetISO ?? null,
            };
            return copy;
          });
        },
        error: () => {
          this.cards.update((arr) => {
            const copy = [...arr];
            if (!copy[index]) return arr;
            copy[index] = {
              ...copy[index],
              loading: false,
              error: 'API error',
            };
            return copy;
          });
        },
      });
  }
}
