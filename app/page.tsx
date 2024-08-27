// app\page.tsx

'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NowPlaying from '@/components/NowPlaying'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="space-y-24">
      <section className="text-center py-12">
        <h1 className="font-zodiak text-5xl md:text-6xl font-bold mb-6">Welcome to Nidix</h1>
        <p className="font-satoshi text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">A serene space for thoughts and ideas</p>
        {session ? (
          <Button asChild size="lg">
            <Link href="/create-post">Create a New Post</Link>
          </Button>
        ) : (
          <div className="space-x-6">
            <Button asChild size="lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </section>
      
      <section>
        <h2 className="font-cabinet-grotesk text-3xl font-semibold mb-8">Latest Posts</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((post) => (
            <Card key={post} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-cabinet-grotesk text-2xl">Post Title</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-satoshi text-muted-foreground mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="font-satoshi text-sm text-muted-foreground mb-4">
                  By Author Name on {new Date().toLocaleDateString()}
                </p>
                <Button asChild variant="ghost">
                  <Link href={`/posts/${post}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}