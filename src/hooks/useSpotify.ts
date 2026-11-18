import { useState, useEffect, useCallback, useRef } from 'react';
import { SpotifyProfile, SpotifyPlayback } from '../types';
import {
  isSpotifyAuthenticated,
  initiateSpotifyLogin,
  handleSpotifyCallback,
  logoutSpotify,
  getShowProfileInRoom,
  setShowProfileInRoom as persistShowProfileInRoom,
} from '../services/spotifyAuth';
import {
  fetchSpotifyProfile,
  fetchCurrentPlayback,
  playSpotify,
  pauseSpotify,
  nextSpotify,
  previousSpotify,
  seekSpotify,
} from '../services/spotifyApi';

export function useSpotify() {
  const [isConnected, setIsConnected] = useState<boolean>(isSpotifyAuthenticated());
  const [userProfile, setUserProfile] = useState<SpotifyProfile | null>(null);
  const [playback, setPlayback] = useState<SpotifyPlayback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showProfileInRoom, setShowProfileInRoomState] = useState<boolean>(getShowProfileInRoom());

  const pollIntervalRef = useRef<number | null>(null);

  const refreshPlayback = useCallback(async () => {
    if (!isSpotifyAuthenticated()) {
      setIsConnected(false);
      return;
    }

    try {
      const data = await fetchCurrentPlayback();
      setPlayback(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error syncing Spotify';
      if (msg.includes('Not authenticated') || msg.includes('401')) {
        setIsConnected(false);
        setUserProfile(null);
        setPlayback(null);
      }
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('code')) {
          await handleSpotifyCallback();
          setIsConnected(true);
        }

        if (isSpotifyAuthenticated()) {
          setIsConnected(true);
          const profile = await fetchSpotifyProfile();
          setUserProfile(profile);
          await refreshPlayback();
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Spotify connection error';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [refreshPlayback]);

  useEffect(() => {
    if (!isConnected) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const startPolling = () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = window.setInterval(() => {
        if (document.visibilityState === 'visible') refreshPlayback();
      }, 3500);
    };

    startPolling();
    const handleVis = () => {
      if (document.visibilityState === 'visible') {
        refreshPlayback();
        startPolling();
      } else if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVis);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, [isConnected, refreshPlayback]);

  useEffect(() => {
    if (!isConnected || !playback?.isPlaying) return;
    const ticker = setInterval(() => {
      setPlayback((prev) => {
        if (!prev || !prev.isPlaying || !prev.track) return prev;
        const newProgress = Math.min(prev.progressMs + 1000, prev.track.durationMs);
        return { ...prev, progressMs: newProgress };
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [isConnected, playback?.isPlaying]);

  const login = useCallback(async (clientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await initiateSpotifyLogin(clientId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start login';
      setError(msg);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    logoutSpotify();
    setIsConnected(false);
    setUserProfile(null);
    setPlayback(null);
    setError(null);
  }, []);

  const setShowProfileInRoom = useCallback((val: boolean) => {
    setShowProfileInRoomState(val);
    persistShowProfileInRoom(val);
  }, []);

  const togglePlay = useCallback(async () => {
    if (!playback) return;
    try {
      if (playback.isPlaying) {
        await pauseSpotify();
        setPlayback((prev) => (prev ? { ...prev, isPlaying: false } : null));
      } else {
        await playSpotify();
        setPlayback((prev) => (prev ? { ...prev, isPlaying: true } : null));
      }
      setTimeout(refreshPlayback, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Playback control failed';
      setError(msg);
      throw err;
    }
  }, [playback, refreshPlayback]);

  const skipNext = useCallback(async () => {
    try {
      await nextSpotify();
      setTimeout(refreshPlayback, 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Skip next failed';
      setError(msg);
      throw err;
    }
  }, [refreshPlayback]);

  const skipPrev = useCallback(async () => {
    try {
      await previousSpotify();
      setTimeout(refreshPlayback, 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Skip previous failed';
      setError(msg);
      throw err;
    }
  }, [refreshPlayback]);

  const seek = useCallback(async (positionMs: number) => {
    try {
      setPlayback((prev) => (prev ? { ...prev, progressMs: positionMs } : null));
      await seekSpotify(positionMs);
      setTimeout(refreshPlayback, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Seek failed';
      setError(msg);
    }
  }, [refreshPlayback]);

  return {
    isConnected,
    userProfile,
    playback,
    isLoading,
    error,
    showProfileInRoom,
    setShowProfileInRoom,
    login,
    logout,
    togglePlay,
    skipNext,
    skipPrev,
    seek,
    refreshPlayback,
    clearError: () => setError(null),
  };
}
