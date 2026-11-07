"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

type NavLink = { href: string; label: string };

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap gap-1 text-sm max-sm:-mx-3">
      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                active && "bg-white/15 font-medium text-white",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
