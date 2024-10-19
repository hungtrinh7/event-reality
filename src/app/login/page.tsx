"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../../lib/initSupabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Calling Supabase login method with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push("/events");
      }
    } catch (error) {
      setErrorMessage("An error has occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white shadow-md"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>

        {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Sign in
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            signIn("google", { callbackUrl: "/events" });
          }}
          className="w-full py-2 mt-2 text-white bg-black rounded-md hover:bg-black"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
