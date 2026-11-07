import Link from "next/link";
import { getCurrentUser, isAdmin } from "@/features/auth/session";

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
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
