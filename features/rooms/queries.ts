import "server-only";

import { prisma } from "@/lib/db";
import { buildRoomWhere, type RoomFilters } from "./filters";

export function listResources() {
  return prisma.resource.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, "pt-BR");

export async function listRooms(
  filters: RoomFilters,
  sortBy: "capacity" | "name" = "capacity",
) {
  const rooms = await prisma.room.findMany({
    where: buildRoomWhere(filters),
    orderBy: { capacity: "asc" },
    include: {
      resources: {
        select: { resource: { select: { name: true } } },
        orderBy: { resource: { name: "asc" } },
      },
    },
  });

  const mapped = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    resources: room.resources.map(({ resource }) => resource.name),
  }));
  return mapped.sort((a, b) =>
    sortBy === "name" ? byName(a, b) : a.capacity - b.capacity || byName(a, b),
  );
}

export async function listRoomOptions() {
  const rooms = await prisma.room.findMany({
    select: { id: true, name: true, capacity: true },
  });
  return rooms.sort(byName);
}

export async function getRoomForEdit(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      capacity: true,
      resources: { select: { resourceId: true } },
    },
  });
  if (!room) return null;
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    resourceIds: room.resources.map(({ resourceId }) => resourceId),
  };
}
