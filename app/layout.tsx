import { SessionProvider } from '@/components/session-provider'
import { ThemeProvider } from '@/components/theme-provider'
import SkipToContent from '@/components/SkipToContent'
import PlausibleAnalytics from '@/components/PlausibleAnalytics'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
            <PlausibleAnalytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}