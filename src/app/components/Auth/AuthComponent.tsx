import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthComponent() {
  // Utilisation du hook pour récupérer la session
  const { data: session, status } = useSession();

  // Affiche un message de chargement pendant que l'état de la session est en cours de vérification
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Si l'utilisateur est connecté, on affiche son email et un bouton pour se déconnecter
  if (status === "authenticated") {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, on affiche un bouton pour se connecter
  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
