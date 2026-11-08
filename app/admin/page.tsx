import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/auth/session";

export default async function AdminPage() {
  await requireAdmin();
  redirect("/admin/salas");
}
