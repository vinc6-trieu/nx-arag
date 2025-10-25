import { Weekday } from 'packages/libs/contracts/src';

const weekdayMap: Record<Weekday, number> = {
  [Weekday.Sun]: 0,
  [Weekday.Mon]: 1,
  [Weekday.Tue]: 2,
  [Weekday.Wed]: 3,
  [Weekday.Thu]: 4,
  [Weekday.Fri]: 5,
  [Weekday.Sat]: 6,
};

/**
 * Converts a weekday and time (HH:mm) to an ISO string in UTC
 * using the server's current timezone (no date-fns).
 */
export function convertToISODateTime(weekday: Weekday, timeString: string): string {
  if (!(weekday in weekdayMap)) {
    throw new Error(`Invalid weekday: ${weekday}`);
  }

  const match = /^(\d{2}):(\d{2})$/.exec(timeString);
  if (!match) {
    throw new Error(`Invalid timeString (expected HH:mm): ${timeString}`);
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time: ${timeString}`);
  }

  const now = new Date();
  const targetDay = weekdayMap[weekday];
  const currentDay = now.getDay();
  const daysToAdd = (targetDay + 7 - currentDay) % 7;

  // Construct local time (server timezone)
  const localTarget = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysToAdd,
    hours,
    minutes,
    0,
    0,
  );

  // Return as UTC ISO string
  return localTarget.toISOString();
}
