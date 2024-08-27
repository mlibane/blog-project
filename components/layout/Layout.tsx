// components/layout/Layout.tsx

'use client'

import { useState, useEffect } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from '@/components/session-provider'
import { Footer } from './Footer'
import LoadingScreen from '../LoadingScreen'

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasSeenLoadingScreen = sessionStorage.getItem('hasSeenLoadingScreen')
    
    if (!hasSeenLoadingScreen) {
      const timer = setTimeout(() => {
        setLoading(false)
        sessionStorage.setItem('hasSeenLoadingScreen', 'true')
      }, 3000) // Adjust time as needed

      return () => clearTimeout(timer)
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {loading && <LoadingScreen />}
        <div className={`flex min-h-screen bg-background ${loading ? 'hidden' : ''}`}>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}