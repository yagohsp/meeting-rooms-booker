import { describe, expect, it } from "vitest";
import {
  checkBookingTimes,
  checkMaxDuration,
  checkOverlap,
  overlaps,
  type Interval,
} from "./rules";

const at = (time: string, date = "2026-11-10") =>
  new Date(`${date}T${time}:00-03:00`);
const interval = (start: string, end: string): Interval => ({
  startsAt: at(start),
  endsAt: at(end),
});
const now = at("08:00");

const validate = (requested: Interval) => checkBookingTimes(requested, now);

describe("overlaps", () => {
  it("detects intervals that intersect", () => {
    expect(
      overlaps(interval("09:00", "10:00"), interval("09:30", "11:00")),
    ).toBe(true);
    expect(
      overlaps(interval("09:00", "12:00"), interval("10:00", "11:00")),
    ).toBe(true);
  });

  it("allows back-to-back bookings", () => {
    expect(
      overlaps(interval("09:00", "10:00"), interval("10:00", "11:00")),
    ).toBe(false);
    expect(
      overlaps(interval("10:00", "11:00"), interval("09:00", "10:00")),
    ).toBe(false);
  });
});

describe("checkBookingTimes", () => {
  it("accepts a valid booking", () => {
    expect(validate(interval("09:00", "10:00"))).toEqual([]);
  });

  it("rejects an end before or equal to the start", () => {
    expect(validate(interval("10:00", "09:00"))).toEqual([
      { code: "INVALID_RANGE" },
    ]);
    expect(validate(interval("10:00", "10:00"))).toEqual([
      { code: "INVALID_RANGE" },
    ]);
  });

  it("rejects bookings that start in the past", () => {
    expect(validate(interval("07:30", "08:30"))).toContainEqual({
      code: "IN_THE_PAST",
    });
  });

  it("accepts exactly 15 minutes and rejects less", () => {
    expect(validate(interval("09:00", "09:15"))).toEqual([]);
    expect(validate(interval("09:00", "09:14"))).toContainEqual({
      code: "TOO_SHORT",
      minMinutes: 15,
    });
  });

  it("reports every broken time rule at once", () => {
    expect(
      validate(interval("07:00", "07:05")).map((error) => error.code),
    ).toEqual(["IN_THE_PAST", "TOO_SHORT"]);
  });
});

describe("checkMaxDuration", () => {
  it("accepts a booking up to the room's limit", () => {
    expect(checkMaxDuration(interval("09:00", "13:00"), 240)).toEqual([]);
    expect(checkMaxDuration(interval("09:00", "10:00"), 60)).toEqual([]);
  });

  it("rejects a booking longer than the room's limit", () => {
    expect(checkMaxDuration(interval("09:00", "13:01"), 240)).toEqual([
      { code: "TOO_LONG", maxMinutes: 240 },
    ]);
    expect(checkMaxDuration(interval("09:00", "10:30"), 60)).toEqual([
      { code: "TOO_LONG", maxMinutes: 60 },
    ]);
  });
});

describe("checkOverlap", () => {
  const existing = interval("10:00", "11:00");

  it("rejects an overlap with an existing booking", () => {
    expect(checkOverlap(interval("10:30", "11:30"), [existing])).toEqual([
      { code: "OVERLAP", conflict: existing },
    ]);
  });

  it("accepts a booking right after an existing one", () => {
    expect(checkOverlap(interval("11:00", "12:00"), [existing])).toEqual([]);
  });

  it("accepts any booking when the room is free", () => {
    expect(checkOverlap(interval("10:00", "11:00"), [])).toEqual([]);
  });
});
