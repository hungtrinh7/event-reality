"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { signOut } from "next-auth/react";
import useUnifiedSession from "./Auth/useUnifiedSession";
import { supabase } from "../../../lib/initSupabase";

export function Links() {
  const pathname = usePathname();
  const { isAuthenticated, user, provider } = useUnifiedSession();

  const handleSupabaseLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNextAuthLogout = () => {
    signOut();
  };

  const handleLogout = () => {
    if (provider === "google") {
      handleNextAuthLogout();
    } else if (provider === "supabase") {
      handleSupabaseLogout();
    }
  };

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
        {!isAuthenticated && (
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
      {isAuthenticated && (
        <LogoutButton user={user} handleLogout={handleLogout} />
      )}
    </nav>
  );
}
