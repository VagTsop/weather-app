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
    const la = Number(lat);
    const lo = Number(lon);

    // fallbacks for units in case something is off
    const temp = u?.temp ?? 'c';
    const wind = u?.wind ?? 'kmh';
    const precip = u?.precip ?? 'mm';

    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      // don't throw – still produce a cache key
      return `${lat}|${lon}|${temp}|${wind}|${precip}`;
    }
    return `${la.toFixed(3)}|${lo.toFixed(3)}|${temp}|${wind}|${precip}`;
  }

  get(lat: number, lon: number, units: Units): Observable<Packed> {
    const la = Number(lat);
    const lo = Number(lon);

    // Optional early guard: if somehow invalid, short-circuit a clear error
    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      throw new Error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
    }

    const ttl = 1000 * 60;
    const k = this.key(la, lo, units);
    const c = this.cache.get(k);
    if (c && Date.now() - c.t < ttl) return of(c.data);

    const params = new URLSearchParams({
      latitude: String(la),
      longitude: String(lo),
      timezone: 'auto',
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
      hourly: 'temperature_2m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code',
      temperature_unit: units?.temp === 'f' ? 'fahrenheit' : 'celsius',
      wind_speed_unit: units?.wind === 'mph' ? 'mph' : 'kmh',
      precipitation_unit: units?.precip === 'in' ? 'inch' : 'mm',
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
