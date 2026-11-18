import React, { useState } from 'react';
import { ThemeId, PlayerStyle, WeatherType, LightingMode, VisualizerMode, SpotifyProfile } from '../../types';
import { ROOM_THEMES } from './Themes';

interface RoomCanvasProps {
  themeId: ThemeId;
  playerStyle: PlayerStyle;
  isPlaying: boolean;
  decorationsEnabled: boolean;
  weather: WeatherType;
  lightingMode: LightingMode;
  visualizerMode: VisualizerMode;
  audioLevels: { bass: number; mid: number; treble: number; overall: number };
  isSpotifyActive?: boolean;
  spotifyTrackTitle?: string;
  spotifyArtist?: string;
  showProfileInRoom?: boolean;
  userProfile?: SpotifyProfile | null;
  onTogglePlay: () => void;
  onCycleWeather: () => void;
  onCycleLighting: () => void;
  onCycleTheme: () => void;
  onPetClick?: () => void;
  onPlantClick?: () => void;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  themeId,
  playerStyle,
  isPlaying,
  decorationsEnabled,
  weather,
  lightingMode,
  visualizerMode,
  audioLevels,
  isSpotifyActive = false,
  spotifyTrackTitle,
  spotifyArtist: _spotifyArtist,
  showProfileInRoom: _showProfileInRoom = true,
  userProfile: _userProfile,
  onTogglePlay,
  onCycleWeather,
  onCycleLighting,
  onCycleTheme,
  onPetClick,
  onPlantClick,
}) => {
  const [petHappy, setPetHappy] = useState(false);
  const [plantWiggle, setPlantWiggle] = useState(false);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const theme = ROOM_THEMES[themeId] || ROOM_THEMES.pastel;

  const isReactive = visualizerMode !== 'off';
  const intensityMultiplier = visualizerMode === 'dynamic' ? 1.6 : 0.8;
  const bassPulse = isReactive && isPlaying ? audioLevels.bass * intensityMultiplier : 0;
  const overallPulse = isReactive && isPlaying ? audioLevels.overall * intensityMultiplier : 0;

  const lampGlowOpacity = lightingMode === 'candle'
    ? 0.45 + (bassPulse * 0.25)
    : lightingMode === 'midnight'
      ? 0.15 + (overallPulse * 0.15)
      : 0.3;

  const lampGlowRadius = lightingMode === 'candle'
    ? 44 + (bassPulse * 18)
    : 32;

  const handlePetInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPetHappy(true);
    if (onPetClick) onPetClick();
    setTimeout(() => setPetHappy(false), 2200);
  };

  const handlePlantInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlantWiggle(true);
    if (onPlantClick) onPlantClick();
    setTimeout(() => setPlantWiggle(false), 1600);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Dynamic Lighting Tint Filter Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700 z-10"
        style={{
          background: lightingMode === 'midnight'
            ? 'radial-gradient(ellipse at 75% 45%, rgba(14, 30, 48, 0.25) 0%, rgba(4, 8, 14, 0.75) 100%)'
            : lightingMode === 'candle'
              ? 'radial-gradient(ellipse at 28% 68%, rgba(251, 146, 60, 0.22) 0%, rgba(6, 12, 18, 0.65) 100%)'
              : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.05) 0%, rgba(4, 8, 14, 0.4) 100%)',
          mixBlendMode: lightingMode === 'candle' ? 'screen' : 'multiply',
        }}
      />

      {/* --------------------------------------------------------------- */}
      {/* SEPARATE INTERACTIVE OBJECTS LAYER (Overlayed on Background) */}
      {/* --------------------------------------------------------------- */}
      <div className="relative w-full max-w-[1280px] aspect-[16/9] max-h-[92vh] flex items-center justify-center z-20">
        <svg
          viewBox="0 0 1024 575"
          className="w-full h-full object-contain block drop-shadow-2xl"
          shapeRendering="crispEdges"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* ----------------------------------------------------------- */}
          {/* 1. WINDOW WEATHER & SCENERY (Cutout at Left=614, Top=140) */}
          {/* ----------------------------------------------------------- */}
          <g
            id="interactive-window"
            className="cursor-pointer"
            onClick={onCycleWeather}
            onMouseEnter={() => setHoveredObject('Window • Click to Cycle Weather (Rain / Stars / Sun / Aurora)')}
            onMouseLeave={() => setHoveredObject(null)}
          >
            {/* Scenery backdrop fitted behind the transparent window opening */}
            <rect
              x="614"
              y="140"
              width="300"
              height="204"
              fill={
                weather === 'rain' ? '#090d18' :
                weather === 'stars' ? '#050a1a' :
                weather === 'sun' ? '#fed7aa' :
                '#021220'
              }
            />

            {/* Weather: RAIN */}
            {weather === 'rain' && (
              <g>
                {/* Midnight City Skyline */}
                <rect x="630" y="240" width="35" height="104" fill="#0c1324" />
                <rect x="680" y="220" width="40" height="124" fill="#0e172c" />
                <rect x="740" y="250" width="30" height="94" fill="#0b1220" />
                <rect x="790" y="210" width="45" height="134" fill="#111c34" />
                <rect x="850" y="235" width="40" height="109" fill="#0d1428" />

                {/* Distant cozy window lights */}
                <rect x="690" y="235" width="6" height="6" fill="#fbbf24" opacity="0.85" />
                <rect x="805" y="225" width="6" height="6" fill="#60a5fa" opacity="0.85" />
                <rect x="820" y="250" width="6" height="6" fill="#f43f5e" opacity="0.75" />

                {/* Moon with rain glow */}
                <circle cx="715" cy="180" r="14" fill="#fef08a" opacity="0.65" />

                {/* Animated Pixel Rain Streaks */}
                <line x1="630" y1="145" x2="624" y2="185" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.85" />
                <line x1="660" y1="160" x2="654" y2="210" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="8 10" opacity="0.85" />
                <line x1="700" y1="150" x2="694" y2="225" stroke="#bfdbfe" strokeWidth="2" strokeDasharray="6 6" opacity="0.9" />
                <line x1="750" y1="165" x2="744" y2="235" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="7 9" opacity="0.85" />
                <line x1="800" y1="145" x2="794" y2="215" stroke="#bfdbfe" strokeWidth="2" strokeDasharray="5 7" opacity="0.9" />
                <line x1="840" y1="170" x2="834" y2="250" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.85" />
                <line x1="885" y1="155" x2="879" y2="230" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.75" />
              </g>
            )}

            {/* Weather: STARS */}
            {weather === 'stars' && (
              <g>
                {/* Crescent Moon */}
                <circle cx="830" cy="185" r="22" fill="#fef08a" />
                <circle cx="838" cy="180" r="19" fill="#050a1a" />

                {/* Star Clusters */}
                <rect x="640" y="165" width="4" height="4" fill="#fff" className="anim-blink" />
                <rect x="685" y="195" width="3" height="3" fill="#bae6fd" />
                <rect x="740" y="160" width="4" height="4" fill="#fde047" className="anim-blink" />
                <rect x="780" y="210" width="3" height="3" fill="#fff" />
                <rect x="880" y="165" width="4" height="4" fill="#fbcfe8" className="anim-blink" />
                <rect x="660" y="255" width="3" height="3" fill="#fff" />
                <rect x="760" y="265" width="4" height="4" fill="#bae6fd" />
                <rect x="860" y="245" width="3" height="3" fill="#fff" />
              </g>
            )}

            {/* Weather: SUN */}
            {weather === 'sun' && (
              <g>
                {/* Sunset sky */}
                <rect x="614" y="140" width="300" height="70" fill="#f97316" />
                <rect x="614" y="210" width="300" height="70" fill="#fbbf24" />
                <rect x="614" y="280" width="300" height="64" fill="#fef08a" />
                {/* Radiant Sun */}
                <circle cx="764" cy="220" r="32" fill="#fff7ed" />
                <rect x="640" y="190" width="50" height="10" fill="#fed7aa" opacity="0.8" />
                <rect x="820" y="240" width="60" height="12" fill="#fed7aa" opacity="0.8" />
                {/* Golden sunbeam cutting into room */}
                <polygon
                  points="914,340 760,575 520,575 614,344"
                  fill="#fef08a"
                  opacity={lightingMode === 'candle' ? '0.1' : '0.22'}
                />
              </g>
            )}

            {/* Weather: AURORA */}
            {weather === 'aurora' && (
              <g>
                <path d="M 614,190 Q 720,160 914,180" stroke="#10b981" strokeWidth="16" opacity="0.65" fill="none" />
                <path d="M 614,220 Q 750,180 914,210" stroke="#06b6d4" strokeWidth="14" opacity="0.7" fill="none" />
                <path d="M 614,250 Q 730,220 914,240" stroke="#8b5cf6" strokeWidth="12" opacity="0.6" fill="none" />
                <line x1="640" y1="160" x2="710" y2="175" stroke="#fff" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="710" y="174" width="4" height="4" fill="#00f0ff" />
              </g>
            )}

            {/* Window Highlight Outline on Hover */}
            {hoveredObject?.includes('Window') && (
              <rect
                x="614"
                y="140"
                width="300"
                height="204"
                fill="none"
                stroke="#fef08a"
                strokeWidth="4"
                strokeDasharray="8 4"
              />
            )}
          </g>

          {/* ----------------------------------------------------------- */}
          {/* 1.5 MAIN ROOM BACKGROUND LAYER (Exact User Asset)           */}
          {/* ----------------------------------------------------------- */}
          <image
            href="/assets/room-background.png"
            x="0"
            y="0"
            width="1024"
            height="575"
            preserveAspectRatio="none"
            style={{ imageRendering: 'pixelated' }}
            pointerEvents="none"
          />

          {/* Transparent Click Target for Window */}
          <rect
            x="613"
            y="140"
            width="303"
            height="206"
            fill="transparent"
            className="cursor-pointer"
            onClick={onCycleWeather}
            onMouseEnter={() => setHoveredObject('Window • Click to Cycle Weather (Rain / Stars / Sun / Aurora)')}
            onMouseLeave={() => setHoveredObject(null)}
          />

          {/* ----------------------------------------------------------- */}
          {/* 2. INTERACTIVE BOOKSHELF / THEME HOTSPOT (Back Left Wall) */}
          {/* ----------------------------------------------------------- */}
          <g
            id="interactive-bookshelf"
            className="cursor-pointer"
            onClick={onCycleTheme}
            onMouseEnter={() => setHoveredObject(`Bookshelf • Click to Change Room Theme (Current: ${theme.name})`)}
            onMouseLeave={() => setHoveredObject(null)}
            transform="translate(140, 160)"
          >
            {/* Shelf Bracket & Planks */}
            <rect x="0" y="24" width="160" height="10" fill="#2d1b11" stroke="#000" strokeWidth="2" />
            <rect x="0" y="68" width="160" height="10" fill="#2d1b11" stroke="#000" strokeWidth="2" />

            {/* Top Shelf Books */}
            <rect x="12" y="2" width="14" height="22" fill={theme.palette.primary} stroke="#000" strokeWidth="1.5" />
            <rect x="28" y="-2" width="12" height="26" fill={theme.palette.accent} stroke="#000" strokeWidth="1.5" />
            <rect x="42" y="4" width="14" height="20" fill="#10b981" stroke="#000" strokeWidth="1.5" />
            <rect x="58" y="-4" width="16" height="28" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
            <rect x="76" y="2" width="12" height="22" fill="#38bdf8" stroke="#000" strokeWidth="1.5" />
            {/* Crystal Figurine knick-knack */}
            <polygon points="120,4 128,-8 136,4 128,18" fill="#a855f7" stroke="#000" strokeWidth="1.5" />

            {/* Bottom Shelf Books */}
            <rect x="16" y="46" width="16" height="22" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
            <rect x="34" y="42" width="14" height="26" fill="#eab308" stroke="#000" strokeWidth="1.5" />
            <rect x="50" y="48" width="12" height="20" fill="#8b5cf6" stroke="#000" strokeWidth="1.5" />
            <rect x="64" y="44" width="18" height="24" fill="#06b6d4" stroke="#000" strokeWidth="1.5" />

            {/* Hover Indicator Frame */}
            {hoveredObject?.includes('Bookshelf') && (
              <rect x="-6" y="-12" width="172" height="96" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="6 3" />
            )}
          </g>

          {/* ----------------------------------------------------------- */}
          {/* 3. WALL POSTERS & FAIRY LIGHTS (Decorations Layer) */}
          {/* ----------------------------------------------------------- */}
          {decorationsEnabled && (
            <g id="decorations-layer">
              {/* Indie Music Poster on Left Wall */}
              <g transform="translate(340, 160)">
                <rect x="0" y="0" width="70" height="90" fill="#18181b" stroke="#000" strokeWidth="3" />
                <rect x="4" y="4" width="62" height="82" fill={theme.palette.cardBg} />
                <circle cx="35" cy="40" r="18" fill={theme.palette.primary} />
                <text x="24" y="47" fill="#fff" fontSize="18" fontFamily="var(--font-retro)">♫</text>
                <rect x="12" y="68" width="46" height="4" fill="#000" opacity="0.6" />
                <rect x="16" y="76" width="38" height="3" fill="#000" opacity="0.4" />
              </g>

              {/* Glowing Fairy Lights hanging across the ceiling */}
              <g transform="translate(100, 30)">
                <path d="M 0,20 Q 200,50 400,20" stroke="#000" strokeWidth="2" fill="none" />
                <circle cx="80" cy="30" r="4" fill="#fbbf24" className="anim-blink" />
                <circle cx="160" cy="36" r="4" fill="#ec4899" className="anim-blink" />
                <circle cx="240" cy="36" r="4" fill="#38bdf8" className="anim-blink" />
                <circle cx="320" cy="30" r="4" fill="#86efac" className="anim-blink" />
              </g>
            </g>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 4. LISTENING DESK & HARDWARE AUDIO SETUP (Left Foreground) */}
          {/* ----------------------------------------------------------- */}
          <g id="listening-desk-setup" transform="translate(180, 310)">
            {/* Wooden Study Desk Top */}
            <rect x="0" y="0" width="280" height="30" fill="#78350f" stroke="#000" strokeWidth="3" />
            <rect x="0" y="30" width="280" height="15" fill="#451a03" stroke="#000" strokeWidth="2" />
            {/* Desk Legs */}
            <rect x="15" y="45" width="16" height="165" fill="#2d1b11" stroke="#000" strokeWidth="3" />
            <rect x="250" y="45" width="16" height="165" fill="#2d1b11" stroke="#000" strokeWidth="3" />
            <rect x="235" y="60" width="40" height="120" fill="#451a03" stroke="#000" strokeWidth="2" />

            {/* Steaming Mug on Desk */}
            <g transform="translate(40, -25)">
              <rect x="0" y="5" width="16" height="20" fill="#f8fafc" stroke="#000" strokeWidth="2" />
              <ellipse cx="8" cy="5" rx="8" ry="3" fill="#e2e8f0" stroke="#000" strokeWidth="1.5" />
              <ellipse cx="8" cy="5" rx="6" ry="2" fill="#451a03" />
              <path d="M 16,8 C 22,8 22,18 16,18" stroke="#000" strokeWidth="2" fill="none" />
              <path d="M 6,-2 Q 10,-8 6,-14" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.65" className="anim-float" />
            </g>

            {/* Propped Spotify Album Sleeve on Desk when Spotify is Active */}
            {isSpotifyActive && (
              <g transform="translate(200, -50)">
                <rect x="0" y="0" width="36" height="50" fill="#1db954" stroke="#000" strokeWidth="2.5" />
                <circle cx="18" cy="22" r="10" fill="#000" />
                <path d="M 12,20 Q 18,17 24,19" stroke="#1db954" strokeWidth="2" fill="none" />
                <path d="M 13,24 Q 18,21 23,23" stroke="#1db954" strokeWidth="1.8" fill="none" />
                <text x="4" y="44" fill="#000" fontSize="5" fontFamily="var(--font-retro)">SPOTIFY</text>
              </g>
            )}

            {/* --------------------------------------------------------- */}
            {/* INTERACTIVE HARDWARE PLAYER UNIT (Vinyl/CD/Tape) */}
            {/* --------------------------------------------------------- */}
            <g
              id="interactive-player-unit"
              className="cursor-pointer"
              onClick={onTogglePlay}
              onMouseEnter={() => setHoveredObject(
                isSpotifyActive
                  ? `Player (Spotify: ${spotifyTrackTitle || 'Idle'}) • Click to Play/Pause`
                  : `Player (${playerStyle.toUpperCase()}) • Click to Play/Pause`
              )}
              onMouseLeave={() => setHoveredObject(null)}
              transform={`translate(80, ${-60 - (bassPulse > 0.4 ? 2 : 0)})`}
            >
              {/* Turntable Platter and Tonearm */}
              {playerStyle === 'vinyl' && (
                <g>
                  {/* Turntable Base Body */}
                  <rect x="0" y="0" width="110" height="60" fill={theme.palette.cardBg} stroke="#000" strokeWidth="3" />
                  <rect x="0" y="60" width="110" height="8" fill="#0f172a" stroke="#000" strokeWidth="2" />

                  {/* Spinning Vinyl Record */}
                  <circle
                    cx="50"
                    cy="30"
                    r="24"
                    fill="#09090b"
                    stroke="#000"
                    strokeWidth="2.5"
                    className={isPlaying ? "anim-pixel-spin" : ""}
                  />
                  <circle cx="50" cy="30" r="18" fill="none" stroke="#27272a" strokeWidth="1.5" />
                  <circle cx="50" cy="30" r="11" fill="none" stroke="#18181b" strokeWidth="1.5" />
                  {/* Center Label */}
                  <circle cx="50" cy="30" r="7" fill={isSpotifyActive ? '#1db954' : theme.palette.primary} />
                  <circle cx="50" cy="30" r="2" fill="#fff" />

                  {/* Tonearm */}
                  <line
                    x1="92"
                    y1="16"
                    x2={isPlaying ? "62" : "88"}
                    y2={isPlaying ? "30" : "42"}
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <circle cx="92" cy="16" r="5" fill="#71717a" stroke="#000" strokeWidth="1.5" />
                  <rect
                    x={isPlaying ? 58 : 84}
                    y={isPlaying ? 28 : 40}
                    width="6"
                    height="5"
                    fill="#ef4444"
                  />
                </g>
              )}

              {/* CD Discman */}
              {playerStyle === 'cd' && (
                <g>
                  <rect x="0" y="0" width="110" height="60" fill="#94a3b8" stroke="#000" strokeWidth="3" />
                  <rect x="0" y="60" width="110" height="8" fill="#475569" stroke="#000" strokeWidth="2" />
                  <circle
                    cx="55"
                    cy="30"
                    r="23"
                    fill="#e2e8f0"
                    stroke="#000"
                    strokeWidth="2"
                    className={isPlaying ? "anim-pixel-spin" : ""}
                  />
                  <circle cx="55" cy="30" r="16" fill="#38bdf8" opacity="0.6" />
                  <circle cx="55" cy="30" r="4" fill="#000" />
                  {/* LCD Display */}
                  <rect x="8" y="10" width="24" height="12" fill="#0284c7" stroke="#000" strokeWidth="1" />
                  <text x="10" y="18" fill="#fff" fontSize="5" fontFamily="var(--font-retro)">{isPlaying ? "PLAY" : "STOP"}</text>
                </g>
              )}

              {/* Cassette Boombox */}
              {playerStyle === 'cassette' && (
                <g>
                  <rect x="0" y="0" width="110" height="60" fill="#3b82f6" stroke="#000" strokeWidth="3" />
                  <rect x="0" y="60" width="110" height="8" fill="#1d4ed8" stroke="#000" strokeWidth="2" />
                  {/* Speakers */}
                  <circle cx="20" cy="30" r="14" fill="#1e293b" stroke="#000" strokeWidth="2" />
                  <circle cx="90" cy="30" r="14" fill="#1e293b" stroke="#000" strokeWidth="2" />
                  {/* Cassette Door */}
                  <rect x="40" y="15" width="30" height="30" fill="#1e293b" stroke="#000" strokeWidth="2" />
                  <circle cx="48" cy="30" r="4" fill="#fff" className={isPlaying ? "anim-pixel-spin" : ""} />
                  <circle cx="62" cy="30" r="4" fill="#fff" className={isPlaying ? "anim-pixel-spin" : ""} />
                </g>
              )}

              {/* Floating Music Notes when Playing */}
              {isPlaying && (
                <g className="anim-float">
                  <text x="30" y="-10" fill={theme.palette.primary} fontSize="18" fontFamily="var(--font-retro)">♪</text>
                  <text x="65" y="-22" fill={theme.palette.accent} fontSize="16" fontFamily="var(--font-retro)">♫</text>
                  <text x="95" y="-8" fill="#fde047" fontSize="14" fontFamily="var(--font-retro)">★</text>
                </g>
              )}

              {/* Highlight outline on hover */}
              {hoveredObject?.includes('Player') && (
                <rect x="-6" y="-6" width="122" height="78" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="6 3" />
              )}
            </g>

            {/* --------------------------------------------------------- */}
            {/* INTERACTIVE DESK LAMP (Candlelight Glow) */}
            {/* --------------------------------------------------------- */}
            <g
              id="interactive-lamp"
              className="cursor-pointer"
              onClick={onCycleLighting}
              onMouseEnter={() => setHoveredObject(`Lamp • Click to Cycle Light (${lightingMode.toUpperCase()})`)}
              onMouseLeave={() => setHoveredObject(null)}
              transform="translate(230, -75)"
            >
              {/* Lamp Base & Neck */}
              <ellipse cx="14" cy="45" rx="10" ry="5" fill="#000" />
              <path d="M 14,45 Q 24,20 16,0" stroke="#000" strokeWidth="4" fill="none" />
              <polygon
                points="4,0 30,-5 24,-20 10,-18"
                fill={theme.palette.primary}
                stroke={hoveredObject?.includes('Lamp') ? '#fef08a' : '#000'}
                strokeWidth={hoveredObject?.includes('Lamp') ? '3' : '2'}
              />
              <circle cx="16" cy="4" r="4" fill="#fef08a" />

              {/* Ambient Candlelight / Lamp Glow Cone */}
              <ellipse
                cx="16"
                cy="28"
                rx={lampGlowRadius * 1.5}
                ry={lampGlowRadius}
                fill={lightingMode === 'candle' ? '#f59e0b' : '#fef08a'}
                opacity={lampGlowOpacity}
                style={{ mixBlendMode: 'screen', transition: 'all 0.1s linear' }}
              />
              <polygon
                points="16,4 -30,85 65,80"
                fill={lightingMode === 'candle' ? '#fbbf24' : '#fef08a'}
                opacity={lampGlowOpacity * 0.75}
                style={{ mixBlendMode: 'screen' }}
              />
            </g>
          </g>

          {/* ----------------------------------------------------------- */}
          {/* 5. INTERACTIVE SLEEPING PET (Center Floor) */}
          {/* ----------------------------------------------------------- */}
          <g
            id="interactive-pet"
            className="cursor-pointer"
            onClick={handlePetInteraction}
            onMouseEnter={() => setHoveredObject('Sleeping Pet • Click to Pet (Purr & Hearts)')}
            onMouseLeave={() => setHoveredObject(null)}
            transform="translate(560, 440)"
          >
            {/* Cozy Floor Cushion */}
            <ellipse cx="25" cy="20" rx="36" ry="18" fill={theme.palette.cardBg} stroke="#000" strokeWidth="2.5" />

            {/* Pet Body with gentle breathing animation */}
            <ellipse
              cx="25"
              cy="16"
              rx="20"
              ry="14"
              fill={themeId === 'earth' ? '#d97706' : themeId === 'grunge' ? '#18181b' : '#f8fafc'}
              stroke={hoveredObject?.includes('Pet') ? '#fef08a' : '#000'}
              strokeWidth={hoveredObject?.includes('Pet') ? '3' : '2'}
              className="anim-cat"
            />
            {/* Pet Head */}
            <circle
              cx="12"
              cy="14"
              r="10"
              fill={themeId === 'earth' ? '#d97706' : themeId === 'grunge' ? '#18181b' : '#f8fafc'}
              stroke="#000"
              strokeWidth="2"
            />
            <polygon points="6,6 10,0 14,6" fill="#f43f5e" />
            <polygon points="14,6 18,0 22,6" fill="#f43f5e" />
            <line x1="8" y1="14" x2="12" y2="16" stroke="#000" strokeWidth="2" />
            <path d="M 42,16 Q 50,8 46,4" stroke="#000" strokeWidth="3" fill="none" />
            <rect x="16" y="18" width="6" height="4" fill="#ef4444" />

            {/* Heart emote or ZZZ */}
            {petHappy ? (
              <g className="anim-float">
                <rect x="16" y="-20" width="10" height="10" fill="#f43f5e" />
                <rect x="12" y="-17" width="18" height="6" fill="#f43f5e" />
                <text x="36" y="-10" fill="#f43f5e" fontSize="10" fontFamily="var(--font-retro)">PURR~♥</text>
              </g>
            ) : (
              <text x="36" y="-4" fill="#fff" fontSize="10" fontFamily="var(--font-retro)" opacity="0.8">z</text>
            )}
          </g>

          {/* ----------------------------------------------------------- */}
          {/* 6. INTERACTIVE POTTED HOUSEPLANT (Foreground Right) */}
          {/* ----------------------------------------------------------- */}
          <g
            id="interactive-plant"
            className="cursor-pointer"
            onClick={handlePlantInteraction}
            onMouseEnter={() => setHoveredObject('Houseplant • Click to Rustle Leaves')}
            onMouseLeave={() => setHoveredObject(null)}
            transform="translate(860, 400)"
          >
            {/* Terracotta Pot */}
            <polygon points="8,40 52,32 46,80 14,88" fill="#c2410c" stroke="#000" strokeWidth="3" />
            <polygon
              points="4,36 56,28 52,42 6,50"
              fill="#ea580c"
              stroke={hoveredObject?.includes('Houseplant') ? '#fef08a' : '#000'}
              strokeWidth={hoveredObject?.includes('Houseplant') ? '3' : '2'}
            />
            <ellipse cx="30" cy="36" rx="26" ry="6" fill="#451a03" />

            {/* Swaying Monstera Foliage */}
            <g className={plantWiggle ? "anim-plant" : "anim-plant"}>
              <line x1="30" y1="36" x2="10" y2="-4" stroke="#15803d" strokeWidth="4" />
              <line x1="30" y1="36" x2="48" y2="-12" stroke="#15803d" strokeWidth="4" />
              <line x1="30" y1="36" x2="28" y2="-24" stroke="#15803d" strokeWidth="4" />

              <ellipse cx="8" cy="-4" rx="18" ry="12" fill="#16a34a" stroke="#000" strokeWidth="2" />
              <circle cx="6" cy="-4" r="3" fill="#15803d" />

              <ellipse cx="28" cy="-28" rx="22" ry="16" fill="#22c55e" stroke="#000" strokeWidth="2" />
              <line x1="28" y1="-42" x2="28" y2="-14" stroke="#15803d" strokeWidth="2" />

              <ellipse cx="50" cy="-12" rx="20" ry="14" fill="#16a34a" stroke="#000" strokeWidth="2" />
              <circle cx="52" cy="-12" r="3" fill="#15803d" />
            </g>

            {/* Sparkles on click */}
            {plantWiggle && (
              <g className="anim-float">
                <rect x="24" y="-48" width="6" height="6" fill="#fef08a" />
                <rect x="44" y="-40" width="6" height="6" fill="#86efac" />
                <text x="6" y="-52" fill="#86efac" fontSize="9" fontFamily="var(--font-retro)">RUSTLE~</text>
              </g>
            )}
          </g>
        </svg>

        {/* Dynamic In-Room Hover Tooltip Pill */}
        {hoveredObject && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pixel-card bg-[#110e1a]/95 text-amber-300 px-3 py-1.5 text-[9px] font-retro border-2 border-black shadow-[3px_3px_0_#000] anim-float pointer-events-none flex items-center gap-2 z-30">
            <span>👉</span>
            <span>{hoveredObject}</span>
          </div>
        )}
      </div>
    </div>
  );
};
