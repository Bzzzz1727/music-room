import React from 'react';
import {
  ThemeId,
  PlayerStyle,
  WeatherType,
  LightingMode,
  VisualizerMode,
  MusicSource,
  SpotifyProfile,
} from '../types';
import { ROOM_THEMES } from '../components/room/Themes';

interface CustomizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  currentStyle: PlayerStyle;
  onSelectStyle: (style: PlayerStyle) => void;
  weather: WeatherType;
  onSelectWeather: (weather: WeatherType) => void;
  lightingMode: LightingMode;
  onSelectLighting: (mode: LightingMode) => void;
  visualizerMode: VisualizerMode;
  onSelectVisualizer: (mode: VisualizerMode) => void;
  decorationsEnabled: boolean;
  onToggleDecorations: () => void;
  crackleEnabled: boolean;
  onToggleCrackle: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  musicSource: MusicSource;
  onSelectMusicSource: (source: MusicSource) => void;
  spotifyConnected: boolean;
  spotifyProfile: SpotifyProfile | null;
  onConnectSpotifyClick: () => void;
  onDisconnectSpotify: () => void;
  showProfileInRoom: boolean;
  onToggleShowProfileInRoom: (show: boolean) => void;
  onResetRoom: () => void;
  onSfx?: () => void;
}

