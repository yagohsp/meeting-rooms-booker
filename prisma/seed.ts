import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";
import { todayInSaoPaulo, zonedDateTimeToUtc } from "../lib/time";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

const RESOURCES = ["Projetor", "TV", "Videoconferência", "Quadro branco"];

const ROOMS = [
  {
    name: "Sala Ágata",
    capacity: 4,
    maxDurationMinutes: 120,
    resources: ["TV", "Quadro branco"],
  },
  {
    name: "Sala Berilo",
    capacity: 6,
    maxDurationMinutes: 120,
    resources: ["Projetor", "Quadro branco"],
  },
  {
    name: "Sala Cristal",
    capacity: 8,
    maxDurationMinutes: 180,
    resources: ["TV", "Videoconferência"],
  },
  {
    name: "Sala Diamante",
    capacity: 12,
    maxDurationMinutes: 240,
    resources: ["Projetor", "Videoconferência", "Quadro branco"],
  },
  {
    name: "Auditório Esmeralda",
    capacity: 30,
    maxDurationMinutes: 480,
    resources: ["Projetor", "Videoconferência"],
  },
  { name: "Sala Foco", capacity: 2, maxDurationMinutes: 60, resources: [] },
];

const USERS = [
  { name: "Daiane Pereira", role: "USER" },
  { name: "Bruno Lima", role: "USER" },
  { name: "Yago Santos", role: "ADMIN" },
] as const;

function nextBusinessDay(n: number): string {
  const day = new Date(`${todayInSaoPaulo()}T12:00:00Z`);
  let found = 0;
  while (found < n) {
    day.setUTCDate(day.getUTCDate() + 1);
    const weekday = day.getUTCDay();
    if (weekday !== 0 && weekday !== 6) found++;
  }
  return day.toISOString().slice(0, 10);
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.roomResource.deleteMany();
  await prisma.room.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  const resources = new Map<string, string>();
  for (const name of RESOURCES) {
    const resource = await prisma.resource.create({ data: { name } });
    resources.set(name, resource.id);
  }

  const rooms = new Map<string, string>();
  for (const room of ROOMS) {
    const created = await prisma.room.create({
      data: {
        name: room.name,
        capacity: room.capacity,
        maxDurationMinutes: room.maxDurationMinutes,
        resources: {
          create: room.resources.map((name) => ({
            resourceId: resources.get(name)!,
          })),
        },
      },
    });
    rooms.set(room.name, created.id);
  }

  const users = new Map<string, string>();
  for (const user of USERS) {
    const created = await prisma.user.create({ data: user });
    users.set(user.name, created.id);
  }

  const d1 = nextBusinessDay(1);
  const d2 = nextBusinessDay(2);
  await prisma.booking.createMany({
    data: [
      {
        roomId: rooms.get("Sala Diamante")!,
        userId: users.get("Daiane Pereira")!,
        startsAt: zonedDateTimeToUtc(d1, "10:00"),
        endsAt: zonedDateTimeToUtc(d1, "11:00"),
      },
      {
        roomId: rooms.get("Sala Cristal")!,
        userId: users.get("Bruno Lima")!,
        startsAt: zonedDateTimeToUtc(d1, "14:00"),
        endsAt: zonedDateTimeToUtc(d1, "15:30"),
      },
      {
        roomId: rooms.get("Sala Berilo")!,
        userId: users.get("Daiane Pereira")!,
        startsAt: zonedDateTimeToUtc(d2, "09:00"),
        endsAt: zonedDateTimeToUtc(d2, "10:00"),
      },
    ],
  });

  console.log(
    `Seeded ${ROOMS.length} rooms, ${USERS.length} users and 3 bookings.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
