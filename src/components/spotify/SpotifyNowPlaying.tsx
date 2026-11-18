import React, { useState } from 'react';
import { SpotifyPlayback, SpotifyProfile } from '../../types';

interface SpotifyNowPlayingProps {
  isConnected: boolean;
  playback: SpotifyPlayback | null;
  userProfile: SpotifyProfile | null;
  isLoading?: boolean;
  onConnectClick: () => void;
  onDisconnect: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (positionMs: number) => void;
}

export const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = ({
  isConnected,
  playback,
  userProfile,
  isLoading = false,
  onConnectClick,
  onDisconnect,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
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

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!durationMs) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * durationMs);
  };

  // -----------------------------------------------------------------
  // 1. DISCONNECTED STATE: Retro Spotify Connect Pill
  // -----------------------------------------------------------------
  if (!isConnected) {
    return (
      <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 select-none">
        <button
          type="button"
          onClick={onConnectClick}
          className="pixel-btn bg-[#1db954] hover:bg-[#1ed760] text-black font-retro text-[8px] sm:text-[9px] py-1.5 px-3 border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-2 cursor-pointer transition-transform"
          title="Connect your Spotify account to visualise current music"
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
          <svg className="w-3.5 h-3.5 fill-[#1db954] shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
          </svg>

          {/* Mini Visualizer / Equalizer Bars */}
          <div className="flex items-end gap-[2px] h-3 w-4 shrink-0">
            <span className={`w-[2px] bg-[#1db954] ${isPlaying ? 'anim-eq-1' : 'h-[2px]'}`} />
            <span className={`w-[2px] bg-[#1db954] ${isPlaying ? 'anim-eq-2' : 'h-[3px]'}`} />
            <span className={`w-[2px] bg-[#1db954] ${isPlaying ? 'anim-eq-3' : 'h-[2px]'}`} />
            <span className={`w-[2px] bg-[#1db954] ${isPlaying ? 'anim-eq-4' : 'h-[4px]'}`} />
          </div>

          <div className="font-retro text-[8px] max-w-[150px] sm:max-w-[220px] truncate text-emerald-300">
            {track ? `${track.title} — ${track.artist}` : 'Spotify Idle'}
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="text-[9px] text-zinc-400 hover:text-white px-1 font-retro cursor-pointer"
            title="Expand Visualizer"
          >
            ▲
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 3. CONNECTED: FULL PIXEL NOW PLAYING & MUSIC VISUALIZER CARD
  // -----------------------------------------------------------------
  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 select-none max-w-[360px] sm:max-w-[400px] w-[calc(100vw-24px)]">
      <div className="pixel-card bg-[#120f1d]/95 backdrop-blur-md border-3 border-black p-3 text-white shadow-[5px_5px_0_#000]">
        {/* Top Bar: Spotify Logo, Status Pill & Controls */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#2b2544]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 fill-[#1db954] shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.22.361-.692.476-1.053.255-2.887-1.764-6.522-2.164-10.803-1.186-.413.095-.824-.165-.918-.577-.095-.413.165-.824.577-.919 4.686-1.07 8.705-.615 11.942 1.365.361.221.476.693.255 1.062zm1.467-3.262c-.277.45-.87.593-1.32.316-3.305-2.032-8.344-2.62-12.254-1.433-.508.154-1.045-.133-1.199-.641-.154-.509.133-1.046.641-1.2 4.471-1.357 10.024-.702 13.816 1.638.45.277.593.87.316 1.32zm.126-3.41c-3.962-2.353-10.5-2.571-14.307-1.415-.609.185-1.255-.16-1.44-.769-.185-.609.16-1.255.769-1.44 4.381-1.33 11.593-1.076 16.142 1.624.549.326.731 1.037.405 1.586-.326.549-1.037.731-1.586.405z" />
            </svg>
            <span className="font-retro text-[8px] text-[#1db954] tracking-wider uppercase font-bold">
              SPOTIFY
            </span>

            {/* Playback Status Badge */}
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
            {/* User Profile Trigger */}
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
              title="Minimize to pill"
            >
              ▼
            </button>
          </div>
        </div>

        {/* Profile Popover Dropdown */}
        {showProfileMenu && userProfile && (
          <div className="mb-2 p-2 bg-[#0d0a17] border-2 border-black space-y-2 text-[8px] font-retro">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="truncate">{userProfile.displayName}</span>
              <span className="text-[#1db954] text-[7px]">{userProfile.product?.toUpperCase()}</span>
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

        {/* Middle: Artwork, Track Info & Dancing Equalizer Bars */}
        <div className="flex items-center gap-3 mb-2.5">
          {/* Album Artwork Frame */}
          {track?.albumArtUrl ? (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="relative w-14 h-14 bg-black border-2 border-black shrink-0 overflow-hidden group shadow-[2px_2px_0_#000]"
              title="Open track on Spotify"
            >
              <img
                src={track.albumArtUrl}
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#1db954] border border-black"></span>
            </a>
          ) : (
            <div className="w-14 h-14 bg-black border-2 border-zinc-700 shrink-0 flex items-center justify-center shadow-[2px_2px_0_#000]">
              <span className="text-xl">📻</span>
            </div>
          )}

          {/* Track Metadata */}
          <div className="flex-1 min-w-0">
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
                <div className="font-retro text-[9px] text-zinc-400">No Music Playing</div>
                <div className="font-ui text-[8px] text-zinc-500">
                  Start playing on your Spotify app to visualise here.
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
        {/* PIXEL AUDIO EQUALIZER VISUALIZER BARS (8-bit Visualizer)     */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-[#0b0914] p-1.5 border border-black mb-2 flex items-end justify-between h-7 px-2">
          {[
            { anim: 'anim-eq-1', idle: 'h-[3px]' },
            { anim: 'anim-eq-2', idle: 'h-[4px]' },
            { anim: 'anim-eq-3', idle: 'h-[2px]' },
            { anim: 'anim-eq-4', idle: 'h-[5px]' },
            { anim: 'anim-eq-1', idle: 'h-[2px]' },
            { anim: 'anim-eq-3', idle: 'h-[6px]' },
            { anim: 'anim-eq-2', idle: 'h-[3px]' },
            { anim: 'anim-eq-4', idle: 'h-[4px]' },
            { anim: 'anim-eq-1', idle: 'h-[5px]' },
            { anim: 'anim-eq-2', idle: 'h-[2px]' },
            { anim: 'anim-eq-3', idle: 'h-[4px]' },
            { anim: 'anim-eq-4', idle: 'h-[3px]' },
          ].map((bar, idx) => (
            <span
              key={idx}
              className={`w-[3px] sm:w-[4px] bg-[#1db954] transition-all ${
                isPlaying ? bar.anim : bar.idle
              }`}
            />
          ))}
        </div>

        {/* Scrubber & Timestamps */}
        <div className="space-y-1 mb-2">
          <div
            onClick={handleScrubberClick}
            className="w-full h-2 bg-[#090710] border border-black cursor-pointer relative shadow-[inset_1px_1px_0_#000]"
            title="Click to seek"
          >
            <div
              className="h-full bg-[#1db954]"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-[-2px] bottom-[-2px] w-2 bg-white border border-black -translate-x-1/2 pointer-events-none"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[8px] text-zinc-400">
            <span>{formatTime(progressMs)}</span>
            <span>{formatTime(durationMs)}</span>
          </div>
        </div>

        {/* Remote Playback Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={isLoading || !track}
              className="pixel-btn bg-[#252038] hover:bg-[#342e4e] text-white p-1 text-[8px] disabled:opacity-40"
              title="Previous Track"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              disabled={isLoading || !track}
              className={`pixel-btn text-black font-bold p-1 px-3 text-[8px] disabled:opacity-40 ${
                isPlaying ? 'bg-amber-400 hover:bg-amber-300' : 'bg-[#1db954] hover:bg-[#1ed760]'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸ PAUSE' : '► PLAY'}
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={isLoading || !track}
              className="pixel-btn bg-[#252038] hover:bg-[#342e4e] text-white p-1 text-[8px] disabled:opacity-40"
              title="Next Track"
            >
              ⏭
            </button>
          </div>

          {/* Spotify Policy Attribution Link */}
          {track?.spotifyUrl ? (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="font-retro text-[7px] text-[#1db954] hover:underline flex items-center gap-1"
              title="Open track on Spotify"
            >
              <span>LISTEN ON SPOTIFY</span>
              <span>↗</span>
            </a>
          ) : (
            <span className="font-retro text-[6px] text-zinc-600">
              SPOTIFY WEB API
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
