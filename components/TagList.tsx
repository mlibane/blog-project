import Link from 'next/link'

interface Tag {
  id: string;
  name: string;
}

interface TagListProps {
  tags: Tag[];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Link 
          key={tag.id} 
          href={`/tags/${tag.id}`}
          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm hover:bg-secondary/80"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}