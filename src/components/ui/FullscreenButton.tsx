import React, { useState, useEffect } from 'react';

interface FullscreenButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  targetRef,
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return !!(
      document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
    );
  });

  // Synchronize state with actual document fullscreen state and browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );
      setIsFullscreen(active);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // When fullscreen mode becomes active, completely hide the button
  if (isFullscreen) {
    return null;
  }

  const handleRequestFullscreen = () => {
    const element = targetRef.current || document.documentElement;

    try {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      } else if ((element as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        (element as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((element as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        (element as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen not supported or blocked:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRequestFullscreen}
      className={`pixel-fullscreen-btn fixed top-3 right-3 sm:top-4 sm:right-4 z-50 p-0 m-0 border-0 bg-transparent cursor-pointer select-none focus:outline-none ${className}`}
      title="Enter Fullscreen"
      aria-label="Enter Fullscreen"
    >
      <img
        src="/assets/fullscreen-button.png"
        alt="FULLSCREEN"
        className="w-36 sm:w-44 md:w-52 h-auto block"
        style={{
          imageRendering: 'pixelated',
        }}
        draggable={false}
      />
    </button>
  );
};
