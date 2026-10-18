// Anonymous Gregorian algorithm (Meeus/Jones/Butcher)
export function easterSunday(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return { m: month, d: day };
}

export function pickOccasion(date) {
  const m = date.getMonth() + 1, d = date.getDate(), y = date.getFullYear();
  if (m === 12 && d <= 26) return 'christmas';
  if (m === 2 && d === 15) return 'birthday';
  if (m === 10 && d >= 24) return 'halloween';
  const e = easterSunday(y), sunday = new Date(y, e.m - 1, e.d).getTime(), day = 864e5;
  const t = new Date(y, m - 1, d).getTime();
  if (t >= sunday - 2 * day && t <= sunday + day) return 'easter';
  return null;
}

export function parseOverride(search, now) {
  const hit = /[?&]date=(\d{2})-(\d{2})/.exec(search);
  return hit ? new Date(now.getFullYear(), +hit[1] - 1, +hit[2]) : now;
}
