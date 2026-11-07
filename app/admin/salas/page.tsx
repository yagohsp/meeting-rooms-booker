import type { Metadata } from "next";
import { Eyebrow } from "@/components/eyebrow";
import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/features/auth/session";
import { listRooms } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Administrar salas" };

export default async function AdminRoomsPage() {
  await requireAdmin();
  const rooms = await listRooms({ resources: [] }, "name");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Eyebrow>Administração</Eyebrow>
          <h1 className="text-3xl font-medium tracking-tight">Salas</h1>
        </div>
        <Link href="/admin/salas/nova" className={cn(buttonVariants())}>
          Nova sala
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Sala</th>
              <th className="px-4 py-3 font-medium">Capacidade</th>
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
