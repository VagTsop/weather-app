import { Injectable, signal } from '@angular/core';

export interface Favorite {
  name: string;
  lat: number;
  lon: number;
}
const KEY = 'favorites.v1';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  items = signal<Favorite[]>(load());

  add(f: Favorite) {
    if (this.items().some((x) => x.lat === f.lat && x.lon === f.lon)) return;
    const next = [...this.items(), f].slice(0, 12);
    this.items.set(next);
    save(next);
  }
  remove(lat: number, lon: number) {
    const next = this.items().filter((x) => !(x.lat === lat && x.lon === lon));
    this.items.set(next);
    save(next);
  }
}

function load(): Favorite[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}
function save(v: Favorite[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}
