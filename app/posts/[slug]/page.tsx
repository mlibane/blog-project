// app\posts\[slug]\page.tsx

import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Comments from '@/components/Comments'
import LikeButton from '@/components/LikeButton'
import ShareButtons from '@/components/ShareButtons'
import AuthorInfo from '@/components/AuthorInfo'
import RelatedPosts from '@/components/RelatedPosts'
import TagList from '@/components/TagList'
import ViewCounter from '@/components/ViewCounter'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"

async function getPost(slugOrId: string) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: { 
        author: { 
          select: { 
            name: true, 
            image: true,
            _count: {
              select: { followers: true, following: true, posts: true }
            }
          } 
        },
        likes: {
          include: {
            user: {
              select: { id: true }
            }
          }
        },
        tags: true,
      },
    });

    if (!post) {
      return null;
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return {
      ...post,
      likedBy: post.likes.map(like => like.user)
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }

  const isLiked = session?.user ? post.likedBy.some(like => like.id === session.user.id) : false;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
            <AuthorInfo 
              author={post.author} 
              date={post.createdAt} 
              postCount={post.author._count.posts}
              followerCount={post.author._count.followers}
              followingCount={post.author._count.following}
            />
          </CardHeader>
          <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <LikeButton postId={post.id} initialLikeCount={post.likedBy.length} initialIsLiked={isLiked} />
              <ViewCounter views={post.views} />
            </div>
            <TagList tags={post.tags} />
          </CardFooter>
        </Card>
      
      <ShareButtons url={`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.slug}`} title={post.title} />
      
      <RelatedPosts currentPostId={post.id} tags={post.tags.map(tag => tag.id)} />
      
      <Comments postId={post.id} />
    </div>
  </div>
  );
}