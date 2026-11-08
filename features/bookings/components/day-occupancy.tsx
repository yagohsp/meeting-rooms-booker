import { formatDate, formatTimeRange } from "../format";
import { occupancySegments } from "../occupancy";
import type { Interval } from "../rules";

const HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

type Props = { day: Interval; bookings: Interval[] };

export function DayOccupancy({ day, bookings }: Props) {
  const segments = occupancySegments(bookings, day);

  return (
    <section
      aria-labelledby="occupancy-heading"
      className="flex flex-col gap-2"
    >
      <h2 id="occupancy-heading" className="text-sm font-medium">
        Ocupação em {formatDate(day.startsAt)}
      </h2>
      <div aria-hidden="true">
        <div className="relative h-6 overflow-hidden rounded-md bg-muted ring-1 ring-border">
          {segments.map((segment) => (
            <div
              key={segment.startsAt.toISOString()}
              title={formatTimeRange(segment.startsAt, segment.endsAt)}
              className="absolute inset-y-0 bg-primary"
              style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
            />
          ))}
        </div>
        <div className="relative mt-1 h-4 text-xs text-muted-foreground">
          {HOURS.map((hour) => (
            <span
              key={hour}
              className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              {String(hour).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {segments.length > 0
          ? `Ocupado: ${segments.map((segment) => formatTimeRange(segment.startsAt, segment.endsAt)).join(" · ")}`
          : "Sala livre o dia todo."}
      </p>
    </section>
  );
}
