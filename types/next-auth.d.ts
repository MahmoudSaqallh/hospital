import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    phone?: string | null;
    nationalId?: string | null;
    accessToken?: string;
    role?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      nationalId?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string | null;
    nationalId?: string | null;
    accessToken?: string;
    role?: string | null;
  }
}
