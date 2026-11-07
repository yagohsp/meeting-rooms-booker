import { describe, expect, it } from "vitest";
import { occupancySegments } from "./occupancy";

const at = (iso: string) => new Date(`${iso}-03:00`);
const day = {
  startsAt: at("2026-11-09T00:00:00"),
  endsAt: at("2026-11-10T00:00:00"),
};
const booking = (start: string, end: string) => ({
  startsAt: at(start),
  endsAt: at(end),
});

describe("occupancySegments", () => {
  it("positions a booking as a percentage of the day", () => {
    const [segment] = occupancySegments(
      [booking("2026-11-09T06:00:00", "2026-11-09T12:00:00")],
      day,
    );
    expect(segment.left).toBe(25);
    expect(segment.width).toBe(25);
  });

  it("clips bookings that cross midnight", () => {
    const [segment] = occupancySegments(
      [booking("2026-11-09T22:00:00", "2026-11-10T01:00:00")],
      day,
    );
    expect(segment.left).toBeCloseTo(91.667, 3);
    expect(segment.width).toBeCloseTo(8.333, 3);
  });

  it("drops bookings outside the day and sorts the rest", () => {
    const segments = occupancySegments(
      [
        booking("2026-11-09T14:00:00", "2026-11-09T15:00:00"),
        booking("2026-11-10T09:00:00", "2026-11-10T10:00:00"),
        booking("2026-11-09T09:00:00", "2026-11-09T10:00:00"),
      ],
      day,
    );
    expect(
      segments.map((segment) => Math.round(segment.left * 100) / 100),
    ).toEqual([37.5, 58.33]);
  });

  it("returns no segments for a free day", () => {
    expect(occupancySegments([], day)).toEqual([]);
  });
});
