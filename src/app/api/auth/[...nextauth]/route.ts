import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "../../../../../lib/initSupabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("JWT Callback", { token, account });
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback", { session, token });
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Checks if user already exists in database
        const { data: existingUser, error: selectError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email);

        if (selectError) {
          throw new Error(`Error selecting user : ${selectError.message}`);
        }

        // If the user does not exist, insert it
        if (existingUser.length === 0) {
          const { data: insertedUser, error: insertError } = await supabase
            .from("users")
            .insert([{ email: user.email, name: user.name, image: user.image }])
            .select();

          if (insertError) {
            throw new Error(`Error inserting user : ${insertError.message}`);
          }
        }

        // If everything is ok, authorize authentication
        return true;
      } catch (error) {
        console.error("An error has occurred :", error.message);
        return false; // Blocks authentication in case of error
      }
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
