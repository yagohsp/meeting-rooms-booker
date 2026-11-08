import { saoPauloClock } from "@/lib/time";

export const MIN_DURATION_MINUTES = 15;
export const OPENING_MINUTES = 8 * 60;
export const CLOSING_MINUTES = 20 * 60;

export type Interval = { startsAt: Date; endsAt: Date };

export type BookingError =
  | { code: "INVALID_RANGE" }
  | { code: "IN_THE_PAST" }
  | { code: "TOO_SHORT"; minMinutes: number }
  | { code: "TOO_LONG"; maxMinutes: number }
  | { code: "OUTSIDE_BUSINESS_HOURS" }
  | { code: "OVERLAP"; conflict: Interval };

export function overlaps(a: Interval, b: Interval): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

export function isWithinBusinessHours({ startsAt, endsAt }: Interval) {
  const start = saoPauloClock(startsAt);
  const end = saoPauloClock(endsAt);
  return (
    start.date === end.date &&
    start.weekday >= 1 &&
    start.weekday <= 5 &&
    start.minutes >= OPENING_MINUTES &&
    end.minutes <= CLOSING_MINUTES
  );
}

export function checkBookingTimes(
  requested: Interval,
  now: Date,
  maxMinutes: number,
): BookingError[] {
  if (requested.endsAt <= requested.startsAt) {
    return [{ code: "INVALID_RANGE" }];
  }

  const errors: BookingError[] = [];

  if (requested.startsAt < now) errors.push({ code: "IN_THE_PAST" });

  const minutes =
    (requested.endsAt.getTime() - requested.startsAt.getTime()) / 60_000;
  if (minutes < MIN_DURATION_MINUTES) {
    errors.push({ code: "TOO_SHORT", minMinutes: MIN_DURATION_MINUTES });
  }
  if (minutes > maxMinutes) {
    errors.push({ code: "TOO_LONG", maxMinutes });
  }
  if (!isWithinBusinessHours(requested)) {
    errors.push({ code: "OUTSIDE_BUSINESS_HOURS" });
  }

  return errors;
}

export function checkOverlap(
  requested: Interval,
  existing: Interval[],
): BookingError[] {
  const conflict = existing.find((booking) => overlaps(requested, booking));
  return conflict ? [{ code: "OVERLAP", conflict }] : [];
}
