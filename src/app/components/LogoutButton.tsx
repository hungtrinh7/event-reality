"use client";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface dataLogoutProps {
  handleLogout: () => void;
  user: User | undefined | null;
}

export default function LogoutButton({ user, handleLogout }: dataLogoutProps) {
  return (
    <div>
      <p>Logged in as {user?.name || user?.email}</p>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
}
