import React, { useState } from 'react';
import {
  REGISTERED_REDIRECT_URI,
  getRedirectUri,
  setCustomRedirectUri,
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
  const [clientId, setClientId] = useState(() => getStoredClientId());
  const [redirectUri, setRedirectUriState] = useState(() => getRedirectUri());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyUri = (uri: string) => {
    navigator.clipboard.writeText(uri);
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

    setCustomRedirectUri(redirectUri.trim());

    try {
      await onConnect(trimmedId, redirectUri.trim());
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to initialize Spotify authorization');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md pixel-card bg-[#141120] text-white p-5 border-4 border-black shadow-[6px_6px_0_#000] anim-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#2b2544]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 fill-[#1db954]" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
            </svg>
            <h2 className="font-retro text-xs sm:text-sm text-[#1db954] tracking-wider uppercase">
              Connect Spotify
            </h2>
          </div>
          <button
            onClick={onClose}
            className="pixel-btn bg-rose-600 hover:bg-rose-500 text-white font-retro text-[9px] px-2 py-0.5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-3 font-retro text-[8px] sm:text-[9px] text-zinc-300 mb-4 leading-relaxed">
          <p>
            Visualise music you are already playing through Spotify right in your pixel listening room!
          </p>

          <div className="bg-[#0b0914] p-3 border-2 border-black space-y-2">
            <div className="text-amber-300 font-bold flex items-center gap-1.5">
              <span>★</span>
              <span>Spotify App Setup:</span>
            </div>
            <p className="text-zinc-400">
              1. Open the{' '}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[#1db954] underline hover:text-[#1ed760]"
              >
                Spotify Developer Dashboard ↗
              </a>
            </p>
            <p className="text-zinc-400">
              2. In your App Settings, ensure this exact Redirect URI is added:
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <code className="flex-1 bg-[#1a1728] px-2 py-1.5 border border-[#3b345e] text-[8px] text-emerald-400 font-mono truncate select-all">
                {REGISTERED_REDIRECT_URI}
              </code>
              <button
                type="button"
                onClick={() => handleCopyUri(REGISTERED_REDIRECT_URI)}
                className="pixel-btn bg-[#252038] hover:bg-[#342e4e] text-zinc-200 text-[7px] px-2 py-1"
              >
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div>
              <label htmlFor="spotify-client-id" className="block text-zinc-300 mb-1 text-[8px]">
                3. Enter your Spotify Client ID:
              </label>
              <input
                id="spotify-client-id"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g. 4a8b7c9d0e1f2a3b4c5d6e7f8a9b0c1d"
                className="w-full bg-[#0a0812] border-2 border-black p-2 text-[9px] font-mono text-emerald-400 placeholder-zinc-600 focus:outline-none focus:border-[#1db954]"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Advanced toggle for local development */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[7px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                {showAdvanced ? '▲ Hide Advanced Settings' : '▼ Advanced Settings (Custom Redirect URI)'}
              </button>

              {showAdvanced && (
                <div className="mt-2 p-2 bg-[#0a0812] border border-[#2b2544] space-y-1.5">
                  <label htmlFor="custom-redirect-uri" className="block text-[7px] text-zinc-400">
                    Active Redirect URI for this session:
                  </label>
                  <input
                    id="custom-redirect-uri"
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUriState(e.target.value)}
                    className="w-full bg-[#141120] border border-black p-1 text-[8px] font-mono text-zinc-300"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRedirectUriState(REGISTERED_REDIRECT_URI)}
                      className="text-[6px] text-emerald-400 hover:underline"
                    >
                      Reset to Production URI
                    </button>
                    {typeof window !== 'undefined' && window.location.origin.includes('localhost') && (
                      <button
                        type="button"
                        onClick={() => setRedirectUriState(`${window.location.origin}/callback`)}
                        className="text-[6px] text-amber-400 hover:underline"
                      >
                        Use Localhost URI
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {(localError || error) && (
              <div className="p-2 bg-rose-950/80 border border-rose-600 text-rose-300 text-[8px] leading-tight">
                {localError || error}
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 pixel-btn bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[8px] py-2"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 pixel-btn bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-[8px] py-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>CONNECTING...</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
                    </svg>
                    <span>AUTHORIZE WITH SPOTIFY</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[7px] text-zinc-500 text-center pt-1">
            Uses official OAuth 2.0 PKCE. Your credentials are exchanged directly with Spotify and stored in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
