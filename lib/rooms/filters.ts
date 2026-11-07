import type { Prisma } from "@/lib/generated/prisma/client";

export type RoomFilters = {
  minCapacity?: number;
  resources: string[];
};

type SearchParams = Record<string, string | string[] | undefined>;

const toArray = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export function parseRoomFilters(searchParams: SearchParams): RoomFilters {
  const [rawCapacity] = toArray(searchParams.capacidade);
  const capacity = Number(rawCapacity);
  const minCapacity =
    rawCapacity && Number.isInteger(capacity) && capacity > 0
      ? capacity
      : undefined;

  const resources = [
    ...new Set(
      toArray(searchParams.recurso)
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  ];

  return { minCapacity, resources };
}

export function buildRoomWhere(filters: RoomFilters): Prisma.RoomWhereInput {
  return {
    ...(filters.minCapacity && { capacity: { gte: filters.minCapacity } }),
    AND: filters.resources.map((name) => ({
      resources: { some: { resource: { name } } },
    })),
  };
}
