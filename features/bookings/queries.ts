import "server-only";

import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export function findOverlappingBookings(
  db: Prisma.TransactionClient,
  roomId: string,
  startsAt: Date,
  endsAt: Date,
) {
  return db.booking.findMany({
    where: {
      roomId,
      cancelledAt: null,
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
    select: { startsAt: true, endsAt: true },
    orderBy: { startsAt: "asc" },
  });
}

export function listUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    select: {
      id: true,
      startsAt: true,
      endsAt: true,
      cancelledAt: true,
      room: { select: { name: true } },
    },
    orderBy: { startsAt: "asc" },
  });
}
