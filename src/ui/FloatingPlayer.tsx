import React, { useState } from 'react';
import { Track, VisualizerMode, MusicSource, SpotifyPlayback } from '../types';
import {
  PixelPlay,
  PixelPause,
  PixelNext,
  PixelPrev,
  PixelVolume,
  PixelMute,
  PixelShuffle,
} from './PixelIcons';

interface FloatingPlayerProps {
  track: Track;
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  crackleEnabled: boolean;
  sfxEnabled: boolean;
  visualizerMode: VisualizerMode;
  musicSource: MusicSource;
  onSelectMusicSource: (src: MusicSource) => void;
  spotifyConnected: boolean;
  spotifyPlayback: SpotifyPlayback | null;
  onSpotifyTogglePlay: () => void;
  onSpotifyNext: () => void;
  onSpotifyPrev: () => void;
  onSpotifySeek: (ms: number) => void;
  onConnectSpotifyClick: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectTrack: (index: number) => void;
  onSeek: (seconds: number) => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleCrackle: () => void;
  onToggleSfx: () => void;
  onCycleVisualizer: () => void;
}

export const FloatingPlayer: React.FC<FloatingPlayerProps> = ({
  track,
  tracks,
  currentTrackIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  crackleEnabled,
  sfxEnabled,
  visualizerMode,
  musicSource,
  onSelectMusicSource,
  spotifyConnected,
  spotifyPlayback,
  onSpotifyTogglePlay,
  onSpotifyNext,
  onSpotifyPrev,
  onSpotifySeek,
  onConnectSpotifyClick,
  onTogglePlay,
  onNext,
  onPrev,
  onSelectTrack,
  onSeek,
  onSetVolume,
  onToggleMute,
  onToggleShuffle,
  onToggleCrackle,
  onToggleSfx,
  onCycleVisualizer,
}) => {
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showMixer, setShowMixer] = useState(false);

  const isSpotifyActive = musicSource === 'spotify' && spotifyConnected;

  const currentTitle = isSpotifyActive
    ? spotifyPlayback?.track?.title || 'No Track Playing'
    : track.title;

  const currentArtist = isSpotifyActive
    ? spotifyPlayback?.track?.artist || (spotifyConnected ? 'Spotify is Idle' : 'Connect Spotify')
    : track.artist;

  const currentDurationSec = isSpotifyActive
    ? (spotifyPlayback?.track?.durationMs ? spotifyPlayback.track.durationMs / 1000 : 0)
    : duration;

  const currentProgressSec = isSpotifyActive
    ? (spotifyPlayback?.progressMs ? spotifyPlayback.progressMs / 1000 : 0)
    : currentTime;

  const activePlaying = isSpotifyActive
    ? !!spotifyPlayback?.isPlaying
    : isPlaying;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = currentDurationSec > 0
    ? (currentProgressSec / currentDurationSec) * 100
    : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    if (isSpotifyActive) {
      if (spotifyPlayback?.track) {
        onSpotifySeek(ratio * spotifyPlayback.track.durationMs);
      }
    } else {
      onSeek(ratio * duration);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-30">
      {/* ------------------------------------------------------------- */}
      {/* EXPANDABLE PANEL: QUEUE / PLAYLIST */}
      {/* ------------------------------------------------------------- */}
      {showQueue && (
        <div className="absolute bottom-full mb-3 left-0 right-0 pixel-card p-3 bg-[#171424] border-3 border-black text-white shadow-[0_-6px_20px_rgba(0,0,0,0.6)] anim-float">
          <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black/40 font-retro text-[9px] text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span>📋</span> ROOMTONE RETRO SYNTH QUEUE (5)
            </span>
            <button
              onClick={() => setShowQueue(false)}
              className="text-zinc-400 hover:text-white font-ui px-1"
            >
              ✕ CLOSE
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
            {tracks.map((t, idx) => {
              const isCurrent = idx === currentTrackIndex && musicSource === 'demo';
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectMusicSource('demo');
                    onSelectTrack(idx);
                  }}
                  className={`p-2 text-left border border-black flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-black font-bold shadow-[inset_1px_1px_0_#fff]'
                      : 'bg-[#231e33] text-zinc-200 hover:bg-[#322c45]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-retro text-[8px] w-4">
                      {isCurrent ? '►' : `${idx + 1}.`}
                    </span>
                    <span className="font-retro text-[8px] truncate">
                      {t.title}
                    </span>
                    <span className="font-ui text-[8px] opacity-75 truncate">
                      — {t.artist}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="pixel-badge text-[6px] py-0 px-1 bg-black text-white">
                      {t.genre}
                    </span>
                    <span className="font-lcd text-sm">
                      {formatTime(t.duration)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EXPANDABLE PANEL: LYRICS & LINER NOTES */}
      {/* ------------------------------------------------------------- */}
      {showLyrics && (
        <div className="absolute bottom-full mb-3 left-0 right-0 pixel-card p-4 bg-[#1f192b] border-3 border-black text-white shadow-[0_-6px_20px_rgba(0,0,0,0.6)] anim-float max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black/40 font-retro text-[9px] text-yellow-300">
            <span className="flex items-center gap-1.5">
              <span>📜</span> {isSpotifyActive ? `SPOTIFY TRACK: ${currentTitle}` : `LINER NOTES: ${track.title}`}
            </span>
            <button
              onClick={() => setShowLyrics(false)}
              className="text-zinc-400 hover:text-white font-ui px-1"
            >
              ✕ CLOSE
            </button>
          </div>

          {isSpotifyActive ? (
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-black/40 border border-black flex flex-col gap-2">
                <span className="font-retro text-[9px] text-green-400">SPOTIFY STREAMING ACTIVE</span>
                <p className="font-ui text-xs text-zinc-300">
                  Track streamed directly from your authorized Spotify device. Per Spotify Developer Policy, external audio sync is bypassed for compliant native playback.
                </p>
                {spotifyPlayback?.track?.spotifyUrl && (
                  <a
                    href={spotifyPlayback.track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-retro text-[8px] text-[#1db954] hover:underline mt-1"
                  >
                    Open this song in Spotify App ↗
                  </a>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="text-xs font-ui text-zinc-300 leading-relaxed mb-3 p-2 bg-black/30 border border-black/40">
                <div className="font-retro text-[8px] text-amber-400 mb-1">STORY / RECORDING:</div>
                {track.linerNotes || track.notes}
              </div>

              <div className="font-mono text-[11px] text-zinc-200 space-y-1.5 border-l-2 border-amber-400/60 pl-3 py-1">
                {track.lyrics && track.lyrics.length > 0 ? (
                  track.lyrics.map((line, idx) => (
                    <div key={idx} className={line.startsWith('★') || line.startsWith('♫') || line.startsWith('☕') || line.startsWith('⚡') || line.startsWith('🎸') || line.startsWith('👾') ? 'text-amber-400 font-bold' : ''}>
                      {line}
                    </div>
                  ))
                ) : (
                  <div>[ Instrumental Chiptune Track ]</div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EXPANDABLE PANEL: MIXER & AUDIO SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {showMixer && (
        <div className="absolute bottom-full mb-3 right-0 w-80 pixel-card p-3 bg-[#1a1626] border-3 border-black text-white shadow-[0_-6px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black/40 font-retro text-[9px] text-zinc-300">
            <span>🎚️ AUDIO MIXER & SOURCE</span>
            <button onClick={() => setShowMixer(false)} className="text-zinc-400 hover:text-white font-ui">
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2.5 text-[8px] font-retro">
            {/* Audio Source Tabs */}
            <div className="flex gap-1.5 p-1 bg-black border border-black">
              <button
                onClick={() => onSelectMusicSource('demo')}
                className={`flex-1 py-1 text-[7px] ${musicSource === 'demo' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
              >
                ♫ SYNTH DEMO
              </button>
              <button
                onClick={() => {
                  if (spotifyConnected) {
                    onSelectMusicSource('spotify');
                  } else {
                    onConnectSpotifyClick();
                  }
                }}
                className={`flex-1 py-1 text-[7px] flex items-center justify-center gap-1 ${
                  musicSource === 'spotify' ? 'bg-[#1db954] text-black font-bold' : 'text-zinc-400'
                }`}
              >
                <span>🟢</span>
                <span>{spotifyConnected ? 'SPOTIFY' : 'CONNECT'}</span>
              </button>
            </div>

            {/* Volume Stepper */}
            <div className="flex items-center gap-2">
              <button onClick={onToggleMute} className="pixel-btn pixel-btn-secondary p-1">
                {isMuted ? <PixelMute size={12} color="#ef4444" /> : <PixelVolume size={12} color="#111" />}
              </button>
              <div className="flex-1 flex gap-1 h-3">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((step) => (
                  <button
                    key={step}
                    onClick={() => onSetVolume(step)}
                    className={`flex-1 border border-black ${
                      !isMuted && volume >= step - 0.05 ? 'bg-amber-400' : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Atmosphere Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onToggleCrackle}
                className={`pixel-btn py-1 text-[7px] ${crackleEnabled ? 'bg-amber-600' : 'pixel-btn-secondary'}`}
              >
                CRACKLE: {crackleEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={onCycleVisualizer}
                className={`pixel-btn py-1 text-[7px] ${visualizerMode !== 'off' ? 'bg-purple-600' : 'pixel-btn-secondary'}`}
              >
                REACT: {visualizerMode.toUpperCase()}
              </button>
              <button
                onClick={onToggleSfx}
                className={`pixel-btn py-1 text-[7px] ${sfxEnabled ? 'bg-blue-600' : 'pixel-btn-secondary'}`}
              >
                SFX: {sfxEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={onToggleShuffle}
                className={`pixel-btn py-1 text-[7px] ${isShuffle ? 'bg-pink-600' : 'pixel-btn-secondary'}`}
              >
                SHUFFLE: {isShuffle ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN COMPACT FLOATING BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="pixel-card p-2 sm:p-2.5 bg-[#120f1d]/95 backdrop-blur-md border-3 border-black text-white flex flex-col gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
        {/* Top Mini Scrubber Bar */}
        <div className="flex items-center gap-2 text-[8px] font-lcd text-amber-300">
          <span className="w-8 text-right font-mono text-[9px]">{formatTime(currentProgressSec)}</span>
          <div
            onClick={handleProgressClick}
            className="flex-1 h-2 bg-zinc-900 border border-black cursor-pointer relative shadow-[inset_1px_1px_0_#000]"
            title="Click to seek"
          >
            <div
              className={`h-full ${isSpotifyActive ? 'bg-[#1db954]' : 'bg-amber-400'}`}
              style={{
                width: `${progressPercent}%`,
                backgroundImage: isSpotifyActive
                  ? 'none'
                  : 'repeating-linear-gradient(90deg, #f59e0b, #f59e0b 4px, #d97706 4px, #d97706 6px)',
              }}
            />
            {/* Scrubber thumb */}
            <div
              className="absolute top-[-2px] bottom-[-2px] w-2 bg-white border border-black -translate-x-1/2 pointer-events-none"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className="w-8 font-mono text-[9px]">{formatTime(currentDurationSec)}</span>
        </div>

        {/* Primary Controls Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Left: Thumbnail & Track Details */}
          <div className="flex items-center gap-2.5 min-w-0 max-w-[240px] sm:max-w-[300px]">
            {isSpotifyActive && spotifyPlayback?.track?.albumArtUrl ? (
              <a
                href={spotifyPlayback.track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-9 h-9 border-2 border-black flex-shrink-0 cursor-pointer overflow-hidden group shadow-md"
                title="Open track on Spotify"
              >
                <img
                  src={spotifyPlayback.track.albumArtUrl}
                  alt={spotifyPlayback.track.title}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#1db954] border border-black"></span>
              </a>
            ) : (
              <div
                onClick={() => {
                  if (isSpotifyActive) onSpotifyTogglePlay();
                  else onTogglePlay();
                }}
                className={`w-9 h-9 rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md ${
                  activePlaying ? 'anim-pixel-spin' : ''
                }`}
                title="Click to toggle playback"
              >
                <div className={`w-4 h-4 rounded-full ${isSpotifyActive ? 'bg-[#1db954]' : 'bg-rose-500'} border border-black flex items-center justify-center`}>
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                </div>
              </div>
            )}

            <div className="truncate">
              <div className="flex items-center gap-1.5 truncate">
                {isSpotifyActive && (
                  <span className="w-2 h-2 rounded-full bg-[#1db954] flex-shrink-0 inline-block"></span>
                )}
                <span className={`font-retro text-[9px] truncate leading-tight ${isSpotifyActive ? 'text-green-300' : 'text-amber-300'}`}>
                  {currentTitle}
                </span>
              </div>
              <div className="font-ui text-[8px] text-zinc-400 truncate flex items-center gap-1">
                <span>{currentArtist}</span>
                {isSpotifyActive && spotifyPlayback?.track?.spotifyUrl && (
                  <a
                    href={spotifyPlayback.track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1db954] hover:underline"
                    title="Open on Spotify"
                  >
                    ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Center: Playback Transport Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onToggleShuffle}
              className={`pixel-btn pixel-btn-icon hidden sm:inline-flex ${isShuffle ? 'bg-purple-600' : 'pixel-btn-secondary'}`}
              style={{ minWidth: '30px', minHeight: '30px', padding: '4px' }}
              title="Toggle Shuffle"
            >
              <PixelShuffle size={12} color={isShuffle ? '#fff' : '#111'} />
            </button>

            <button
              onClick={isSpotifyActive ? onSpotifyPrev : onPrev}
              className="pixel-btn pixel-btn-secondary pixel-btn-icon"
              style={{ minWidth: '30px', minHeight: '30px', padding: '4px' }}
              title="Previous Track"
            >
              <PixelPrev size={12} color="#111" />
            </button>

            <button
              onClick={isSpotifyActive ? onSpotifyTogglePlay : onTogglePlay}
              className={`pixel-btn px-4 py-1.5 ${
                activePlaying
                  ? (isSpotifyActive ? 'bg-[#1db954] text-black font-bold' : 'bg-amber-600')
                  : 'bg-emerald-600'
              }`}
              style={{ minHeight: '32px' }}
              title={activePlaying ? 'Pause' : 'Play'}
            >
              {activePlaying ? <PixelPause size={12} color={isSpotifyActive ? '#000' : '#fff'} /> : <PixelPlay size={12} color="#fff" />}
              <span className="text-[9px] hidden sm:inline">{activePlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={isSpotifyActive ? onSpotifyNext : onNext}
              className="pixel-btn pixel-btn-secondary pixel-btn-icon"
              style={{ minWidth: '30px', minHeight: '30px', padding: '4px' }}
              title="Next Track"
            >
              <PixelNext size={12} color="#111" />
            </button>
          </div>

          {/* Right: Expandable Toggles (Queue, Lyrics, Mixer) */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {spotifyConnected ? (
              <button
                onClick={() => onSelectMusicSource(musicSource === 'spotify' ? 'demo' : 'spotify')}
                className={`pixel-btn text-[7px] py-1 px-1.5 ${
                  musicSource === 'spotify' ? 'bg-[#1db954] text-black font-bold' : 'bg-zinc-800 text-zinc-300'
                }`}
                title="Switch between Spotify and Demo Tracks"
              >
                {musicSource === 'spotify' ? '🟢 SPOTIFY' : '♫ DEMO'}
              </button>
            ) : (
              <button
                onClick={onConnectSpotifyClick}
                className="pixel-btn bg-[#1db954] text-black font-bold text-[7px] py-1 px-1.5"
                title="Connect Spotify Account"
              >
                + SPOTIFY
              </button>
            )}

            <button
              onClick={() => {
                setShowQueue(!showQueue);
                setShowLyrics(false);
                setShowMixer(false);
              }}
              className={`pixel-btn text-[8px] py-1 px-2 ${showQueue ? 'is-active bg-amber-600' : 'pixel-btn-secondary'}`}
              title="Toggle Playlist Queue"
            >
              📋 <span className="hidden sm:inline">QUEUE</span>
            </button>

            <button
              onClick={() => {
                setShowLyrics(!showLyrics);
                setShowQueue(false);
                setShowMixer(false);
              }}
              className={`pixel-btn text-[8px] py-1 px-2 ${showLyrics ? 'is-active bg-amber-600' : 'pixel-btn-secondary'}`}
              title="Toggle Lyrics and Liner Notes"
            >
              📜 <span className="hidden sm:inline">LYRICS</span>
            </button>

            <button
              onClick={() => {
                setShowMixer(!showMixer);
                setShowQueue(false);
                setShowLyrics(false);
              }}
              className={`pixel-btn text-[8px] py-1 px-2 ${showMixer ? 'is-active bg-blue-600' : 'pixel-btn-secondary'}`}
              title="Audio mixer & volume controls"
            >
              🎚️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
