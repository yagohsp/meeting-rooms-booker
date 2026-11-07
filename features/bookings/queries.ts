import "server-only";

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
