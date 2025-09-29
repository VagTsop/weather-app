import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-use-location',
  standalone: true,
  template: `<button class="geo" (click)="get()">📍 Use my location</button>`,
  styles: [
    `
      .geo {
        background: #2b2e48;
        border-radius: 12px;
        padding: 8px 12px;
      }
      .geo:hover {
        filter: brightness(1.05);
      }
    `,
  ],
})
export class UseLocationComponent {
  @Output() coords = new EventEmitter<{ lat: number; lon: number }>();
  get() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        this.coords.emit({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      (err) => console.warn('Geolocation denied', err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }
}
