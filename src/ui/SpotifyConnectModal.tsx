import React, { useState } from 'react';

interface SpotifyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (clientId: string) => Promise<void>;
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
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem('roomtone_spotify_client_id') || '';
  });
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRedirectUri = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'http://127.0.0.1:5173/';

  const handleCopyUri = () => {
    navigator.clipboard.writeText(currentRedirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const trimmedId = clientId.trim();
    if (!trimmedId) {
      setLocalError('Please enter your Spotify Client ID');
      return;
    }
    localStorage.setItem('roomtone_spotify_client_id', trimmedId);
    try {
      await onConnect(trimmedId);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to initialize Spotify authorization');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md pixel-card bg-[#151221] text-white p-5 border-4 border-black shadow-[6px_6px_0_#000] anim-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#2b2544]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#1db954] border border-black inline-block"></span>
            <h2 className="font-retro text-xs sm:text-sm text-[#1db954] tracking-wider uppercase">
              Connect Spotify
            </h2>
          </div>
          <button
            onClick={onClose}
            className="pixel-btn bg-rose-600 text-white font-retro text-[9px] px-2 py-0.5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="space-y-3 font-retro text-[8px] sm:text-[9px] text-zinc-300 mb-4 leading-relaxed">
          <p>
            Listen to your personal Spotify in the pixel room! We use official <span className="text-[#1db954]">OAuth 2.0 PKCE</span>—no client secret is required.
          </p>

          <div className="bg-[#0e0c17] p-2.5 border-2 border-black space-y-1.5">
            <div className="text-amber-300 font-bold">1. Quick 1-minute Setup:</div>
            <p className="text-zinc-400">
              Create a free app at{' '}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[#1db954] underline hover:text-[#1ed760]"
              >
                Spotify Developer Dashboard
              </a>
              .
            </p>
            <div className="text-zinc-400">
              Add this exact Redirect URI to your Spotify App Settings:
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <code className="flex-1 bg-[#1a1728] px-2 py-1 border border-[#373059] text-[7px] text-emerald-400 font-mono truncate select-all">
                {currentRedirectUri}
              </code>
              <button
                type="button"
                onClick={handleCopyUri}
                className="pixel-btn bg-zinc-700 hover:bg-zinc-600 text-white text-[7px] px-2 py-1 shrink-0"
              >
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-retro text-[8px] text-zinc-300 mb-1">
              Spotify Client ID:
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. 32-character client id"
              className="w-full bg-[#0a0812] border-2 border-black px-2.5 py-1.5 font-mono text-[9px] text-white focus:outline-none focus:border-[#1db954]"
              autoFocus
            />
          </div>

          {(localError || error) && (
            <div className="pixel-card bg-rose-950/80 border-rose-600 text-rose-300 p-2 font-retro text-[7px] leading-tight">
              ⚠️ {localError || error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn pixel-btn-secondary text-[8px] px-3 py-1.5"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="pixel-btn bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-[8px] px-4 py-1.5 flex items-center gap-1.5"
            >
              {isLoading ? 'CONNECTING...' : 'AUTHORIZE ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
