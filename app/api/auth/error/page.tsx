// app\api\auth\error\page.tsx

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Authentication Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">An error occurred during authentication: {error}</p>
        <Button asChild>
          <Link href="/auth/signin">Try signing in again</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}