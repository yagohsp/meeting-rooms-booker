import { describe, expect, it } from "vitest";
import { roomInputSchema } from "./schemas";

const valid = {
  name: "Sala Nova",
  capacity: "10",
  maxDurationMinutes: "120",
  resourceIds: ["a", "b"],
};

describe("roomInputSchema", () => {
  it("parses a valid room", () => {
    expect(roomInputSchema.parse(valid)).toEqual({
      name: "Sala Nova",
      capacity: 10,
      maxDurationMinutes: 120,
      resourceIds: ["a", "b"],
    });
  });

  it("trims the name and removes duplicated resources", () => {
    expect(
      roomInputSchema.parse({
        ...valid,
        name: "  Sala Nova  ",
        resourceIds: ["a", "a"],
      }),
    ).toMatchObject({ name: "Sala Nova", resourceIds: ["a"] });
  });

  it.each([
    ["name", "A"],
    ["name", "   "],
    ["name", "x".repeat(61)],
    ["capacity", "0"],
    ["capacity", "501"],
    ["capacity", "2.5"],
    ["capacity", "abc"],
    ["capacity", ""],
    ["maxDurationMinutes", ""],
    ["maxDurationMinutes", "10"],
    ["maxDurationMinutes", "721"],
    ["maxDurationMinutes", "1.5"],
  ])("rejects an invalid %s (%j)", (field, value) => {
    const result = roomInputSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });

  it("accepts a room without resources", () => {
    expect(roomInputSchema.parse({ ...valid, resourceIds: [] })).toMatchObject({
      resourceIds: [],
    });
  });
});
