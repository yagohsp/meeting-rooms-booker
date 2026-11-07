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
