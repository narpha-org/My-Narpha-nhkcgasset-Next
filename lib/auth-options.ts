import type { NextAuthOptions } from "next-auth";
import OktaProvider from "next-auth/providers/okta";
// import log from "logging-service";
import { Adapter } from "next-auth/adapters";
// import { FirestoreAdapter } from "@auth/firebase-adapter";

import { MyApolloAdapter } from "@/lib/auth-adp-my-apollo-adapter";
import { getClient as apolloServer } from "@/lib/apollo-server";
import { unknown } from "zod";
import { UpdateUserAuthCustomDocument } from "@/graphql/generated/graphql";
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
      if (process.env.NODE_ENV === "development") {
        console.log("in jwt", { user, token, account, profile });
      }

      if (user) {
        token.user = user;
        const u = user as any;
        token.role = u.roleCGAssetStore.role;
        token.roleDesc = u.roleCGAssetStore ? u.roleCGAssetStore.desc : "";
        token.rgstAffiDesc = u.registrantAffiliation
          ? u.registrantAffiliation.desc
          : "";
        token.rgstAffiCode = u.regist_affili_code;
        token.userId = u.id;
      }
      if (account) {
        // token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (profile) {
        token.OktaRoleDesc = (
          profile as { cgAssetStoreRoleDesc: string }
        ).cgAssetStoreRoleDesc;
        token.OktaRgstAffiDesc = (
          profile as { cgAssetStoreRgstAffiDesc: string }
        ).cgAssetStoreRgstAffiDesc;
        token.OktaRgstAffiCode = (
          profile as { cgAssetStoreRgstAffiCode: string }
        ).cgAssetStoreRgstAffiCode;
      }

      if (
        token.userId &&
        (token.OktaRoleDesc ||
          token.OktaRgstAffiDesc ||
          token.OktaRgstAffiCode) &&
        (token.OktaRoleDesc !== token.roleDesc ||
          token.OktaRgstAffiDesc != token.rgstAffiDesc ||
          token.OktaRgstAffiCode !== token.rgstAffiCode)
      ) {
        const ret = await apolloServer().mutate({
          mutation: UpdateUserAuthCustomDocument,
          variables: {
            user: {
              id: token.userId,
              cg_asset_store_role_desc: token.OktaRoleDesc,
              cg_asset_store_rgst_affi_desc: token.OktaRgstAffiDesc,
              cg_asset_store_rgst_affi_code: token.OktaRgstAffiCode,
            },
          },
        });

        const updU = ret.data.updateUserAuthCustom;

        token.role = updU.roleCGAssetStore.role;
        token.roleDesc = updU.roleCGAssetStore
          ? updU.roleCGAssetStore.desc
          : "";
        token.rgstAffiDesc = updU.registrantAffiliation
          ? updU.registrantAffiliation.desc
          : "";
        token.rgstAffiCode = updU.regist_affili_code;
      }

      let yourToken = token;

      yourToken.user = null;

      if (process.env.NODE_ENV === "development") {
        console.log("your token", yourToken);
      }

      return Promise.resolve(yourToken);
    },
    session: async ({ session, token }) => {
      if (process.env.NODE_ENV === "development") {
        console.log("in session", { session, token });
      }

      token.idToken;

      let yourSession = {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
          role: token.role,
          roleDesc: token.roleDesc,
          rgstAffiDesc: token.rgstAffiDesc,
          rgstAffiCode: token.rgstAffiCode,
        },
        idToken: token.idToken,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("your session", yourSession);
      }

      return Promise.resolve(yourSession);
    },
  },
};
