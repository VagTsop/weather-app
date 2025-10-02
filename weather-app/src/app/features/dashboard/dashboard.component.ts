import { Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WeatherStore } from '../../core/stores/weather.store';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { WeatherIconComponent } from '../../shared/components/weather-icon/weather-icon.component';
import { UseLocationComponent } from '../../shared/components/use-location/use-location.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { FavoritesBarComponent } from '../../shared/components/favorites-bar/favorites-bar.component';
import { bgClassFromCode } from '../../core/utils/bg-class';
import { VoiceSearchComponent } from '../../shared/components/voice-search/voice-search.component';
import { GeoService } from '../../core/services/geo.service';
import { ThemeService } from '../../core/services/theme.service';

const AUTO_GEO_KEY = 'autogeo.v1';

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
    VoiceSearchComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  store = inject(WeatherStore);
  hours = computed(() => this.store.hourlyForSelected());
  Math = Math;
  openDay = false;
  bg = computed(() => bgClassFromCode(this.store.current()?.code ?? 0));

  constructor(
    private fav: FavoritesService,
    private storeSvc: WeatherStore,
    private theme: ThemeService,
    private geo: GeoService
  ) {}
  AUTO_GEO_KEY = 'autogeo.v1';

  ngOnInit() {
    if (this.store.coords()) return; // already loaded
    if (localStorage.getItem(AUTO_GEO_KEY)) return; // tried before

    const run = () => {
      if (!('geolocation' in navigator)) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem(AUTO_GEO_KEY, '1');
          this.store.city.set('My location');
          this.store.fetch(pos.coords.latitude, pos.coords.longitude);
        },
        () => localStorage.setItem(AUTO_GEO_KEY, '1'),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    };

    // If Permissions API is available, only run when not explicitly denied
    (navigator as any).permissions
      ?.query({ name: 'geolocation' as PermissionName })
      .then((p: any) => {
        if (p.state !== 'denied') run();
      })
      .catch(run);
  }

  onVoice(phrase: string) {
    // Optionally normalize spaces & capitalization
    const q = (phrase || '').trim();
    if (!q) return;

    this.geo.search(q).subscribe({
      next: (results) => {
        const first = results?.[0];
        if (!first) {
          // Optional: show a small UI notice/toast
          console.warn('No results for voice query:', q);
          return;
        }
        // Reuse your existing onPlace flow
        this.onPlace({
          latitude: first.latitude,
          longitude: first.longitude,
          name: first.name,
        });
      },
      error: (err) => console.warn('Voice geocode failed:', err),
    });
  }
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
