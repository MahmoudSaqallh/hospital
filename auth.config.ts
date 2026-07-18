import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized() {
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone ?? null;
        token.nationalId = user.nationalId ?? null;
        token.accessToken = user.accessToken;
        token.role = user.role ?? "patient";
      }

      // After Google/Facebook OAuth, exchange for backend JWT
      if (account?.provider === "google" && account.id_token) {
        try {
          const { api } = await import("@/lib/api");
          const result = await api<{
            token: string;
            user: { id: number; name: string; email: string; phone?: string | null; role: string };
          }>("/auth/google", {
            method: "POST",
            body: { idToken: account.id_token },
          });
          token.accessToken = result.token;
          token.id = String(result.user.id);
          token.phone = result.user.phone ?? null;
          token.role = result.user.role;
          token.name = result.user.name;
          token.email = result.user.email;
        } catch {
          // keep OAuth session without backend token
        }
      }

      if (account?.provider === "facebook" && account.access_token) {
        try {
          const { api } = await import("@/lib/api");
          const result = await api<{
            token: string;
            user: { id: number; name: string; email: string; phone?: string | null; role: string };
          }>("/auth/facebook", {
            method: "POST",
            body: { accessToken: account.access_token },
          });
          token.accessToken = result.token;
          token.id = String(result.user.id);
          token.phone = result.user.phone ?? null;
          token.role = result.user.role;
          token.name = result.user.name;
          token.email = result.user.email;
        } catch {
          // keep OAuth session without backend token
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }
        if (typeof token.phone === "string" || token.phone === null) {
          session.user.phone = token.phone;
        }
        if (typeof token.nationalId === "string" || token.nationalId === null) {
          session.user.nationalId = token.nationalId;
        }
        session.user.role = token.role ?? "patient";
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
