// app\profile\page.tsx

'use client'

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface UserProfile {
  name: string
  bio: string
  location: string
  website: string
  twitter: string
  github: string
  image: string
  followersCount: number
  followingCount: number
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
    image: '',
    followersCount: 0,
    followingCount: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin')
    } else if (session?.user) {
      fetchProfile()
    }
  }, [status, router, session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setIsLoading(true)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      setProfile({ ...profile, image: data.url })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      await update({ ...session, user: { ...session?.user, ...profile } })
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (!session) {
    return null
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <AvatarImage src={profile.image || ''} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <span className="text-white">Uploading...</span>
              </div>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={profile.bio} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={profile.location} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={profile.website} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" name="twitter" value={profile.twitter} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" name="github" value={profile.github} onChange={handleInputChange} />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{session.user?.email}</p>
              {profile.bio && <p className="text-center">{profile.bio}</p>}
              {profile.location && <p>{profile.location}</p>}
              {profile.website && <a href={`https://www.${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profile.website}</a>}
              {profile.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@{profile.twitter}</a>}
              {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profile.github}</a>}
              <div className="flex space-x-4">
                <p>Followers: {profile.followersCount}</p>
                <p>Following: {profile.followingCount}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}