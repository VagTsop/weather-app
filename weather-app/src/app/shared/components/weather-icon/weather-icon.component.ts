import { Component, Input } from '@angular/core';
import { iconFromCode } from '../../../core/utils/icon.map';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  templateUrl: './weather-icon.component.html',
  styleUrls: ['./weather-icon.component.css'],
})
export class WeatherIconComponent {
  @Input() code = 0;
  @Input() alt = '';
  get src() {
    return iconFromCode(this.code);
  }
}
