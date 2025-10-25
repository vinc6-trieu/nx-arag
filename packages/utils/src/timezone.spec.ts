import { convertToISODateTime } from './timezone';
import { Weekday } from '@v/libs-contracts';
import { utcToZonedTime } from '@date-fns/tz';

describe('convertToISODateTime', () => {
  it('converts weekday and time to UTC ISO string in server timezone', () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const iso = convertToISODateTime(Weekday.Mon, '10:30');
    const local = utcToZonedTime(iso, tz);
    expect(local.getHours()).toBe(10);
    expect(local.getMinutes()).toBe(30);
    const weekdayMap: Record<Weekday, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    expect(local.getDay()).toBe(weekdayMap[Weekday.Mon]);
  });
});
