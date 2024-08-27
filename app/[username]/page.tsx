import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import FollowButton from '@/components/FollowButton'

async function getUser(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
        mode: 'insensitive'
      }
    },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      followers: true,
      following: true,
    }
  })

  if (!user) {
    notFound()
  }

  return user
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const user = await getUser(params.username)
  const session = await getServerSession(authOptions)
  const isOwnProfile = session?.user?.email === user.email
  const isFollowing = session?.user ? user.followers.some(follower => follower.email === session.user.email) : false

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.image || ''} alt={user.name || ''} />
          <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-4 mt-2">
            <p>Followers: {user.followers.length}</p>
            <p>Following: {user.following.length}</p>
          </div>
        </div>
        {!isOwnProfile && session && (
          <FollowButton userId={user.id} initialIsFollowing={isFollowing} />
        )}
      </CardHeader>
      <CardContent>
        {user.bio && <p className="mb-4">{user.bio}</p>}
        {user.location && <p className="mb-2">Location: {user.location}</p>}
        {user.website && (
          <p className="mb-2">
            Website: <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{user.website}</a>
          </p>
        )}
        {user.twitter && (
          <p className="mb-2">
            Twitter: <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@{user.twitter}</a>
          </p>
        )}
        {user.github && (
          <p className="mb-4">
            GitHub: <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{user.github}</a>
          </p>
        )}
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {user.posts.length > 0 ? (
          <ul className="space-y-2">
            {user.posts.map(post => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>This user hasn't published any posts yet.</p>
        )}
      </CardContent>
    </Card>
  )
}