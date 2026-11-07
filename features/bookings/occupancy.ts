import type { Interval } from "./rules";

export type OccupancySegment = Interval & { left: number; width: number };

export function occupancySegments(
  bookings: Interval[],
  day: Interval,
): OccupancySegment[] {
  const dayStart = day.startsAt.getTime();
  const dayLength = day.endsAt.getTime() - dayStart;
  const percent = (time: number) => ((time - dayStart) / dayLength) * 100;

  return bookings
    .map((booking) => {
      const start = Math.max(booking.startsAt.getTime(), dayStart);
      const end = Math.min(booking.endsAt.getTime(), day.endsAt.getTime());
      return {
        ...booking,
        left: percent(start),
        width: percent(end) - percent(start),
      };
    })
    .filter((segment) => segment.width > 0)
    .sort((a, b) => a.left - b.left);
}
