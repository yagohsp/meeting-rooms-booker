export const MIN_DURATION_MINUTES = 15;

export type Interval = { startsAt: Date; endsAt: Date };

export type BookingError =
  | { code: "INVALID_RANGE" }
  | { code: "IN_THE_PAST" }
  | { code: "TOO_SHORT"; minMinutes: number }
  | { code: "TOO_LONG"; maxMinutes: number }
  | { code: "OVERLAP"; conflict: Interval };

export function overlaps(a: Interval, b: Interval): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

export function checkBookingTimes(
  requested: Interval,
  now: Date,
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

  return errors;
}

export function checkMaxDuration(
  requested: Interval,
  maxMinutes: number,
): BookingError[] {
  const minutes =
    (requested.endsAt.getTime() - requested.startsAt.getTime()) / 60_000;
  return minutes > maxMinutes ? [{ code: "TOO_LONG", maxMinutes }] : [];
}

export function checkOverlap(
  requested: Interval,
  existing: Interval[],
): BookingError[] {
  const conflict = existing.find((booking) => overlaps(requested, booking));
  return conflict ? [{ code: "OVERLAP", conflict }] : [];
}
