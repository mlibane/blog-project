// app\auth\signin\page.tsx

'use client'

import { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result?.error) {
      setError(result.error)
    } else if (result?.ok) {
      router.push('/')
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <div className="mt-4 text-center">
          <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">Or sign in with:</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => handleOAuthSignIn('github')} variant="outline">GitHub</Button>
            <Button onClick={() => handleOAuthSignIn('google')} variant="outline">Google</Button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}