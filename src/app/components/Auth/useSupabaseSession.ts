import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/initSupabase";

const useSupabaseSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data?.session);
      }
    };

    fetchSession();

    // Listener to update the session if it changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Properly unsubscribe from the event listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return session;
};

export default useSupabaseSession;
