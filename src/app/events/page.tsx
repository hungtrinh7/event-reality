"use client";

import { useSession } from "next-auth/react";
import Create from "./Create";
import List from "./List";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <p>Email: {session.user?.email}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex gap-4 items-center flex-col">
            <Create />
            <List />
          </div>
        </main>
      </div>
    </>
  );
}
