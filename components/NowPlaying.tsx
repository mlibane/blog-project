'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Play, Pause, Maximize2, Minimize2, ExternalLink } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToast } from "@/components/ui/use-toast"

interface NowPlayingData {
  isPlaying: boolean
  name?: string
  artist?: string
  album?: string
  albumArt?: string
  trackId?: string
  duration?: number
  progress?: number
  error?: string
}

export default function NowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null)
  const [isExpanded, setIsExpanded] = useLocalStorage('nowPlayingExpanded', false)
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchNowPlaying = useCallback(async () => {
    try {
      const response = await fetch('/api/spotify/now-playing')
      if (!response.ok) {
        throw new Error('Failed to fetch now playing data')
      }
      const data = await response.json()
      setNowPlaying(data)
    } catch (error) {
      console.error('Error fetching now playing:', error)
      setNowPlaying({ isPlaying: false, error: 'Failed to fetch currently playing track' })
    }
  }, [])

  const fetchPlaylistId = useCallback(async () => {
    try {
      const response = await fetch('/api/spotify/playlist-id')
      if (!response.ok) {
        throw new Error('Failed to fetch playlist ID')
      }
      const data = await response.json()
      setPlaylistId(data.playlistId)
    } catch (error) {
      console.error('Error fetching playlist ID:', error)
    }
  }, [])

  useEffect(() => {
    fetchNowPlaying()
    fetchPlaylistId()
    const interval = setInterval(fetchNowPlaying, 5000)
    return () => clearInterval(interval)
  }, [fetchNowPlaying, fetchPlaylistId])

  const addToPlaylist = async () => {
    if (!nowPlaying?.trackId) return
    try {
      const response = await fetch('/api/spotify/add-to-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: nowPlaying.trackId })
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Added to Nidix playlist",
          description: `${nowPlaying.name} by ${nowPlaying.artist} has been added to your Nidix playlist.`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error adding to playlist:', error)
      toast({
        title: "Error",
        description: "Failed to add track to playlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openSpotify = () => {
    if (playlistId) {
      window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank', 'noopener,noreferrer')
    } else {
      toast({
        title: "Error",
        description: "Playlist ID not available. Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (nowPlaying?.error || !nowPlaying || !nowPlaying.isPlaying) {
    return null
  }

  const progressPercentage = (nowPlaying.progress! / nowPlaying.duration!) * 100
  const truncate = (str: string, n: number) => str.length > n ? str.substr(0, n-1) + '...' : str

  return (
    <Card className={`fixed bottom-4 right-4 ${isExpanded ? 'w-96 h-94' : 'w-80 h-24'} bg-zinc-900 text-white shadow-lg overflow-hidden transition-all duration-300`}>
      <CardContent className="p-2 h-full flex flex-col">
        <div className={`flex ${isExpanded ? 'flex-col' : 'items-center'} h-full`}>
          <img 
            src={nowPlaying.albumArt} 
            alt={nowPlaying.album} 
            className={`${isExpanded ? 'w-full h-64 object-cover mb-4' : 'w-20 h-20 object-cover mr-3'}`}
          />
          <div className={`flex-grow ${isExpanded ? 'mt-2' : ''}`}>
            <h3 className="font-bold text-sm truncate">{nowPlaying.name}</h3>
            <p className="text-xs text-zinc-400 truncate">{nowPlaying.artist}</p>
            <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
              <div 
                className="bg-green-500 h-1 rounded-full" 
                style={{width: `${progressPercentage}%`}}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>{formatTime(nowPlaying.progress!)}</span>
              <span>{formatTime(nowPlaying.duration!)}</span>
            </div>
          </div>
          <div className={`flex ${isExpanded ? 'justify-between w-full mt-4' : 'flex-col ml-2'}`}>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-zinc-800"
              onClick={addToPlaylist}
            >
              <PlusCircle size={16} />
            </Button>
            {isExpanded && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-white hover:bg-zinc-800"
                onClick={openSpotify}
              >
                <ExternalLink size={16} className="mr-2" />
                Open in Spotify
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-zinc-800"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}