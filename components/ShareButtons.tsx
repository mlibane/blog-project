// components\ShareButtons.tsx

'use client'

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const { toast } = useToast()

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied",
        description: "The post URL has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "An error occurred while copying the link.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex space-x-2">
      <Button onClick={() => window.open(shareUrls.twitter, '_blank')} variant="outline">
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      <Button onClick={() => window.open(shareUrls.facebook, '_blank')} variant="outline">
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      <Button onClick={() => window.open(shareUrls.linkedin, '_blank')} variant="outline">
        <Linkedin className="h-4 w-4 mr-2" />
        LinkedIn
      </Button>
      <Button onClick={copyToClipboard} variant="outline">
        <Link className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  )
}