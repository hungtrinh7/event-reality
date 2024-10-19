import useNextAuthSession from "./useNextAuthSession";
import useSupabaseSession from "./useSupabaseSession";

export default function useUnifiedSession() {
  const supabaseSession = useSupabaseSession(); // session for Supabase users
  const nextAuthSession = useNextAuthSession(); // session for Google users

  // If the user is logged in via NextAuth (Google)
  if (nextAuthSession) {
    localStorage.setItem("userEmail", nextAuthSession.user?.email ?? "");

    return {
      isAuthenticated: true,
      user: nextAuthSession.user,
      provider: "google",
    };
  }

  // If the user is connected via Supabase (email/password)
  if (supabaseSession) {
    localStorage.setItem("userEmail", supabaseSession.user?.email ?? "");

    return {
      isAuthenticated: true,
      user: supabaseSession.user,
      provider: "supabase",
    };
  }

  // No users logged in
  return {
    isAuthenticated: false,
    user: null,
    provider: null,
  };
}
