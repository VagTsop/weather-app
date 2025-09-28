import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import {
  Units,
  CurrentWeather,
  DailyItem,
  HourlyItem,
} from '../models/weather.model';

interface Packed {
  current: CurrentWeather;
  daily: DailyItem[];
  hourly: HourlyItem[];
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}
  private cache = new Map<string, { t: number; data: Packed }>();
  private key(lat: number, lon: number, u: Units) {
    return `${lat.toFixed(3)}|${lon.toFixed(3)}|${u.temp}|${u.wind}|${
      u.precip
    }`;
  }

  get(lat: number, lon: number, units: Units): Observable<Packed> {
    const ttl = 1000 * 60;
    const k = this.key(lat, lon, units);
    const c = this.cache.get(k);
    if (c && Date.now() - c.t < ttl) return of(c.data);

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      timezone: 'auto',
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
      hourly: 'temperature_2m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code',
      temperature_unit: units.temp === 'c' ? 'celsius' : 'fahrenheit',
      wind_speed_unit: units.wind === 'kmh' ? 'kmh' : 'mph',
      precipitation_unit: units.precip === 'mm' ? 'mm' : 'inch',
    });

    return this.http
      .get<any>(`https://api.open-meteo.com/v1/forecast?${params}`)
      .pipe(
        map((r) => {
          const current: CurrentWeather = {
            temp: r.current.temperature_2m,
            apparent: r.current.apparent_temperature,
            humidity: r.current.relative_humidity_2m,
            wind: r.current.wind_speed_10m,
            precip: r.current.precipitation,
            code: r.current.weather_code,
            timeISO: r.current.time,
          };
          const daily: DailyItem[] = r.daily.time.map(
            (t: string, i: number) => ({
              dateISO: t,
              tmax: r.daily.temperature_2m_max[i],
              tmin: r.daily.temperature_2m_min[i],
              code: r.daily.weather_code[i],
            })
          );
          const hourly: HourlyItem[] = r.hourly.time.map(
            (t: string, i: number) => ({
              timeISO: t,
              temp: r.hourly.temperature_2m[i],
              code: r.hourly.weather_code[i],
            })
          );
          const packed: Packed = {
            current,
            daily,
            hourly,
            timezone: r.timezone,
          };
          this.cache.set(k, { t: Date.now(), data: packed });
          return packed;
        })
      );
  }
}
