import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader eyebrow="Administração" title="Nova sala" />
      <RoomForm action={saveRoom.bind(null, null)} resources={resources} />
    </div>
  );
}
