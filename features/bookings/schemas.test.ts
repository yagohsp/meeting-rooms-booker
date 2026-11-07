import { describe, expect, it } from "vitest";
import { bookingInputSchema } from "./schemas";

const valid = {
  roomId: "room-1",
  date: "2026-11-10",
  start: "09:00",
  end: "10:30",
};

describe("bookingInputSchema", () => {
  it("converts São Paulo local times to UTC instants", () => {
    expect(bookingInputSchema.parse(valid)).toEqual({
      roomId: "room-1",
      startsAt: new Date("2026-11-10T12:00:00Z"),
      endsAt: new Date("2026-11-10T13:30:00Z"),
    });
  });

  it.each([
    ["roomId", ""],
    ["date", "2026-02-30"],
    ["date", "10/11/2026"],
    ["start", "24:00"],
    ["end", "9:00"],
  ])("rejects an invalid %s (%j)", (field, value) => {
    const result = bookingInputSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });
});
