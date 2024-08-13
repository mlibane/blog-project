import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import BlogPostClient from '@/components/BlogPostClient'

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
  if (!post) notFound()
  return post
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { slug: true } })
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <BlogPostClient post={post} />
}