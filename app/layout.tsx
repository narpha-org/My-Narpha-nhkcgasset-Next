// import { ClerkProvider } from '@clerk/nextjs'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { commonMetadataOpenGraph } from '@/app/shared-metadata'
export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Dashboard",
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
      default: "Dashboard",
      template: "%s | NHK CGアセットストア",
    },
    ...commonMetadataOpenGraph,
  }

  // description: "NHK CGアセットストアCGアセットストアCGアセットストア",
  // alternates: {
  //   canonical: '/',
  //   // languages: {
  //   //   'ja-JP': '/ja-JP',
  //   // },
  // },
  // openGraph: {
  //   title: {
  //     default: "Dashboard",
  //     template: "%s | NHK CGアセットストア",
  //   },
  //   description: 'NHK CGアセットストアCGアセットストアCGアセットストア',
  //   url: 'https://example.com',
  //   siteName: 'NHK CGアセットストア',
  //   images: ['/path-to-your-image.jpg'],
  //   locale: 'ja-JP',
  //   type: 'website',
  // },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
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
    // </ClerkProvider>
  )
}
