import React from 'react';

interface WindowSceneProps {
  isDay: boolean;
  onToggleDayNight?: () => void;
}

export const WindowScene: React.FC<WindowSceneProps> = ({ isDay, onToggleDayNight }) => {
  return (
    <svg
      viewBox="0 0 1024 575"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ imageRendering: 'pixelated' }}
    >
      <defs>
        {/* Clipping mask strictly bounding the exterior view to the window opening */}
        <clipPath id="roomtone-window-clip">
          <rect x="613" y="140" width="303" height="206" />
        </clipPath>
      </defs>

      {/* ============================================================= */}
      {/* 1. ANIMATED EXTERIOR SCENE (BEHIND ROOM BACKGROUND)           */}
      {/* ============================================================= */}
      <g clipPath="url(#roomtone-window-clip)">
        {/* Sky Base Color Fill */}
        <rect
          x="613"
          y="140"
          width="303"
          height="206"
          fill={isDay ? '#67c6fa' : '#0d2260'}
          style={{ transition: 'fill 1.8s ease-in-out' }}
        />

        {/* ----------------------------------------------------------- */}
        {/* A. DAYTIME SCENE GROUP (Sky, Compact Sun, Random Clouds)    */}
        {/* ----------------------------------------------------------- */}
        <g
          style={{
            opacity: isDay ? 1 : 0,
            transition: 'opacity 1.8s ease-in-out',
            pointerEvents: isDay ? 'auto' : 'none',
          }}
        >
          {/* Day Sky Backdrop */}
          <image
            href="/assets/window/day-sky.png"
            x="581"
            y="88"
            width="479"
            height="270"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Arcing Pixel Sun (Rises East, curves across midday zenith, sets West in imperceptibly slow real-life arc) */}
          <g>
            <animateMotion
              path="M 915,270 Q 764,35 615,270"
              dur="600s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0; 1; 1; 1; 0; 0"
              keyTimes="0; 0.08; 0.5; 0.92; 1; 1"
              dur="600s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/sun.png"
              x="-37"
              y="-36"
              width="74"
              height="73"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 1: Distant Horizon Cloud Bank (Slowest background drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-509 0"
              dur="54s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-bank.png"
              x="481"
              y="245"
              width="509"
              height="115"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-bank.png"
              x="990"
              y="245"
              width="509"
              height="115"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 2: Small High-Altitude Cloud (Fast breeze) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-480 0"
              dur="18s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-5.png"
              x="630"
              y="144"
              width="65"
              height="44"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-5.png"
              x="1110"
              y="144"
              width="65"
              height="44"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 3: Medium Puffy Cloud (Moderate steady drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-520 0"
              dur="29s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-1.png"
              x="790"
              y="172"
              width="95"
              height="48"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-1.png"
              x="1310"
              y="172"
              width="95"
              height="48"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 4: Large Billowy Cloud (Sweeping lower drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-560 0"
              dur="23s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-3.png"
              x="880"
              y="205"
              width="130"
              height="69"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-3.png"
              x="1440"
              y="205"
              width="130"
              height="69"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 5: Flatter Wide Cloud (Lazy low-mid drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-500 0"
              dur="37s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-2.png"
              x="660"
              y="228"
              width="105"
              height="44"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-2.png"
              x="1160"
              y="228"
              width="105"
              height="44"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 6: Upper-Mid Graceful Cloud (Slow majestic float) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-490 0"
              dur="43s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-4.png"
              x="730"
              y="158"
              width="115"
              height="59"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-4.png"
              x="1220"
              y="158"
              width="115"
              height="59"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Cloud 7: Mini Puffy Cloud (Zippy little cloud) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-440 0"
              dur="15s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/day-cloud-5.png"
              x="940"
              y="192"
              width="58"
              height="40"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/day-cloud-5.png"
              x="1380"
              y="192"
              width="58"
              height="40"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>
        </g>

        {/* ----------------------------------------------------------- */}
        {/* B. NIGHTTIME SCENE GROUP (Sky, Moon, Stars, Random Clouds)  */}
        {/* ----------------------------------------------------------- */}
        <g
          style={{
            opacity: isDay ? 0 : 1,
            transition: 'opacity 1.8s ease-in-out',
            pointerEvents: isDay ? 'none' : 'auto',
          }}
        >
          {/* Night Sky Backdrop */}
          <image
            href="/assets/window/night-sky.png"
            x="595"
            y="105"
            width="451"
            height="253"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Arcing Crescent Moon (Rises East, curves across midnight apex, sets West in imperceptibly slow real-life arc) */}
          <g>
            <animateMotion
              path="M 905,260 Q 764,45 625,260"
              dur="720s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0; 1; 1; 1; 0; 0"
              keyTimes="0; 0.08; 0.5; 0.92; 1; 1"
              dur="720s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/moon.png"
              x="-33"
              y="-30"
              width="66"
              height="61"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Dainty, Small Twinkling Stars (Stationary in plane, No scale jumping) */}
          {/* Star 1: Delicate 4-point North Star in left pane */}
          <g className="anim-star-shimmer-1">
            <image
              href="/assets/window/stars-2.png"
              x="648"
              y="172"
              width="14"
              height="14"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 2: Companion 4-point star in upper right pane */}
          <g className="anim-star-shimmer-2">
            <image
              href="/assets/window/stars-3.png"
              x="888"
              y="172"
              width="12"
              height="12"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 3: Diamond star in mid left pane */}
          <g className="anim-star-shimmer-3">
            <image
              href="/assets/window/stars-3.png"
              x="720"
              y="215"
              width="10"
              height="10"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 4: Pinpoint star cluster in upper left pane */}
          <g className="anim-star-shimmer-4">
            <image
              href="/assets/window/stars-1.png"
              x="692"
              y="188"
              width="20"
              height="21"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 5: Pinpoint star cluster in right pane */}
          <g className="anim-star-shimmer-1">
            <image
              href="/assets/window/stars-1.png"
              x="840"
              y="245"
              width="22"
              height="23"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 6: Horizon star cluster in lower left pane */}
          <g className="anim-star-shimmer-2">
            <image
              href="/assets/window/stars-4.png"
              x="652"
              y="298"
              width="36"
              height="12"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 7: Jewel star in mid right pane */}
          <g className="anim-star-shimmer-3">
            <image
              href="/assets/window/stars-3.png"
              x="792"
              y="198"
              width="9"
              height="9"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Star 8: Sparkling star in mid-low left pane */}
          <g className="anim-star-shimmer-4">
            <image
              href="/assets/window/stars-2.png"
              x="636"
              y="242"
              width="11"
              height="11"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 1: Distant Horizon Night Cloud Bank (Slow background drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-537 0"
              dur="58s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-bank.png"
              x="493"
              y="240"
              width="537"
              height="130"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-bank.png"
              x="1030"
              y="240"
              width="537"
              height="130"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 2: Small High-Altitude Night Cloud (Brisk drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-470 0"
              dur="19s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-4.png"
              x="640"
              y="146"
              width="68"
              height="49"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-4.png"
              x="1110"
              y="146"
              width="68"
              height="49"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 3: Medium Night Cloud (Steady drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-510 0"
              dur="31s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-1.png"
              x="820"
              y="178"
              width="105"
              height="53"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-1.png"
              x="1330"
              y="178"
              width="105"
              height="53"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 4: Large Billowy Night Cloud (Sweeping drift) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-540 0"
              dur="25s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-2.png"
              x="670"
              y="210"
              width="135"
              height="70"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-2.png"
              x="1210"
              y="210"
              width="135"
              height="70"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 5: Low-Mid Night Cloud (Lazy float) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-480 0"
              dur="39s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-3.png"
              x="890"
              y="242"
              width="88"
              height="53"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-3.png"
              x="1370"
              y="242"
              width="88"
              height="53"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 6: Wispy High-Mid Cloud (Fast breeze) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-450 0"
              dur="16s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-4.png"
              x="740"
              y="165"
              width="60"
              height="43"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-4.png"
              x="1190"
              y="165"
              width="60"
              height="43"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Night Cloud 7: Midground Drifting Cloud (Slow majestic float) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-500 0"
              dur="46s"
              repeatCount="indefinite"
            />
            <image
              href="/assets/window/night-cloud-1.png"
              x="950"
              y="198"
              width="90"
              height="46"
              style={{ imageRendering: 'pixelated' }}
            />
            <image
              href="/assets/window/night-cloud-1.png"
              x="1450"
              y="198"
              width="90"
              height="46"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>
        </g>
      </g>

      {/* ============================================================= */}
      {/* 2. ORIGINAL ROOM BACKGROUND ARTWORK (IN FRONT OF WINDOW)       */}
      {/* ============================================================= */}
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

      {/* ============================================================= */}
      {/* 3. INTERACTIVE WINDOW HIT-BOX (Click to toggle Day/Night)     */}
      {/* ============================================================= */}
      <rect
        x="613"
        y="140"
        width="303"
        height="206"
        fill="transparent"
        className="cursor-pointer pointer-events-auto"
        onClick={onToggleDayNight}
      >
        <title>Click Window to Toggle Day/Night Scene</title>
      </rect>
    </svg>
  );
};