export const CustomizationDrawer: React.FC<CustomizationDrawerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentStyle,
  onSelectStyle,
  weather,
  onSelectWeather,
  lightingMode,
  onSelectLighting,
  visualizerMode,
  onSelectVisualizer,
  decorationsEnabled,
  onToggleDecorations,
  crackleEnabled,
  onToggleCrackle,
  sfxEnabled,
  onToggleSfx,
  musicSource,
  onSelectMusicSource,
  spotifyConnected,
  spotifyProfile,
  onConnectSpotifyClick,
  onDisconnectSpotify,
  showProfileInRoom,
  onToggleShowProfileInRoom,
  onResetRoom,
  onSfx,
}) => {
  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    if (onSfx) onSfx();
    callback();
  };

  const themesList: ThemeId[] = ['pastel', 'grunge', 'pixel', 'y2k', 'earth'];
  const playerStyles: { id: PlayerStyle; label: string; icon: string }[] = [
    { id: 'vinyl', label: 'VINYL DECK', icon: '💽' },
    { id: 'cd', label: 'CD BOOMBOX', icon: '💿' },
    { id: 'cassette', label: 'CASSETTE TAPE', icon: '📼' },
  ];
  const weatherOptions: { id: WeatherType; label: string; icon: string }[] = [
    { id: 'rain', label: 'RAIN', icon: '🌧️' },
    { id: 'stars', label: 'NIGHT STARS', icon: '✨' },
    { id: 'sun', label: 'SUNNY DAY', icon: '☀️' },
    { id: 'aurora', label: 'AURORA BOREALIS', icon: '🌌' },
  ];
  const lightingOptions: { id: LightingMode; label: string; icon: string }[] = [
    { id: 'candle', label: 'COZY CANDLE', icon: '🕯️' },
    { id: 'daylight', label: 'SUNLIT DAY', icon: '💡' },
    { id: 'midnight', label: 'MIDNIGHT MOOD', icon: '🌙' },
  ];
  const visualizerOptions: { id: VisualizerMode; label: string; desc: string }[] = [
    { id: 'subtle', label: 'SUBTLE', desc: 'Gentle vinyl & plant pulse' },
    { id: 'dynamic', label: 'DYNAMIC', desc: 'Audio reactive glow & bass kick' },
    { id: 'off', label: 'OFF', desc: 'Static environment animations' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-[#120f1d] text-white border-l-4 border-black shadow-[-6px_0_0_#000] flex flex-col z-10 anim-slide-in">
        {/* Drawer Header */}
        <div className="p-4 border-b-2 border-[#2b2544] flex items-center justify-between bg-[#181427]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-black inline-block"></span>
            <h2 className="font-retro text-xs sm:text-sm text-amber-300 tracking-wider">
              ROOM CUSTOMIZER
            </h2>
          </div>
          <button
            onClick={() => handleAction(onClose)}
            className="pixel-btn bg-rose-600 hover:bg-rose-500 text-white font-retro text-[9px] px-2.5 py-1"
            title="Close Drawer"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* SECTION 0: AUDIO SOURCE */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase flex items-center justify-between">
              <span>AUDIO SOURCE</span>
              <span className="text-[7px] text-zinc-500">SYNTH / SPOTIFY</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAction(() => onSelectMusicSource('demo'))}
                className={`pixel-btn text-[8px] py-2 px-2 text-left flex items-center gap-1.5 ${
                  musicSource === 'demo'
                    ? 'bg-amber-400 text-black font-bold'
                    : 'pixel-btn-secondary'
                }`}
              >
                <span>♫</span>
                <span className="truncate">RETRO SYNTH</span>
              </button>
              <button
                onClick={() => {
                  if (!spotifyConnected) {
                    onConnectSpotifyClick();
                  } else {
                    handleAction(() => onSelectMusicSource('spotify'));
                  }
                }}
                className={`pixel-btn text-[8px] py-2 px-2 text-left flex items-center gap-1.5 ${
                  musicSource === 'spotify'
                    ? 'bg-[#1db954] text-black font-bold'
                    : 'pixel-btn-secondary'
                }`}
              >
                <span className="w-2 h-2 bg-[#1db954] border border-black inline-block"></span>
                <span className="truncate">
                  {spotifyConnected ? 'SPOTIFY' : 'CONNECT SPOTIFY'}
                </span>
              </button>
            </div>

            {spotifyConnected && spotifyProfile && (
              <div className="pixel-card bg-[#1a162b] p-2 border border-[#3b325c] flex items-center justify-between text-[7px] font-retro">
                <span className="text-zinc-300 truncate">
                  👤 {spotifyProfile.displayName}
                </span>
                <button
                  onClick={() => handleAction(onDisconnectSpotify)}
                  className="text-rose-400 hover:text-rose-300 underline"
                >
                  Disconnect
                </button>
              </div>
            )}
          </section>

          {/* SECTION 1: 5 ROOM THEMES */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase">
              ROOM PALETTE THEME
            </div>
            <div className="grid grid-cols-1 gap-2">
              {themesList.map((tid) => {
                const conf = ROOM_THEMES[tid];
                const isSelected = currentTheme === tid;
                return (
                  <button
                    key={tid}
                    onClick={() => handleAction(() => onSelectTheme(tid))}
                    className={`pixel-btn p-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-2 border-amber-300 bg-[#251f38] text-amber-200'
                        : 'pixel-btn-secondary text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{conf.iconName}</span>
                      <div>
                        <div className="font-retro text-[8px] font-bold uppercase">
                          {conf.name}
                        </div>
                        <div className="text-[7px] text-zinc-400">{conf.tagline}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="pixel-badge bg-amber-400 text-black text-[6px] py-0 px-1 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: 3 HARDWARE PLAYER STYLES */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase">
              MUSIC PLAYER HARDWARE DECK
            </div>
            <div className="grid grid-cols-3 gap-2">
              {playerStyles.map((style) => {
                const isSelected = currentStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => handleAction(() => onSelectStyle(style.id))}
                    className={`pixel-btn p-2 text-center flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-400 text-black font-bold'
                        : 'pixel-btn-secondary text-zinc-300'
                    }`}
                  >
                    <span className="text-base">{style.icon}</span>
                    <span className="font-retro text-[7px] tracking-tight">{style.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: WEATHER & SKY */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase">
              WINDOW WEATHER & SKY
            </div>
            <div className="grid grid-cols-2 gap-2">
              {weatherOptions.map((item) => {
                const isSelected = weather === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAction(() => onSelectWeather(item.id))}
                    className={`pixel-btn p-2 text-left flex items-center gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'pixel-btn-secondary text-zinc-300'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-retro text-[7px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: LIGHTING MOOD */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase">
              ROOM LIGHTING AMBIENCE
            </div>
            <div className="grid grid-cols-3 gap-2">
              {lightingOptions.map((item) => {
                const isSelected = lightingMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAction(() => onSelectLighting(item.id))}
                    className={`pixel-btn p-2 text-center flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-black font-bold'
                        : 'pixel-btn-secondary text-zinc-300'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="font-retro text-[7px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 5: AUDIO REACTIVITY VISUALIZER */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase">
              AUDIO-REACTIVE VISUALIZER
            </div>
            <div className="grid grid-cols-3 gap-2">
              {visualizerOptions.map((opt) => {
                const isSelected = visualizerMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAction(() => onSelectVisualizer(opt.id))}
                    className={`pixel-btn p-2 text-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'pixel-btn-secondary text-zinc-300'
                    }`}
                  >
                    <div className="font-retro text-[8px]">{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 6: ROOM DETAILS & AUDIO TOGGLES */}
          <section className="space-y-2">
            <div className="font-retro text-[8px] text-zinc-400 tracking-widest uppercase">
              ENVIRONMENT DETAILS & SFX
            </div>
            <div className="pixel-card bg-[#181427] p-3 space-y-2.5 border-2 border-black">
              <label className="flex items-center justify-between font-retro text-[8px] text-zinc-300 cursor-pointer hover:text-white">
                <span className="flex items-center gap-1.5">
                  <span>🪴</span>
                  <span>Room Decorations (Plants, Ribbons)</span>
                </span>
                <input
                  type="checkbox"
                  checked={decorationsEnabled}
                  onChange={() => handleAction(onToggleDecorations)}
                  className="pixel-checkbox accent-pink-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between font-retro text-[8px] text-zinc-300 cursor-pointer hover:text-white">
                <span className="flex items-center gap-1.5">
                  <span>📻</span>
                  <span>Vinyl Dust & Static Crackle</span>
                </span>
                <input
                  type="checkbox"
                  checked={crackleEnabled}
                  onChange={() => handleAction(onToggleCrackle)}
                  className="pixel-checkbox accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between font-retro text-[8px] text-zinc-300 cursor-pointer hover:text-white">
                <span className="flex items-center gap-1.5">
                  <span>🔔</span>
                  <span>Chunky Pixel UI Sound Effects</span>
                </span>
                <input
                  type="checkbox"
                  checked={sfxEnabled}
                  onChange={() => handleAction(onToggleSfx)}
                  className="pixel-checkbox accent-emerald-500 cursor-pointer"
                />
              </label>

              {spotifyConnected && (
                <label className="flex items-center justify-between font-retro text-[8px] text-zinc-300 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span>👤</span>
                    <span>Show Spotify Avatar in Room</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showProfileInRoom}
                    onChange={(e) => handleAction(() => onToggleShowProfileInRoom(e.target.checked))}
                    className="pixel-checkbox accent-emerald-500 cursor-pointer"
                  />
                </label>
              )}
            </div>
          </section>

          {/* SECTION 7: RESET ROOM */}
          <section className="pt-2">
            <button
              onClick={() => handleAction(onResetRoom)}
              className="w-full pixel-btn bg-zinc-800 hover:bg-rose-900 text-rose-300 font-retro text-[8px] py-2.5 border-2 border-black flex items-center justify-center gap-2"
            >
              <span>↺</span>
              <span>RESTORE DEFAULT ROOM SANCTUARY</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
