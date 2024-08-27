import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-display">Nidix</Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/posts" className="hover:underline">Posts</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Button asChild variant="ghost"><Link href="/auth/signin">Sign In</Link></Button></li>
            <li><Button asChild><Link href="/auth/signup">Sign Up</Link></Button></li>
            <li><ModeToggle /></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}