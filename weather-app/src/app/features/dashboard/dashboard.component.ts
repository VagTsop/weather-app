import { Component, computed, inject } from '@angular/core';
import { WeatherStore } from '../../core/stores/weather.store';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { WeatherIconComponent } from '../../shared/components/weather-icon/weather-icon.component';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, SearchBarComponent, WeatherIconComponent],
  template: `
    <section class="page">
      <h1 style="font-family:'Bricolage Grotesque';font-size:40px;">
        How's the sky looking today?
      </h1>
      <app-search-bar (select)="onPlace($event)"></app-search-bar>

      <div class="layout">
        <!-- LEFT -->
        <div>
          <div class="current-weather panel" *ngIf="store.current() as c">
            <div>
              <div class="temp">{{ Math.round(c.temp) }}°</div>
              <div class="meta">
                Feels like {{ Math.round(c.apparent) }}°, Humidity
                {{ c.humidity }}%, Wind {{ c.wind }}
              </div>
            </div>
            <app-weather-icon [code]="c.code"></app-weather-icon>
          </div>

          <div class="tiles">
            <div class="panel">
              Feels Like<br /><b
                >{{ Math.round(store.current()?.apparent || 0) }}°</b
              >
            </div>
            <div class="panel">
              Humidity<br /><b>{{ store.current()?.humidity }}%</b>
            </div>
            <div class="panel">
              Wind<br /><b>{{ store.current()?.wind }}</b>
            </div>
            <div class="panel">
              Precipitation<br /><b>{{ store.current()?.precip }}</b>
            </div>
          </div>

          <h3 style="margin:20px 0 8px">Daily forecast</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div
              class="panel"
              style="width:110px;text-align:center;cursor:pointer"
              *ngFor="let d of store.daily()"
              (click)="store.selectedDay.set(d.dateISO)"
            >
              <div>{{ d.dateISO | date : 'EEE' }}</div>
              <app-weather-icon [code]="d.code"></app-weather-icon>
              <div>
                {{ Math.round(d.tmax) }}°
                <span style="opacity:.7">{{ Math.round(d.tmin) }}°</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="panel" *ngIf="hours().length">
          <h3>Hourly forecast — {{ store.selectedDay() | date : 'EEEE' }}</h3>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div
              class="panel"
              style="background:#2b2e48"
              *ngFor="let h of hours()"
            >
              <div>{{ h.timeISO | date : 'h a' }}</div>
              <app-weather-icon [code]="h.code"></app-weather-icon>
              <div>{{ Math.round(h.temp) }}°</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DashboardComponent {
  store = inject(WeatherStore);
  hours = computed(() => this.store.hourlyForSelected());
  Math = Math; // expose Math for template

  onPlace(p: { latitude: number; longitude: number; name: string }) {
    this.store.city.set(p.name);
    this.store.fetch(p.latitude, p.longitude);
  }
}
