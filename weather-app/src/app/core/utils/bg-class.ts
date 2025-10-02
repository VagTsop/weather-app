export function bgClassFromCode(code: number): string {
  // broaden as you like
  if ([0, 1].includes(code)) return 'bg-sunny';
  if ([2, 3].includes(code)) return 'bg-cloudy';
  if ([45, 48].includes(code)) return 'bg-fog';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'bg-rain';
  if ([71, 73, 75, 85, 86].includes(code)) return 'bg-snow';
  if ([95, 96, 99].includes(code)) return 'bg-storm';
  return 'bg-overcast';
}
