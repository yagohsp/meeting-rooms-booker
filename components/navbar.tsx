import { getCurrentUser, isAdmin } from "@/features/auth/session";
import { NavLinks } from "./nav-links";

const LINKS = [
  { href: "/salas", label: "Salas" },
  { href: "/reservar", label: "Reservar" },
  { href: "/minhas-reservas", label: "Minhas reservas" },
];

export async function Navbar() {
  const links = isAdmin(await getCurrentUser())
    ? [...LINKS, { href: "/admin/salas", label: "Admin" }]
    : LINKS;

  return (
    <nav aria-label="Principal">
      <NavLinks links={links} />
    </nav>
  );
}
