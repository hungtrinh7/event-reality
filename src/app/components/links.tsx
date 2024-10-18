"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";

export function Links() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === "/" ? "active" : ""}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === "/events" ? "active" : ""}`}
            href="/events"
          >
            Create new event
          </Link>
        </li>
        {status !== "authenticated" && (
          <li>
            <Link
              className={`link ${pathname === "/login" ? "active" : ""}`}
              href="/login"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
      {status === "authenticated" && <LogoutButton />}
    </nav>
  );
}
