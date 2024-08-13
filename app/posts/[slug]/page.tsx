import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import BlogPostClient from '@/components/BlogPostClient'

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })
  if (!post) notFound()
  return post
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { id: true } })
  return posts.map((post) => ({ id: post.id }))
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  return <BlogPostClient post={post} />
}