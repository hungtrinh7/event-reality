"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useUnifiedSession from "../components/Auth/useUnifiedSession";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, user, provider } = useUnifiedSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            My profile
          </h1>
          <p>{user?.email}</p>
        </div>
      </main>
    </div>
  );
}
