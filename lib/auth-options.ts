import type { NextAuthOptions } from "next-auth";
import OktaProvider from "next-auth/providers/okta";
// import log from "logging-service";
import { Adapter } from "next-auth/adapters";
// import { FirestoreAdapter } from "@auth/firebase-adapter";

import { MyApolloAdapter } from "@/lib/auth-adp-my-apollo-adapter";
import { getClient as apolloServer } from "@/lib/apollo-server";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaAdapter } from "@/lib/auth-adp-prisma-adapter";
// import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  // logger: {
  //   error(code, metadata) {
  //     log.error(code, metadata);
  //   },
  //   warn(code) {
  //     log.warn(code);
  //   },
  //   debug(code, metadata) {
  //     log.debug(code, metadata);
  //   },
  // },
  providers: [
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID as string,
      clientSecret: process.env.OKTA_CLIENT_SECRET as string,
      issuer: process.env.OKTA_ISSUER,
    }),
  ],
  adapter: MyApolloAdapter(apolloServer) as Adapter,
  // adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      // 注意: トークンをログ出力してはダメです。
      console.log("in jwt", { user, token, account, profile });

      if (user) {
        token.user = user;
        const u = user as any;
        token.role = u.roleCGAssetStore.role;
        token.roleDesc = u.roleCGAssetStore.desc;
        token.userId = u.id;
      }
      if (account) {
        // token.accessToken = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log("in session", { session, token });
      token.accessToken;
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
          role: token.role,
          roleDesc: token.roleDesc,
        },
      };
    },
  },
};
