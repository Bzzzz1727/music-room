import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const PixelPlay: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="3" y="2" width="2" height="12" />
    <rect x="5" y="3" width="2" height="10" />
    <rect x="7" y="4" width="2" height="8" />
    <rect x="9" y="5" width="2" height="6" />
    <rect x="11" y="6" width="2" height="4" />
    <rect x="13" y="7" width="1" height="2" />
  </svg>
);

export const PixelPause: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="3" y="2" width="3" height="12" />
    <rect x="10" y="2" width="3" height="12" />
  </svg>
);

export const PixelNext: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="2" y="3" width="2" height="10" />
    <rect x="4" y="4" width="2" height="8" />
    <rect x="6" y="5" width="2" height="6" />
    <rect x="8" y="6" width="2" height="4" />
    <rect x="9" y="3" width="2" height="10" />
    <rect x="11" y="4" width="2" height="8" />
    <rect x="13" y="2" width="2" height="12" />
  </svg>
);

export const PixelPrev: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="1" y="2" width="2" height="12" />
    <rect x="3" y="4" width="2" height="8" />
    <rect x="5" y="3" width="2" height="10" />
    <rect x="7" y="6" width="2" height="4" />
    <rect x="9" y="5" width="2" height="6" />
    <rect x="11" y="4" width="2" height="8" />
    <rect x="13" y="3" width="2" height="10" />
  </svg>
);

export const PixelShuffle: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="1" y="3" width="3" height="2" />
    <rect x="4" y="4" width="2" height="2" />
    <rect x="6" y="5" width="2" height="2" />
    <rect x="8" y="7" width="2" height="2" />
    <rect x="10" y="9" width="2" height="2" />
    <rect x="12" y="10" width="3" height="2" />
    <rect x="13" y="8" width="2" height="2" />
    <rect x="13" y="12" width="2" height="2" />
    <rect x="1" y="11" width="3" height="2" />
    <rect x="4" y="10" width="2" height="2" />
    <rect x="10" y="5" width="2" height="2" />
    <rect x="12" y="4" width="3" height="2" />
    <rect x="13" y="2" width="2" height="2" />
    <rect x="13" y="6" width="2" height="2" />
  </svg>
);

export const PixelVolume: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="1" y="6" width="3" height="4" />
    <rect x="4" y="5" width="2" height="6" />
    <rect x="6" y="4" width="2" height="8" />
    <rect x="8" y="3" width="2" height="10" />
    <rect x="11" y="5" width="1" height="6" />
    <rect x="12" y="4" width="1" height="2" />
    <rect x="12" y="10" width="1" height="2" />
    <rect x="14" y="3" width="1" height="10" />
  </svg>
);

export const PixelMute: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="1" y="6" width="3" height="4" />
    <rect x="4" y="5" width="2" height="6" />
    <rect x="6" y="4" width="2" height="8" />
    <rect x="8" y="3" width="2" height="10" />
    <rect x="11" y="6" width="1" height="1" />
    <rect x="12" y="7" width="1" height="2" />
    <rect x="11" y="9" width="1" height="1" />
    <rect x="14" y="6" width="1" height="1" />
    <rect x="13" y="7" width="1" height="2" />
    <rect x="14" y="9" width="1" height="1" />
  </svg>
);

export const PixelReset: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="5" y="2" width="6" height="2" />
    <rect x="11" y="3" width="2" height="4" />
    <rect x="13" y="7" width="2" height="3" />
    <rect x="11" y="10" width="2" height="3" />
    <rect x="5" y="12" width="6" height="2" />
    <rect x="3" y="10" width="2" height="2" />
    <rect x="1" y="6" width="2" height="4" />
    <rect x="3" y="1" width="2" height="5" />
    <rect x="1" y="3" width="4" height="2" />
  </svg>
);

export const PixelSparkles: React.FC<IconProps> = ({ size = 16, className = '', color = '#fef08a' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} shapeRendering="crispEdges" className={className}>
    <rect x="4" y="1" width="1" height="3" />
    <rect x="3" y="2" width="3" height="1" />
    <rect x="11" y="4" width="2" height="6" />
    <rect x="9" y="6" width="6" height="2" />
    <rect x="3" y="10" width="2" height="4" />
    <rect x="2" y="11" width="4" height="2" />
  </svg>
);
