import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { NextAuthProvider } from "@/providers/next-auth-provider";
// import {
//   OktaAuth,
//   OktaAuthOptions,
//   TokenManagerInterface,
//   AccessToken,
//   IDToken,
//   UserClaims,
//   TokenParams,
// } from "@okta/okta-auth-js";
// import {
//   MyAuthClient,
//   MyTokenManager,
//   MyAccessToken,
//   MyIdToken,
//   MyUserInfo
// } from '@/lib/okta-js'

import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  metadataBase: new URL("https://nhkcgasset-app.narpha.click"),
  title: {
    default: "CGアセットストア",
    template: "%s | NHK CGアセットストア",
  },
  description: "NHK CGアセットストアCGアセットストアCGアセットストア",
  alternates: {
    canonical: "/",
    // languages: {
    //   'ja-JP': '/ja-JP',
    // },
  },
  openGraph: {
    title: {
      default: "CGアセットストア",
      template: "%s | NHK CGアセットストア",
    },
    ...commonMetadataOpenGraph,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const authClient: OktaAuth = MyAuthClient();
  // console.log(`authClient: ${authClient}`);
  // const tokenManager: TokenManagerInterface | null = MyTokenManager(authClient);
  // console.log(`tokenManager: ${tokenManager}`);
  // const accessToken: AccessToken | null = await MyAccessToken(tokenManager);
  // console.log(`accessToken: ${accessToken}`);
  // const idToken: IDToken | null = await MyIdToken(tokenManager);
  // console.log(`idToken: ${idToken}`);
  // const userInfo: UserClaims | null = await MyUserInfo(authClient, accessToken, idToken);
  // console.log(`userInfo: ${userInfo}`);

  // if (!accessToken || !idToken || !userInfo) {
  //   const tokenParams: TokenParams = {
  //     scopes: ["openid", "email", "custom_scope"],
  //   };
  //   authClient.token.getWithRedirect(tokenParams);
  //   // return;
  // }

  return (
    <NextAuthProvider>
      <html lang="ja">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <ToastProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  )
}
