import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  // Retrieve current session
  const session = await getSession(context);

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin", // Redirects to NextAuth login page
        permanent: false,
      },
    };
  }

  // If user is logged in, returns session to page props
  return {
    props: { session },
  };
}

export default function ProtectedPage({ session }) {
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>This page is protected and visible only to users authenticated.</p>
    </div>
  );
}
