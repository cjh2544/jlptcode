import NextAuth, { DefaultSession } from "next-auth"
import { getToken } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      role: Array<string> | undefined;
    } & DefaultSession["user"];
    paymentInfo?: UserPayment | undefined
  }

  interface User {
    role?: Array<string> | undefined;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    role: Array<string> | undefined;
  }
}