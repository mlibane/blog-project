'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ul className="flex items-center justify-between">
          <li>
            <Link href="/" className="text-2xl font-bold">
              Nidix Blog
            </Link>
          </li>
          <li className="flex items-center space-x-4">
            <Link href="/" className={pathname === '/' ? 'text-blue-500' : ''}>
              Home
            </Link>
            <Link href="/posts" className={pathname === '/posts' ? 'text-blue-500' : ''}>
              Posts
            </Link>
            <Link href="/about" className={pathname === '/about' ? 'text-blue-500' : ''}>
              About
            </Link>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header