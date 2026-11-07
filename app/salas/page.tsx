import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/features/auth/session";
import { RoomCard } from "@/features/rooms/components/room-card";
import { RoomFiltersForm } from "@/features/rooms/components/room-filters-form";
import { keepKnownResources, parseRoomFilters } from "@/features/rooms/filters";
import { listResources, listRooms } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Salas" };

export default async function RoomsPage({ searchParams }: PageProps<"/salas">) {
  await requireUser();
  const resources = await listResources();
  const filters = keepKnownResources(
    parseRoomFilters(await searchParams),
    resources.map((resource) => resource.name),
  );
  const rooms = await listRooms(filters);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">Salas</h1>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {rooms.length} {rooms.length === 1 ? "sala" : "salas"}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <aside
          className="lg:w-60 lg:shrink-0"
          aria-labelledby="filters-heading"
        >
          <h2 id="filters-heading" className="mb-4 text-lg font-semibold">
            Filtros
          </h2>
          <RoomFiltersForm filters={filters} resources={resources} />
        </aside>

        <section className="flex-1" aria-label="Resultados">
          {rooms.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <li key={room.id}>
                  <RoomCard room={room} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma sala atende aos filtros selecionados.
              </p>
              <Link
                href="/salas"
                className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
              >
                Limpar filtros
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
