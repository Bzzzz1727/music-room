import { useState, useEffect, useCallback, useRef } from 'react';
import { SpotifyProfile, SpotifyPlayback } from '../types';
import {
  isSpotifyAuthenticated,
  initiateSpotifyLogin,
  handleSpotifyCallback,
  logoutSpotify,
  getStoredClientId,
} from '../services/spotifyAuth';
import {
  fetchSpotifyProfile,
  fetchCurrentPlayback,
  SpotifyRateLimitError,
} from '../services/spotifyApi';

export function useSpotify() {
  const [isConnected, setIsConnected] = useState<boolean>(() => isSpotifyAuthenticated());
  const [userProfile, setUserProfile] = useState<SpotifyProfile | null>(null);
  const [playback, setPlayback] = useState<SpotifyPlayback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<number | null>(null);
  const rateLimitTimeoutRef = useRef<number | null>(null);

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
      if (err instanceof SpotifyRateLimitError) {
        // Respect Spotify Rate-Limit Header
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (rateLimitTimeoutRef.current) clearTimeout(rateLimitTimeoutRef.current);
        rateLimitTimeoutRef.current = window.setTimeout(() => {
          refreshPlayback();
        }, err.retryAfterSeconds * 1000);
        return;
      }

      const msg = err instanceof Error ? err.message : 'Error syncing Spotify';
      if (msg.includes('Not authenticated') || msg.includes('401')) {
        setIsConnected(false);
        setUserProfile(null);
        setPlayback(null);
      }
    }
  }, []);

  // Handle Initial OAuth Callback & Session Bootstrap
  useEffect(() => {
    async function initAuth() {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const hasCode = urlParams.has('code') || hashParams.has('code');

      setIsLoading(true);
      try {
        if (hasCode) {
          await handleSpotifyCallback();
          setIsConnected(true);
        }

        if (isSpotifyAuthenticated()) {
          setIsConnected(true);
          const profile = await fetchSpotifyProfile().catch(() => null);
          if (profile) setUserProfile(profile);
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

  // Polling for Playback State (Compliant with Spotify Developer Polling Guidelines)
  useEffect(() => {
    if (!isConnected) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (rateLimitTimeoutRef.current) clearTimeout(rateLimitTimeoutRef.current);
      return;
    }

    const startPolling = () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      const intervalMs = playback?.isPlaying ? 3500 : 6000;
      pollIntervalRef.current = window.setInterval(() => {
        if (document.visibilityState === 'visible') {
          refreshPlayback();
        }
      }, intervalMs);
    };

    startPolling();

    // Pause polling when tab is not visible, resume when active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshPlayback();
        startPolling();
      } else if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (rateLimitTimeoutRef.current) clearTimeout(rateLimitTimeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, playback?.isPlaying, refreshPlayback]);

  // Client-side smooth progress increment while playing (updates playback progress automatically)
  useEffect(() => {
    if (!isConnected || !playback?.isPlaying || !playback.track) return;

    const ticker = setInterval(() => {
      setPlayback((prev) => {
        if (!prev || !prev.isPlaying || !prev.track) return prev;
        const newProgress = Math.min(prev.progressMs + 1000, prev.track.durationMs);
        return { ...prev, progressMs: newProgress };
      });
    }, 1000);

    return () => clearInterval(ticker);
  }, [isConnected, playback?.isPlaying, playback?.track]);

  const login = useCallback(async (clientId?: string, redirectUri?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await initiateSpotifyLogin(clientId, redirectUri);
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

  return {
    isConnected,
    userProfile,
    playback,
    isLoading,
    error,
    storedClientId: getStoredClientId(),
    login,
    logout,
    refreshPlayback,
    clearError: () => setError(null),
  };
}
