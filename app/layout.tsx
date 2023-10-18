import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { NextAuthProvider } from "@/providers/next-auth-provider";

import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  metadataBase: new URL(`https://nhkcgasset-app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`),
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
