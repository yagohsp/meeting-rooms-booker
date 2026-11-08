import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/features/auth/session";
import { listRooms } from "@/features/rooms/queries";
import { formatDuration } from "@/lib/time";

export const metadata: Metadata = { title: "Administrar salas" };

export default async function AdminRoomsPage({
  searchParams,
}: PageProps<"/admin/salas">) {
  await requireAdmin();
  const { sala, excedentes } = await searchParams;
  const exceeding = Number(excedentes);
  const rooms = await listRooms({ resources: [] }, "name");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        eyebrow="Administração"
        title="Salas"
        action={
          <Link href="/admin/salas/nova" className={cn(buttonVariants())}>
            Nova sala
          </Link>
        }
      />

      {typeof sala === "string" &&
        Number.isInteger(exceeding) &&
        exceeding > 0 && (
          <p
            role="status"
            className="rounded-lg border border-brand-orange/40 bg-brand-orange/10 p-3 text-sm"
          >
            {sala} foi salva.{" "}
            {exceeding === 1
              ? "1 reserva futura passa do novo limite e foi mantida."
              : `${exceeding} reservas futuras passam do novo limite e foram mantidas.`}
          </p>
        )}

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Sala</th>
              <th className="px-4 py-3 font-medium">Capacidade</th>
              <th className="px-4 py-3 font-medium">Duração máx.</th>
              <th className="px-4 py-3 font-medium">Recursos</th>
              <th className="px-4 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-4 py-3 font-medium">{room.name}</td>
                <td className="px-4 py-3">{room.capacity}</td>
                <td className="px-4 py-3">
                  {formatDuration(room.maxDurationMinutes)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {room.resources.join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/salas/${room.id}`}
                    className="text-brand-link underline-offset-4 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
