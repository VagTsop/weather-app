import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iconFromCode } from '../../../core/utils/icon.map';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule],
  template: `<img [src]="src" [alt]="alt" width="40" height="40" />`,
})
export class WeatherIconComponent {
  @Input() code = 0;
  @Input() alt = '';
  get src() {
    return iconFromCode(this.code);
  }
}
