import React, { useState } from 'react';
import {
  REGISTERED_REDIRECT_URI,
  getRedirectUri,
  getStoredClientId,
} from '../services/spotifyAuth';

interface SpotifyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (clientId: string, redirectUri?: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export const SpotifyConnectModal: React.FC<SpotifyConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  error,
  isLoading = false,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Read configuration automatically from environment variables with fallback to stored values
  const envClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const envRedirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  const clientId = (envClientId || getStoredClientId() || '').trim();
  const redirectUri = (envRedirectUri || getRedirectUri() || REGISTERED_REDIRECT_URI).trim();

  const handleConnectClick = async () => {
    setLocalError(null);

    if (!clientId) {
      setLocalError('Spotify Client ID is not configured. Please set VITE_SPOTIFY_CLIENT_ID in your environment variables.');
      return;
    }

    try {
      await onConnect(clientId, redirectUri);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to connect to Spotify');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] sm:max-w-[380px] pixel-card bg-[#141120] text-white p-5 border-4 border-black shadow-[6px_6px_0_#000] anim-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Spotify Logo & Close Button */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#2b2544]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 fill-[#1db954] shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
            </svg>
            <span className="font-retro text-[9px] text-[#1db954] tracking-widest uppercase font-bold">
              SPOTIFY
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-rose-600 hover:bg-rose-500 text-white font-retro text-[9px] px-2 py-0.5 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col items-center text-center space-y-3 pb-1">
          {/* Decorative Pixel Vinyl Icon */}
          <div className="w-12 h-12 rounded-full bg-[#0a0812] border-2 border-zinc-700 relative flex items-center justify-center shadow-[2px_2px_0_#000]">
            <div className="absolute inset-1 rounded-full border border-zinc-800" />
            <div className="w-6 h-6 rounded-full bg-[#1db954] border border-black flex items-center justify-center">
              <span className="font-retro text-[8px] text-black">♫</span>
            </div>
            <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-[#0a0812] border border-black" />
          </div>

          {/* Heading */}
          <h2 className="font-retro text-xs sm:text-sm text-yellow-300 font-bold tracking-wide uppercase">
            Your Music, Your Room
          </h2>

          {/* Description */}
          <p className="font-ui text-xs text-zinc-300 leading-relaxed max-w-[320px]">
            Connect your Spotify account to visualise your currently playing music right in the room on the spinning vinyl.
          </p>

          {/* Configuration Missing Alert (If Client ID is not set) */}
          {!clientId && (
            <div className="w-full p-3 bg-amber-950/80 border-2 border-amber-500 text-left space-y-1 text-amber-200">
              <div className="font-retro text-[8px] text-amber-300 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>CONFIGURATION REQUIRED</span>
              </div>
              <p className="font-ui text-[10px] text-zinc-300 leading-tight">
                Spotify Client ID is not configured. Please add <code className="text-amber-300 bg-black/50 px-1 font-mono">VITE_SPOTIFY_CLIENT_ID</code> to your Vercel project environment variables.
              </p>
            </div>
          )}

          {/* Error Message */}
          {(localError || error) && (
            <div className="w-full p-2.5 bg-rose-950/90 border-2 border-rose-600 text-rose-200 text-left font-retro text-[8px] leading-snug">
              {localError || error}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={handleConnectClick}
              disabled={isLoading || !clientId}
              className="w-full pixel-btn bg-[#1db954] hover:bg-[#1ed760] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-retro text-[9px] sm:text-[10px] py-3 px-4 border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              {isLoading ? (
                <span>CONNECTING...</span>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-black shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
                  </svg>
                  <span className="font-bold tracking-wider">CONNECT WITH SPOTIFY</span>
                </>
              )}
            </button>
          </div>

          {/* Subtext */}
          <p className="font-ui text-[9px] text-zinc-500 pt-1">
            Secure login via official Spotify OAuth (PKCE).
          </p>
        </div>
      </div>
    </div>
  );
};
