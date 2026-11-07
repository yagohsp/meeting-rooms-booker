import "server-only";

import { prisma } from "@/lib/db";
import { buildRoomWhere, type RoomFilters } from "./filters";

export function listResources() {
  return prisma.resource.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function listRooms(filters: RoomFilters) {
  const rooms = await prisma.room.findMany({
    where: buildRoomWhere(filters),
    orderBy: [{ capacity: "asc" }, { name: "asc" }],
    include: {
      resources: {
        select: { resource: { select: { name: true } } },
        orderBy: { resource: { name: "asc" } },
      },
    },
  });

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    resources: room.resources.map(({ resource }) => resource.name),
  }));
}

export function listRoomOptions() {
  return prisma.room.findMany({
    select: { id: true, name: true, capacity: true },
    orderBy: { name: "asc" },
  });
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
