import { Component, computed, inject } from '@angular/core';
import { WeatherStore } from '../../core/stores/weather.store';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { WeatherIconComponent } from '../../shared/components/weather-icon/weather-icon.component';
import { CommonModule, DatePipe } from '@angular/common';

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
    this.store.city.set(p.name);
    this.store.fetch(p.latitude, p.longitude);
  }
}
