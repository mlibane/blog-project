// lib/posts.ts
import prisma from './prisma'

export async function getLatestPosts(count = 3) {
  try {
    const posts = await prisma.post.findMany({
      take: count,
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true }
        },
        tags: true
      }
    });

    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      excerpt: post.content.substring(0, 150) + '...'
    }));
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return [];
  }
}