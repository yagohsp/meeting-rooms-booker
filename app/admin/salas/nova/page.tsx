import type { Metadata } from "next";
import { requireAdmin } from "@/features/auth/session";
import { saveRoom } from "@/features/rooms/actions";
import { RoomForm } from "@/features/rooms/components/room-form";
import { listResources } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Nova sala" };

export default async function NewRoomPage() {
  await requireAdmin();
  const resources = await listResources();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-2xl font-semibold">Nova sala</h1>
      <RoomForm action={saveRoom.bind(null, null)} resources={resources} />
    </div>
  );
}
