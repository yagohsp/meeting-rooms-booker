import type { Metadata } from "next";
import { Eyebrow } from "@/components/eyebrow";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/features/auth/session";
import { saveRoom } from "@/features/rooms/actions";
import { RoomForm } from "@/features/rooms/components/room-form";
import { getRoomForEdit, listResources } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Editar sala" };

export default async function EditRoomPage({
  params,
}: PageProps<"/admin/salas/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [room, resources] = await Promise.all([
    getRoomForEdit(id),
    listResources(),
  ]);
  if (!room) notFound();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Eyebrow>Administração</Eyebrow>
        <h1 className="text-3xl font-medium tracking-tight">
          Editar {room.name}
        </h1>
      </div>
      <RoomForm
        action={saveRoom.bind(null, room.id)}
        resources={resources}
        initialValues={{
          name: room.name,
          capacity: String(room.capacity),
          resourceIds: room.resourceIds,
        }}
      />
    </div>
  );
}
