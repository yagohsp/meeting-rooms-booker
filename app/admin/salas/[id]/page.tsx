import type { Metadata } from "next";
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
      <h1 className="text-2xl font-semibold">Editar {room.name}</h1>
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
