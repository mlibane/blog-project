// lib/spotify.ts

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
let accessToken: string | null = null;
let tokenExpirationTime = 0;

async function refreshAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpirationTime = Date.now() + data.expires_in * 1000;
}

async function getAccessToken() {
  if (!accessToken || Date.now() > tokenExpirationTime) {
    await refreshAccessToken();
  }
  return accessToken;
}

export async function getCurrentlyPlaying(forceRefresh = false) {
  try {
    if (forceRefresh) {
      await refreshAccessToken();
    }
    const token = await getAccessToken();
    const response = await fetch(`${SPOTIFY_API_URL}/me/player/currently-playing`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    if (response.status === 204) {
      return { isPlaying: false };
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch now playing: ${response.status}`);
    }

    const data = await response.json();

    if (data.is_playing) {
      const result = {
        isPlaying: true,
        name: data.item.name,
        artist: data.item.artists.map((a: any) => a.name).join(', '),
        album: data.item.album.name,
        albumArt: data.item.album.images[0].url,
        trackId: data.item.id,
        duration: data.item.duration_ms,
        progress: data.progress_ms,
        timestamp: Date.now(),
        spotifyUrl: data.item.external_urls.spotify,
      };
      console.log(`Now playing: ${result.name} by ${result.artist} (${formatTime(result.duration)})`);
      return result;
    } else {
      return { isPlaying: false };
    }
  } catch (error) {
    console.error('Error getting currently playing:', error);
    return { isPlaying: false, error: 'Failed to fetch currently playing track' };
  }
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function addToNidixPlaylist(trackId: string) {
  try {
    const token = await getAccessToken();
    
    // First, get user's playlists
    const playlistsResponse = await fetch(`${SPOTIFY_API_URL}/me/playlists`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const playlistsData = await playlistsResponse.json();
    let nidixPlaylist = playlistsData.items.find((playlist: any) => playlist.name === 'Nidix');

    if (!nidixPlaylist) {
      // Create the playlist if it doesn't exist
      const createPlaylistResponse = await fetch(`${SPOTIFY_API_URL}/me/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Nidix',
          description: 'Created by Nidix app',
          public: false
        })
      });
      nidixPlaylist = await createPlaylistResponse.json();
    }

    // Add the track to the playlist
    const addTrackResponse = await fetch(`${SPOTIFY_API_URL}/playlists/${nidixPlaylist.id}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`]
      })
    });

    if (!addTrackResponse.ok) {
      throw new Error('Failed to add track to playlist');
    }

    return { success: true, playlistId: nidixPlaylist.id };
  } catch (error) {
    console.error('Error adding to Nidix playlist:', error);
    return { success: false, error: 'Failed to add track to playlist' };
  }
}