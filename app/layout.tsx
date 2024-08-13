import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/session-provider'
import PlausibleAnalytics from '@/components/PlausibleAnalytics'


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <PlausibleAnalytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}