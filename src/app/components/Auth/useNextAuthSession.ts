import { useSession } from "next-auth/react";

const useNextAuthSession = () => {
  const { data: session } = useSession();

  return session;
};

export default useNextAuthSession;
