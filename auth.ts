import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import type { Provider } from "next-auth/providers";
import { authConfig } from "@/auth.config";
import { api } from "@/lib/api";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      name: { label: "الاسم", type: "text" },
      phone: { label: "رقم الجوال", type: "text" },
      national_id: { label: "رقم الهوية", type: "text" },
    },
    async authorize(credentials) {
      const name = String(credentials?.name ?? "").trim();
      const phone = String(credentials?.phone ?? "").trim();
      const national_id = String(credentials?.national_id ?? "").trim();

      if (!name || !phone || !national_id) {
        return null;
      }

      try {
        const result = await api<{
          token: string;
          user: {
            id: number;
            name?: string;
            email: string;
            phone?: string | null;
            national_id?: string | null;
            role: string;
          };
        }>("/auth/patient-login", {
          method: "POST",
          body: { name, phone, national_id },
        });

        if (result.user.role !== "patient") {
          return null;
        }

        return {
          id: String(result.user.id),
          name: result.user.name ?? name,
          email: result.user.email,
          phone: result.user.phone ?? phone,
          nationalId: result.user.national_id ?? national_id,
          accessToken: result.token,
          role: result.user.role,
        };
      } catch {
        return null;
      }
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET ?? "dev-only-change-me-public-aid-society",
  providers,
});
