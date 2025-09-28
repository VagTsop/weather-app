export function iconFromCode(code: number): string {
  // Simplified mapping; extend as needed
  if ([0, 1].includes(code)) return './assets/icon-sunny.webp';
  if ([2, 3].includes(code)) return './assets/icon-partly-cloudy.webp';
  if ([45, 48].includes(code)) return './assets/icon-fog.webp';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return './assets/icon-rain.webp';
  if ([71, 73, 75, 85, 86].includes(code)) return './assets/icon-snow.webp';
  if ([95, 96, 99].includes(code)) return './assets/icon-storm.webp';
  return './assets/icon-overcast.webp';
}
