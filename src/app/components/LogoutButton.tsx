"use client";

export default function LogoutButton({ user, handleLogout }) {
  return (
    <div>
      <p>Logged in as {user?.name || user?.email}</p>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
}
