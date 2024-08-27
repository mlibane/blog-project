// app/layout.tsx

import { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import LoadingScreen from '@/components/LoadingScreen'
import NowPlaying from '@/components/NowPlaying'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: {
    default: 'Nidix - A serene space for thoughts and ideas',
    template: '%s | Nidix'
  },
  description: 'Nidix is a modern blogging platform designed for sharing insightful content across various topics. Join our community of writers and readers today.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nidix.xyz',
    siteName: 'Nidix',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nidix',
    creator: '@nidix',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=zodiak@400,500,700&f[]=cabinet-grotesk@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SpeedInsights />
        <Analytics/>
        <LoadingScreen />
        <Toaster />
        <Layout>
          {children}
          <NowPlaying />
        </Layout>
      </body>
    </html>
  )
}