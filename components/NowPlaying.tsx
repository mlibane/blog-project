// components/NowPlaying.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Maximize2, Minimize2, ExternalLink } from 'lucide-react'
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
  spotifyUrl?: string
}

export default function NowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const [isExpanded, setIsExpanded] = useLocalStorage('nowPlayingExpanded', false)
  const [shouldScroll, setShouldScroll] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const fetchNowPlaying = useCallback(() => {
    const timestamp = Date.now();
    const eventSource = new EventSource(`/api/spotify/sse?t=${timestamp}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setNowPlaying(data)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
      setTimeout(fetchNowPlaying, 5000)
    }

    eventSource.addEventListener('heartbeat', () => {
      console.log('Heartbeat received')
    })

    return () => {
      eventSource.close()
    }
  }, [])

  useEffect(() => {
    const eventSource = new EventSource('/api/spotify/sse')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setNowPlaying(data)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  useEffect(() => {
    const cleanup = fetchNowPlaying()
    return cleanup
  }, [fetchNowPlaying])

  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    if (nowPlaying?.isPlaying) {
      progressInterval.current = setInterval(() => {
        setNowPlaying(prev => {
          if (prev && prev.isPlaying) {
            const newProgress = Math.min((prev.progress || 0) + 1000, prev.duration || 0)
            return { ...prev, progress: newProgress }
          }
          return prev
        })
      }, 1000)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [nowPlaying?.isPlaying])

  const checkScrollNeeded = useCallback(() => {
    if (titleRef.current && nowPlaying?.name) {
      const shouldScrollNow = titleRef.current.scrollWidth > titleRef.current.clientWidth
      setShouldScroll(shouldScrollNow)
    }
  }, [nowPlaying?.name])

  useEffect(() => {
    checkScrollNeeded()
    window.addEventListener('resize', checkScrollNeeded)
    return () => window.removeEventListener('resize', checkScrollNeeded)
  }, [checkScrollNeeded, isExpanded])

  const addToPlaylist = async () => {
    if (!nowPlaying?.trackId) return;
    try {
      const response = await fetch('/api/spotify/add-to-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: nowPlaying.trackId })
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Added to Nidix playlist",
          description: `${nowPlaying.name} by ${nowPlaying.artist} has been added to your Nidix playlist.`,
        });
      } else if (data.needsAuth) {
        // Redirect to Spotify auth
        window.location.href = '/api/spotify/auth';
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error adding to playlist:', error);
      toast({
        title: "Error",
        description: "Failed to add track to playlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openSpotify = () => {
    if (nowPlaying?.spotifyUrl) {
      window.open(nowPlaying.spotifyUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Error",
        description: "Spotify URL not available. Please try again later.",
        variant: "destructive",
      });
    }
  };
    

  if (!nowPlaying || !nowPlaying.isPlaying) {
    return null
  }

  const progressPercentage = (nowPlaying.progress! / nowPlaying.duration!) * 100

  return (
    <Card className={`fixed bottom-4 right-4 ${isExpanded ? 'w-96 h-94' : 'w-80 h-24'} bg-zinc-900 text-white shadow-lg overflow-hidden transition-all duration-300`}>
      <CardContent className="p-2 h-full flex flex-col">
        <div className={`flex ${isExpanded ? 'flex-col' : 'items-center'} h-full`}>
          <div className={`relative ${isExpanded ? 'w-full h-64 mb-4' : 'w-20 h-20 mr-3'}`}>
            <Image
              src={nowPlaying.albumArt || ''}
              alt={nowPlaying.album || ''}
              layout="fill"
              objectFit="cover"
              quality={75}
            />
          </div>
          <div className={`flex-grow ${isExpanded ? 'mt-2' : ''} overflow-hidden`}>
            <div className="relative w-full overflow-hidden">
              <div 
                ref={titleRef}
                className={`font-bold text-sm ${shouldScroll ? 'animate-marquee' : ''}`}
                style={{
                  animationDuration: shouldScroll ? `${nowPlaying.name.length * 0.3}s` : '0s'
                }}
              >
                {shouldScroll ? (
                  <>
                    <span>{nowPlaying.name}</span>
                    <span className="px-4">{nowPlaying.name}</span>
                  </>
                ) : (
                  nowPlaying.name
                )}
              </div>
            </div>
            <p className="text-xs text-zinc-400 truncate">{nowPlaying.artist}</p>
            <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-1000 ease-linear" 
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
                onClick={() => window.open(nowPlaying.spotifyUrl, '_blank', 'noopener,noreferrer')}
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