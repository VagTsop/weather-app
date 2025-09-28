import { Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WeatherStore } from '../../core/stores/weather.store';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { WeatherIconComponent } from '../../shared/components/weather-icon/weather-icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, SearchBarComponent, WeatherIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  store = inject(WeatherStore);
  hours = computed(() => this.store.hourlyForSelected());
  Math = Math;

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

  retry() {
    const c = this.store.coords();
    if (c) this.store.fetch(c.lat, c.lon);
  }
}
