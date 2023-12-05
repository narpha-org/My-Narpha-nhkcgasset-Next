import { Metadata } from 'next'

import { NextAuthProvider } from "@/providers/next-auth-provider";

import { ToastProvider } from '@/providers/toast-provider'
// import { ThemeProvider } from '@/providers/theme-provider'

import '@/styles/reset.css'
import '@/styles/tailwind-globals.css'
import '@/styles/my-style.scss'
import '@/styles/style.scss'
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP400 = Noto_Sans_JP({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

// const notoSansJP500 = Noto_Sans_JP({
//   weight: '500',
//   subsets: ['latin'],
//   display: 'swap',
// })

// const notoSansJP700 = Noto_Sans_JP({
//   weight: '700',
//   subsets: ['latin'],
//   display: 'swap',
// })

import { commonMetadataOpenGraph } from '@/app/shared-metadata'

export const metadata: Metadata = {
  metadataBase: new URL(`https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`),
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
            {children}
          </div>
          {/* <!-- wrapper --> */}
        </body>
      </html>
    </NextAuthProvider>
  )
}
