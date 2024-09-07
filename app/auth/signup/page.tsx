// app\auth\signup\page.tsx

'use client'

import { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { isValidUsername } from '@/lib/validation'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidUsername(name)) {
      setError('Invalid username. Use 3-20 characters, letters, numbers, underscores, or hyphens.')
      return
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await response.json()
    if (response.ok) {
      // Sign in the user after successful signup
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.ok) {
        router.push('/')
      } else {
        setError('Failed to sign in after signup')
      }
    } else {
      setError(data.error || 'Failed to sign up')
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <div className="mt-4 text-center">
          <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">Or sign up with:</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => handleOAuthSignIn('github')} variant="outline">GitHub</Button>
            <Button onClick={() => handleOAuthSignIn('google')} variant="outline">Google</Button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account? <Link href="/auth/signin" className="text-blue-500 hover:underline">Sign In</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}