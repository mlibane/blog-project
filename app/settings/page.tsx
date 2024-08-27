'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface UserSettings {
  email: string
  notifications: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
  displayName: string
  bio: string
  privacyMode: 'public' | 'private'
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    notifications: true,
    theme: 'system',
    language: 'en',
    displayName: '',
    bio: '',
    privacyMode: 'public'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user settings",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast({
          title: "Error",
          description: "An error occurred while fetching settings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchSettings()
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  const handleSwitchChange = (checked: boolean, name: string) => {
    setSettings({ ...settings, [name]: checked })
  }

  const handleSelectChange = (value: string, name: string) => {
    setSettings({ ...settings, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings updated successfully",
        })
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={settings.email} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" name="displayName" value={settings.displayName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={settings.bio} onChange={handleInputChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSwitchChange(checked, 'notifications')}
            />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => handleSelectChange(value, 'theme')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSelectChange(value, 'language')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="privacyMode">Privacy Mode</Label>
            <Select
              value={settings.privacyMode}
              onValueChange={(value) => handleSelectChange(value, 'privacyMode')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select privacy mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}