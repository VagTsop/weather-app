export interface Units {
  system: 'metric' | 'imperial';
  temp: 'c' | 'f';
  wind: 'kmh' | 'mph';
  precip: 'mm' | 'in';
}
export interface CurrentWeather {
  temp: number;
  apparent: number;
  humidity: number;
  wind: number;
  precip: number;
  code: number;
  timeISO: string;
  isDay?: number;
}
export interface DailyItem {
  dateISO: string;
  tmax: number;
  tmin: number;
  code: number;
}
export interface HourlyItem {
  timeISO: string;
  temp: number;
  code: number;
}
