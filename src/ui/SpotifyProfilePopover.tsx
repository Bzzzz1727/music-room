import React, { useState, useRef, useEffect } from 'react';
import { SpotifyProfile, SpotifyPlayback } from '../types';

interface SpotifyProfilePopoverProps {
  profile: SpotifyProfile | null;
  playback: SpotifyPlayback | null;
  showProfileInRoom: boolean;
  onToggleShowProfileInRoom: (show: boolean) => void;
  onDisconnect: () => void;
  onConnectClick: () => void;
}

export const SpotifyProfilePopover: React.FC<SpotifyProfilePopoverProps> = ({
  profile,
  playback,
  showProfileInRoom,
  onToggleShowProfileInRoom,
  onDisconnect,
  onConnectClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!profile) {
    return (
      <button
        onClick={onConnectClick}
        className="pixel-btn bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-[8px] py-1 px-2.5 shadow-[2px_2px_0_#000] flex items-center gap-1.5"
        title="Connect Spotify Account"
      >
        <span className="w-2 h-2 bg-black inline-block rounded-none"></span>
        <span className="hidden sm:inline">CONNECT</span> SPOTIFY
      </button>
    );
  }

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pixel-card bg-[#151221] hover:bg-[#201b33] p-1 pr-2 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
        title={`Logged in as ${profile.displayName}`}
      >
        <div className="relative w-6 h-6 bg-zinc-800 border border-black overflow-hidden shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-retro text-[8px] text-white bg-zinc-700">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#1db954] border border-black"></span>
        </div>
        <span className="font-retro text-[8px] text-white max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">
          {profile.displayName}
        </span>
        <span className="text-[7px] text-zinc-400">▼</span>
      </button>

      {/* Profile Popover Dialog */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 pixel-card bg-[#151221] text-white p-3 border-3 border-black shadow-[4px_4px_0_#000] z-50 anim-scale-in select-none">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-[#2b2544]">
            <div className="w-8 h-8 bg-zinc-800 border-2 border-black overflow-hidden shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-retro text-xs text-white bg-zinc-700">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-retro text-[9px] text-white truncate font-bold">
                {profile.displayName}
              </div>
              <div className="font-retro text-[7px] text-[#1db954] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#1db954] inline-block"></span>
                <span>Connected • {profile.product?.toUpperCase() || 'SPOTIFY'}</span>
              </div>
            </div>
          </div>

          {/* Device & Playback Status */}
          <div className="bg-[#0c0a14] p-2 border border-black mb-2.5 space-y-1 font-retro text-[7px]">
            <div className="text-zinc-400">ACTIVE DEVICE:</div>
            <div className="text-amber-300 truncate">
              {playback?.deviceName ? `🎧 ${playback.deviceName}` : '⏸ No active device listening'}
            </div>
          </div>

          {/* Privacy & Room Options */}
          <div className="space-y-2 mb-3">
            <label className="flex items-center justify-between font-retro text-[8px] text-zinc-300 cursor-pointer hover:text-white">
              <span>Show Avatar in Room</span>
              <input
                type="checkbox"
                checked={showProfileInRoom}
                onChange={(e) => onToggleShowProfileInRoom(e.target.checked)}
                className="pixel-checkbox accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Links & Actions */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-[#2b2544]">
            {profile.profileUrl && (
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="pixel-btn bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-center text-[7px] py-1"
              >
                OPEN SPOTIFY PROFILE ↗
              </a>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                onDisconnect();
              }}
              className="pixel-btn bg-rose-700 hover:bg-rose-600 text-white text-[7px] py-1 font-bold"
            >
              DISCONNECT ACCOUNT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
