import { SpotifyProfile, SpotifyPlayback, SpotifyTrack } from '../types';
import { getValidAccessToken } from './spotifyAuth';

const BASE_URL = 'https://api.spotify.com/v1';

async function spotifyFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getValidAccessToken();
  if (!token) throw new Error('Not authenticated with Spotify');

  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    const refreshedToken = await getValidAccessToken();
    if (refreshedToken) {
      return await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${refreshedToken}` },
      });
    }
  }
  return response;
}

export async function fetchSpotifyProfile(): Promise<SpotifyProfile> {
  const res = await spotifyFetch('/me');
  if (!res.ok) throw new Error(`Profile fetch error (${res.status})`);
  const data = await res.json();
  const avatarUrl = data.images && data.images.length > 0 ? data.images[0].url : null;

  return {
    id: data.id,
    displayName: data.display_name || 'Spotify User',
    avatarUrl,
    profileUrl: data.external_urls?.spotify || 'https://open.spotify.com',
    product: data.product,
    followers: data.followers?.total,
  };
}

export async function fetchCurrentPlayback(): Promise<SpotifyPlayback> {
  const res = await spotifyFetch('/me/player');
  if (res.status === 204 || res.status === 202) {
    return { isPlaying: false, progressMs: 0, track: null, deviceName: null, deviceType: null };
  }
  if (!res.ok) throw new Error(`Playback query returned ${res.status}`);

  const data = await res.json();
  const item = data.item;

  let track: SpotifyTrack | null = null;
  if (item) {
    const artistNames = item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist';
    const albumArtUrl = item.album?.images?.[0]?.url || null;
    track = {
      id: item.id || 'spotify-track',
      title: item.name || 'Untitled',
      artist: artistNames,
      albumName: item.album?.name || 'Spotify Album',
      albumArtUrl,
      durationMs: item.duration_ms || 0,
      spotifyUrl: item.external_urls?.spotify || 'https://open.spotify.com',
      uri: item.uri || '',
    };
  }

  return {
    isPlaying: !!data.is_playing,
    progressMs: data.progress_ms || 0,
    track,
    deviceName: data.device?.name || null,
    deviceType: data.device?.type || null,
  };
}

export async function playSpotify(): Promise<void> {
  const res = await spotifyFetch('/me/player/play', { method: 'PUT' });
  if (!res.ok && res.status !== 204) {
    if (res.status === 404) throw new Error('No active Spotify device found. Start Spotify on your device first.');
    if (res.status === 403) throw new Error('Playback control requires Spotify Premium.');
    throw new Error('Failed to resume playback');
  }
}

export async function pauseSpotify(): Promise<void> {
  const res = await spotifyFetch('/me/player/pause', { method: 'PUT' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to pause playback');
}

export async function nextSpotify(): Promise<void> {
  const res = await spotifyFetch('/me/player/next', { method: 'POST' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to skip track');
}

export async function previousSpotify(): Promise<void> {
  const res = await spotifyFetch('/me/player/previous', { method: 'POST' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to return to previous track');
}

export async function seekSpotify(positionMs: number): Promise<void> {
  const res = await spotifyFetch(`/me/player/seek?position_ms=${Math.floor(positionMs)}`, { method: 'PUT' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to seek track');
}
