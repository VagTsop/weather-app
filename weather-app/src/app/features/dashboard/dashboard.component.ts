import { Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WeatherStore } from '../../core/stores/weather.store';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { WeatherIconComponent } from '../../shared/components/weather-icon/weather-icon.component';
import { UseLocationComponent } from '../../shared/components/use-location/use-location.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { FavoritesBarComponent } from '../../shared/components/favorites-bar/favorites-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    SearchBarComponent,
    WeatherIconComponent,
    UseLocationComponent,
    FavoritesBarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  store = inject(WeatherStore);
  hours = computed(() => this.store.hourlyForSelected());
  Math = Math;
  openDay = false;
  constructor(private fav: FavoritesService, private storeSvc: WeatherStore) {}

  onPlace(p: { latitude: number; longitude: number; name: string }) {
    // Coerce to numbers and validate
    const lat = Number(p?.latitude);
    const lon = Number(p?.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      console.warn('Invalid coordinates from search:', p);
      return;
    }

    this.store.city.set(p.name);
    this.store.fetch(lat, lon);
  }
  onGeo(p: { lat: number; lon: number }) {
    this.store.city.set('My location');
    this.store.fetch(p.lat, p.lon);
  }

  onFav(p: { lat: number; lon: number; name: string }) {
    this.store.city.set(p.name);
    this.store.fetch(p.lat, p.lon);
  }

  saveCurrent() {
    const c = this.store.coords();
    const name = this.store.city() || 'Saved place';
    if (c) this.fav.add({ name, lat: c.lat, lon: c.lon });
  }

  retry() {
    const c = this.store.coords();
    if (c) this.store.fetch(c.lat, c.lon);
  }
}
