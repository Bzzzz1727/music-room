import React, { useState } from 'react';
import { SpotifyPlayback, SpotifyProfile } from '../../types';

interface SpotifyNowPlayingProps {
  isConnected: boolean;
  playback: SpotifyPlayback | null;
  userProfile: SpotifyProfile | null;
  isLoading?: boolean;
  onConnectClick: () => void;
  onDisconnect: () => void;
}

export const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = ({
  isConnected,
  playback,
  userProfile,
  onConnectClick,
  onDisconnect,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const track = playback?.track;
  const isPlaying = !!playback?.isPlaying;
  const progressMs = playback?.progressMs || 0;
  const durationMs = track?.durationMs || 0;
  const progressPercent = durationMs > 0 ? Math.min(100, (progressMs / durationMs) * 100) : 0;

  // -----------------------------------------------------------------
  // 1. DISCONNECTED STATE: Clean Retro Spotify Connect Button
  // -----------------------------------------------------------------
  if (!isConnected) {
    return (
      <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 select-none">
        <button
          type="button"
          onClick={onConnectClick}
          className="pixel-btn bg-[#1db954] hover:bg-[#1ed760] text-black font-retro text-[8px] sm:text-[9px] py-1.5 px-3 border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-2 cursor-pointer transition-transform"
          title="Connect Spotify to visualise your currently playing track"
        >
          <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
          </svg>
          <span className="font-bold">CONNECT SPOTIFY</span>
        </button>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. CONNECTED: MINIMIZED COMPACT PILL
  // -----------------------------------------------------------------
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 select-none">
        <div className="pixel-card bg-[#120f1d]/90 backdrop-blur-xs border-2 border-black p-1.5 px-2.5 shadow-[3px_3px_0_#000] flex items-center gap-2.5 text-white">
          {/* Mini Rotating Vinyl with Album Artwork */}
          <div
            className={`w-7 h-7 rounded-full bg-[#08080a] border border-zinc-700 flex items-center justify-center shrink-0 relative overflow-hidden ${
              isPlaying ? 'anim-pixel-spin' : ''
            }`}
            title={isPlaying ? 'Vinyl is rotating (Music playing)' : 'Vinyl is stopped (Music paused/idle)'}
          >
            {track?.albumArtUrl ? (
              <img
                src={track.albumArtUrl}
                alt={track.title}
                className="w-4 h-4 rounded-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-[#1db954] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#08080a]" />
              </div>
            )}
            {/* Center Spindle Hole */}
            <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-[#08080a] border border-black pointer-events-none" />
          </div>

          <div className="font-retro text-[8px] max-w-[140px] sm:max-w-[200px] truncate text-emerald-300">
            {track ? `${track.title} — ${track.artist}` : 'Spotify Idle'}
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="text-[9px] text-zinc-400 hover:text-white px-1 font-retro cursor-pointer"
            title="Expand Music Interface"
          >
            ▲
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 3. CONNECTED: FULL MUSIC INTERFACE WITH ROTATING VINYL
  // -----------------------------------------------------------------
  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 select-none max-w-[360px] sm:max-w-[390px] w-[calc(100vw-24px)]">
      <div className="pixel-card bg-[#120f1d]/95 backdrop-blur-md border-3 border-black p-3 text-white shadow-[5px_5px_0_#000]">
        {/* Top Header: Spotify Logo, Playback Status Badge & Window Controls */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#2b2544]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 fill-[#1db954] shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
            </svg>
            <span className="font-retro text-[8px] text-[#1db954] tracking-wider uppercase font-bold">
              SPOTIFY
            </span>

            {/* Live Status Badge */}
            {isPlaying ? (
              <span className="font-retro text-[7px] px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 inline-block animate-pulse"></span>
                <span>PLAYING</span>
              </span>
            ) : track ? (
              <span className="font-retro text-[7px] px-1.5 py-0.5 bg-amber-950/80 border border-amber-500 text-amber-400">
                PAUSED
              </span>
            ) : (
              <span className="font-retro text-[7px] px-1.5 py-0.5 bg-zinc-800 border border-zinc-600 text-zinc-400">
                STANDBY
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* User Profile Avatar / Trigger */}
            {userProfile && (
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-5 h-5 bg-zinc-800 border border-black overflow-hidden relative cursor-pointer"
                title={`Account: ${userProfile.displayName}`}
              >
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.displayName}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <span className="font-retro text-[7px] text-white flex items-center justify-center h-full">
                    {userProfile.displayName.charAt(0)}
                  </span>
                )}
              </button>
            )}

            {/* Minimize Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-zinc-400 hover:text-white px-1 text-[9px] font-retro cursor-pointer"
              title="Minimize to compact pill"
            >
              ▼
            </button>
          </div>
        </div>

        {/* Profile Dropdown */}
        {showProfileMenu && userProfile && (
          <div className="mb-2 p-2 bg-[#0d0a17] border-2 border-black space-y-2 text-[8px] font-retro">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="truncate">{userProfile.displayName}</span>
              <span className="text-[#1db954] text-[7px]">{userProfile.product?.toUpperCase() || 'SPOTIFY'}</span>
            </div>
            {playback?.deviceName && (
              <div className="text-[7px] text-amber-300 truncate">
                🎧 Device: {playback.deviceName}
              </div>
            )}
            <div className="flex gap-2 pt-1 border-t border-[#231e36]">
              {userProfile.profileUrl && (
                <a
                  href={userProfile.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 pixel-btn bg-[#231e36] text-zinc-300 text-center text-[7px] py-1"
                >
                  PROFILE ↗
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onDisconnect();
                }}
                className="flex-1 pixel-btn bg-rose-700 hover:bg-rose-600 text-white text-[7px] py-1"
              >
                DISCONNECT
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* ROTATING VINYL WITH ALBUM ARTWORK & TRACK INFO              */}
        {/* ----------------------------------------------------------- */}
        <div className="flex items-center gap-3 mb-2.5">
          {/* ROTATING VINYL RECORD (Rotates only when music is playing) */}
          <div className="relative shrink-0">
            <div
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#08080a] border-2 border-zinc-800 shadow-[3px_3px_0_#000] relative flex items-center justify-center overflow-hidden transition-transform ${
                isPlaying ? 'anim-pixel-spin' : ''
              }`}
              title={
                isPlaying
                  ? 'Vinyl is rotating (Spotify music is playing)'
                  : 'Vinyl is stationary (Spotify is paused or idle)'
              }
            >
              {/* Outer Grooves */}
              <div className="absolute inset-1.5 rounded-full border border-zinc-800/80 pointer-events-none" />
              <div className="absolute inset-3 rounded-full border border-zinc-900 pointer-events-none" />

              {/* Circular Album Artwork Label */}
              {track?.albumArtUrl ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-black shadow-inner z-10 shrink-0">
                  <img
                    src={track.albumArtUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1db954] border border-black flex items-center justify-center z-10">
                  <span className="text-[10px] text-black font-retro">♫</span>
                </div>
              )}

              {/* Center Spindle Hole */}
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#120f1d] border border-black z-20 pointer-events-none shadow-[inset_1px_1px_0_#000]" />
            </div>

            {/* Turntable Tonearm Indicator */}
            <div
              className={`absolute top-0 right-[-4px] w-1 h-7 bg-zinc-400 border border-black origin-top transition-transform duration-500 pointer-events-none ${
                isPlaying ? 'rotate-[-22deg]' : 'rotate-[15deg]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-zinc-600 border border-black -translate-x-0.5 -translate-y-0.5" />
              <div className="absolute bottom-0 w-1.5 h-1.5 bg-rose-500 border border-black -translate-x-0.5" />
            </div>
          </div>

          {/* Song Title, Artist, Album & Active Device */}
          <div className="flex-1 min-w-0 pl-1">
            {track ? (
              <>
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-retro text-[9px] sm:text-[10px] text-amber-300 hover:text-amber-200 truncate font-bold leading-tight"
                  title={track.title}
                >
                  {track.title}
                </a>
                <div
                  className="font-ui text-[8px] sm:text-[9px] text-zinc-300 truncate mt-0.5"
                  title={track.artist}
                >
                  {track.artist}
                </div>
                <div
                  className="font-ui text-[7px] sm:text-[8px] text-zinc-500 truncate"
                  title={track.albumName}
                >
                  {track.albumName}
                </div>
              </>
            ) : (
              <div className="space-y-0.5">
                <div className="font-retro text-[9px] text-zinc-400">Spotify Idle</div>
                <div className="font-ui text-[8px] text-zinc-500">
                  Play music on any Spotify device to visualise.
                </div>
              </div>
            )}

            {/* Active Device Indicator */}
            {playback?.deviceName && (
              <div className="font-retro text-[7px] text-emerald-400 mt-1 truncate flex items-center gap-1">
                <span>🎧</span>
                <span>{playback.deviceName}</span>
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* AUTOMATIC PLAYBACK PROGRESS BAR & TIMESTAMPS                */}
        {/* ----------------------------------------------------------- */}
        <div className="space-y-1 mb-2">
          {/* Read-only Progress Track */}
          <div
            className="w-full h-2 bg-[#090710] border border-black relative shadow-[inset_1px_1px_0_#000] overflow-hidden"
            title={`Progress: ${formatTime(progressMs)} / ${formatTime(durationMs)}`}
          >
            <div
              className={`h-full transition-all duration-300 ${isPlaying ? 'bg-[#1db954]' : 'bg-amber-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[8px] text-zinc-400">
            <span>{formatTime(progressMs)}</span>
            <span>{formatTime(durationMs)}</span>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* FOOTER: SPOTIFY DEVELOPER ATTRIBUTION & DIRECT LINK         */}
        {/* ----------------------------------------------------------- */}
        <div className="flex items-center justify-between pt-1 border-t border-[#231e36]">
          {track?.spotifyUrl ? (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="font-retro text-[7px] text-[#1db954] hover:underline flex items-center gap-1"
              title="Open currently playing track on Spotify"
            >
              <span>LISTEN ON SPOTIFY</span>
              <span>↗</span>
            </a>
          ) : (
            <span className="font-retro text-[7px] text-zinc-500">
              SPOTIFY WEB API
            </span>
          )}

          <button
            type="button"
            onClick={onDisconnect}
            className="text-[7px] font-retro text-zinc-500 hover:text-rose-400 cursor-pointer"
            title="Disconnect Spotify account"
          >
            DISCONNECT
          </button>
        </div>
      </div>
    </div>
  );
};
