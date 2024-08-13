'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Sign Up</h1>
      <Button onClick={() => signIn('github')}>Sign up with GitHub</Button>
      <Button onClick={() => signIn('google')} className="mt-2">Sign up with Google</Button>
    </div>
  )
}