import { NextAuthProvider } from "@/providers/next-auth-provider";
import { ToastProvider } from '@/providers/toast-provider'

import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';

import AdminNavbar from '@/components/admin-navbar'
import { isServerRoleAdmin } from "@/lib/check-role-server";
import AdminUnauthorized from "@/app/unauthorized-admin";

// import '@/styles/reset.css'
import '@/styles/tailwind-globals.css'
// import '@/styles/style.scss'
// import '@/styles/my-style.scss'
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP400 = Noto_Sans_JP({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session: Session | null = await getServerSession(authOptions)

  if (!session || !session?.user || !session?.user.name) {
    redirect('/sign-in');
  }

  if (await isServerRoleAdmin() === false) {
    return <AdminUnauthorized />;
  }

  return (
    <NextAuthProvider>
      {/* <!doctype html> */}
      <html lang="ja">
        <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
          <meta charSet="utf-8" />
          <meta name="description" content="" />
          <meta name="keywords" content="" />
          <meta property="og:title" content="" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="" />
          <meta property="og:url" content="https://" />
          <meta property="og:site_name" content="" />
          <meta property="og:description" content="" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="viewport" content="width=device-width, minimum-scale=0.25, maximum-scale=1.6, user-scalable=yes" />
          {/* <meta name="format-detection" content="telephone=no" /> */}
          <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
          {/* <title>OFFICIAL SITE</title> */}
          {/* <link href="assets/css/reset.css" type="text/css" rel="stylesheet" media="all" />
          <link href="assets/css/style.css" type="text/css" rel="stylesheet" media="all" /> */}
          <link rel="apple-touch-icon-precomposed" href="/assets/images/favicon.ico" />
          <link rel="shortcut icon" href="" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>

        <body>
          <ToastProvider />
          <div id="wrapper">
            <AdminNavbar />
            {children}
          </div>
          {/* <!-- wrapper --> */}
        </body>
      </html>
    </NextAuthProvider>
  );
};
