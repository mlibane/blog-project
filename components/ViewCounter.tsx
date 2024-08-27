import { Eye } from 'lucide-react'

interface ViewCounterProps {
  views: number;
}

export default function ViewCounter({ views }: ViewCounterProps) {
  return (
    <div className="flex items-center text-muted-foreground">
      <Eye className="h-4 w-4 mr-1" />
      {views} {views === 1 ? 'view' : 'views'}
    </div>
  )
}