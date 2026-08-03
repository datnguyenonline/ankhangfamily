import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByLogin } from "@/lib/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Tên đăng nhập", type: "text" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;

        if (!username || !password) return null;

        const user = await findUserByLogin(username, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? `${user.username}@ankhangfamily.local`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/login";
      const isPublicAsset =
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.includes(".");

      if (isPublicAsset) return true;
      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
