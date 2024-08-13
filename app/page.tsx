import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const LatestPosts = dynamic(() => import('@/components/blog/LatestPosts'), {
  loading: () => <p>Loading latest posts...</p>,
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Nidix</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LatestPosts />
      </Suspense>
    </main>
  )
}