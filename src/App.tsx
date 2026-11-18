import React, { useState, useRef } from 'react';
import { FullscreenButton } from './components/ui/FullscreenButton';
import { WindowScene } from './components/room/WindowScene';

export const App: React.FC = () => {
  // Main Room Container Reference for Fullscreen API
  const roomContainerRef = useRef<HTMLDivElement>(null);

  // Time state: checks local time initially, can be manually toggled for testing
  const [isDay, setIsDay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const hour = new Date().getHours();
    return hour >= 6 && hour < 19;
  });

  const handleToggleDayNight = () => {
    setIsDay((prev) => !prev);
  };

  return (
    <div
      ref={roomContainerRef}
      id="roomtone-room-container"
      className="relative w-screen h-screen overflow-hidden select-none bg-[#071118]"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. ANIMATED PIXEL-ART WINDOW SCENE & ROOM BACKGROUND           */}
      {/* ------------------------------------------------------------- */}
      <WindowScene isDay={isDay} onToggleDayNight={handleToggleDayNight} />

      {/* ------------------------------------------------------------- */}
      {/* 2. CUSTOM PIXEL-ART DAY / NIGHT TOGGLE BUTTON                 */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50">
        <button
          type="button"
          onClick={handleToggleDayNight}
          className="pixel-mode-btn p-0 m-0 border-0 bg-transparent cursor-pointer select-none focus:outline-none"
          title={isDay ? "Day Sky (Click to switch to Night Sky)" : "Night Sky (Click to switch to Day Sky)"}
          aria-label={isDay ? "Switch to Night Mode" : "Switch to Day Mode"}
        >
          <img
            src={isDay ? "/assets/day-button.png" : "/assets/night-button.png"}
            alt={isDay ? "Day Sky Active" : "Night Sky Active"}
            className="w-11 sm:w-12 md:w-13 h-auto block drop-shadow-[2px_2px_0_#000]"
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CUSTOM 8-BIT FULLSCREEN BUTTON (Top-Right Corner)           */}
      {/* ------------------------------------------------------------- */}
      <FullscreenButton targetRef={roomContainerRef} />
    </div>
  );
};

export default App;
