import { describe, expect, it } from "vitest";
import { formatDuration, todayInSaoPaulo, zonedDateTimeToUtc } from "./time";

describe("todayInSaoPaulo", () => {
  it("returns the São Paulo date as YYYY-MM-DD", () => {
    expect(todayInSaoPaulo(new Date("2026-11-07T15:00:00Z"))).toBe(
      "2026-11-07",
    );
  });

  it("uses São Paulo time, not UTC, near midnight", () => {
    expect(todayInSaoPaulo(new Date("2026-11-08T01:30:00Z"))).toBe(
      "2026-11-07",
    );
  });
});

describe("zonedDateTimeToUtc", () => {
  it("converts São Paulo local time to UTC", () => {
    expect(zonedDateTimeToUtc("2026-11-10", "09:00")).toEqual(
      new Date("2026-11-10T12:00:00Z"),
    );
  });

  it("follows daylight saving time when the zone has it", () => {
    expect(zonedDateTimeToUtc("2018-12-01", "09:00")).toEqual(
      new Date("2018-12-01T11:00:00Z"),
    );
    expect(zonedDateTimeToUtc("2026-07-01", "09:00", "Europe/Lisbon")).toEqual(
      new Date("2026-07-01T08:00:00Z"),
    );
    expect(zonedDateTimeToUtc("2026-01-15", "09:00", "Europe/Lisbon")).toEqual(
      new Date("2026-01-15T09:00:00Z"),
    );
  });
});

describe("formatDuration", () => {
  it.each([
    [15, "15 minutos"],
    [60, "1 hora"],
    [90, "1h30"],
    [240, "4 horas"],
    [1440, "24 horas"],
  ])("formats %i minutes as %j", (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
