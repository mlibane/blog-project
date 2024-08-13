import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UtterancesComments from '@/components/blog/UtterancesComments'
import Comments from '@/components/blog/Comments'

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })
  if (!post) notFound()
  return post
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-4">By {post.author.name}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose lg:prose-xl mb-8" />
      
      <h2 className="text-2xl font-bold mb-4">GitHub Comments</h2>
      <UtterancesComments
        repo="mlibane/nidix"
        issueTerm={`Post: ${post.id}`}
        label="comments"
      />
      
      <Comments postId={post.id} />
    </div>
  )
}