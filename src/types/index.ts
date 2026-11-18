export type ThemeId = 'pastel' | 'grunge' | 'pixel' | 'y2k' | 'earth';

export type PlayerStyle = 'vinyl' | 'cd' | 'cassette';

export type LightingMode = 'candle' | 'daylight' | 'midnight';

export type WeatherType = 'rain' | 'stars' | 'sun' | 'aurora';

export type VisualizerMode = 'subtle' | 'dynamic' | 'off';

export type MusicSource = 'demo' | 'spotify';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  bpm: number;
  genre: string;
  badge: string;
  themeRec: ThemeId;
  notes: string;
  linerNotes?: string;
  lyrics?: string[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  crackleEnabled: boolean;
  sfxEnabled: boolean;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  palette: {
    bg: string;
    roomWall: string;
    roomWallShadow: string;
    roomFloor: string;
    roomFloorHighlight: string;
    border: string;
    primary: string;
    accent: string;
    text: string;
    cardBg: string;
    cardBorder: string;
    glow: string;
  };
  description: string;
  vibe: string;
  iconName: string;
}

export interface SpotifyProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  profileUrl: string;
  product?: string;
  followers?: number;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  albumName: string;
  albumArtUrl: string | null;
  durationMs: number;
  spotifyUrl: string;
  uri: string;
}

export interface SpotifyPlayback {
  isPlaying: boolean;
  progressMs: number;
  track: SpotifyTrack | null;
  deviceName: string | null;
  deviceType: string | null;
}
