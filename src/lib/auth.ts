import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const validEmail = process.env.AUTH_USER_EMAIL ?? "admin@ankhangfamily.com";
        const validPasswordHash =
          process.env.AUTH_USER_PASSWORD_HASH ??
          "$2b$10$Xh8dNmQmPsuvnaUR9AsIduNiqaVNOgGJWhZULj7yQKz0.zDcYMQyS";

        if (email !== validEmail) return null;

        const isValid = await bcrypt.compare(password, validPasswordHash);
        if (!isValid) return null;

        return {
          id: "1",
          name: "Gia đình An Khang",
          email: validEmail,
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
