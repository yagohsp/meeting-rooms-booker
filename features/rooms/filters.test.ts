import { describe, expect, it } from "vitest";
import {
  buildRoomWhere,
  keepKnownResources,
  parseRoomFilters,
} from "./filters";

describe("parseRoomFilters", () => {
  it("returns no filters for empty search params", () => {
    expect(parseRoomFilters({})).toEqual({
      minCapacity: undefined,
      resources: [],
    });
  });

  it("parses a positive integer capacity", () => {
    expect(parseRoomFilters({ capacidade: "8" }).minCapacity).toBe(8);
  });

  it.each(["0", "-3", "2.5", "abc", "", "0x10", "1e1", " 8 "])(
    "ignores invalid capacity %j",
    (capacidade) => {
      expect(parseRoomFilters({ capacidade }).minCapacity).toBeUndefined();
    },
  );

  it("uses the first capacity when repeated", () => {
    expect(parseRoomFilters({ capacidade: ["6", "10"] }).minCapacity).toBe(6);
  });

  it("accepts one or many resources, trimmed and deduplicated", () => {
    expect(parseRoomFilters({ recurso: "Projetor" }).resources).toEqual([
      "Projetor",
    ]);
    expect(
      parseRoomFilters({ recurso: ["Projetor", " TV ", "Projetor", ""] })
        .resources,
    ).toEqual(["Projetor", "TV"]);
  });
});

describe("keepKnownResources", () => {
  it("drops resources that do not exist", () => {
    expect(
      keepKnownResources(
        { minCapacity: 4, resources: ["Projetor", "Inexistente", "TV"] },
        ["Projetor", "TV", "Quadro branco"],
      ),
    ).toEqual({ minCapacity: 4, resources: ["Projetor", "TV"] });
  });

  it("limits the filter to the known resources", () => {
    const resources = Array.from({ length: 1000 }, (_, i) => `R${i}`);
    expect(keepKnownResources({ resources }, ["R1", "R2"]).resources).toEqual([
      "R1",
      "R2",
    ]);
  });
});

describe("buildRoomWhere", () => {
  it("matches every room when there are no filters", () => {
    expect(buildRoomWhere({ resources: [] })).toEqual({ AND: [] });
  });

  it("requires a minimum capacity and every selected resource", () => {
    expect(
      buildRoomWhere({ minCapacity: 8, resources: ["Projetor", "TV"] }),
    ).toEqual({
      capacity: { gte: 8 },
      AND: [
        { resources: { some: { resource: { name: "Projetor" } } } },
        { resources: { some: { resource: { name: "TV" } } } },
      ],
    });
  });
});
