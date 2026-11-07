import { z } from "zod";
import type { Prisma } from "@/lib/generated/prisma/client";

export type RoomFilters = {
  minCapacity?: number;
  resources: string[];
};

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: unknown) => (Array.isArray(value) ? value[0] : value);
const list = (value: unknown) => (value === undefined ? [] : [value].flat());

const roomFiltersSchema = z.object({
  capacidade: z
    .preprocess(first, z.coerce.number().int().positive())
    .optional()
    .catch(undefined),
  recurso: z
    .preprocess(list, z.array(z.string().trim()))
    .transform((names) => [...new Set(names.filter(Boolean))])
    .catch([]),
});

export function parseRoomFilters(searchParams: SearchParams): RoomFilters {
  const { capacidade, recurso } = roomFiltersSchema.parse(searchParams);
  return { minCapacity: capacidade, resources: recurso };
}

export function buildRoomWhere(filters: RoomFilters): Prisma.RoomWhereInput {
  return {
    ...(filters.minCapacity && { capacity: { gte: filters.minCapacity } }),
    AND: filters.resources.map((name) => ({
      resources: { some: { resource: { name } } },
    })),
  };
}
