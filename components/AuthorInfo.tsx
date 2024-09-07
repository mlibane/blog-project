// components\AuthorInfo.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'

interface AuthorInfoProps {
  author: {
    name: string;
    image: string | null;
  };
  date: Date;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export default function AuthorInfo({ author, date, postCount, followerCount, followingCount }: AuthorInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={author.image || ''} alt={author.name} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <Link href={`/${author.name}`} className="font-semibold hover:underline">
          {author.name}
        </Link>
        <p className="text-sm text-muted-foreground">{date.toLocaleDateString()}</p>
        <p className="text-sm text-muted-foreground">
          {postCount} posts · {followerCount} followers · {followingCount} following
        </p>
      </div>
    </div>
  )
}