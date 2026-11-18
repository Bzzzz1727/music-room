import { useState, useEffect, useCallback, useRef } from 'react';
import { Track, ThemeId } from '../types';
import { DEMO_TRACKS } from './TracksData';
import { audioEngine } from './AudioEngine';

export function useAudioPlayer(activeTheme: ThemeId) {
  const [tracks] = useState<Track[]>(DEMO_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [crackleEnabled, setCrackleEnabledState] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const currentTrack = tracks[currentTrackIndex];
  const activeThemeRef = useRef(activeTheme);
  activeThemeRef.current = activeTheme;

  useEffect(() => {
    audioEngine.onTimeUpdate((time) => setCurrentTime(time));
    audioEngine.onTrackEnd(() => handleNextTrack());
  }, []);

  const playSfx = useCallback((type: 'click' | 'needle' | 'clack' | 'cd' | 'switch' | 'heart') => {
    if (sfxEnabled) audioEngine.playSfx(type);
  }, [sfxEnabled]);

  const play = useCallback((trackIdx?: number) => {
    const idx = trackIdx !== undefined ? trackIdx : currentTrackIndex;
    const targetTrack = tracks[idx];
    setCurrentTrackIndex(idx);
    setIsPlaying(true);
    audioEngine.playTrack(targetTrack.id, targetTrack.bpm, targetTrack.duration, activeThemeRef.current, currentTime);
  }, [currentTrackIndex, tracks, currentTime]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioEngine.pause();
  }, []);

  const togglePlay = useCallback(() => {
    playSfx('click');
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause, playSfx]);

  const handleNextTrack = useCallback(() => {
    playSfx('click');
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    const nextTrack = tracks[nextIdx];
    if (isPlaying) {
      audioEngine.playTrack(nextTrack.id, nextTrack.bpm, nextTrack.duration, activeThemeRef.current, 0);
    }
  }, [currentTrackIndex, isPlaying, playSfx, tracks]);

  const handlePrevTrack = useCallback(() => {
    playSfx('click');
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTime(0);
    const prevTrack = tracks[prevIdx];
    if (isPlaying) {
      audioEngine.playTrack(prevTrack.id, prevTrack.bpm, prevTrack.duration, activeThemeRef.current, 0);
    }
  }, [currentTrackIndex, isPlaying, playSfx, tracks]);

  const selectTrack = useCallback((index: number) => {
    playSfx('click');
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    const selected = tracks[index];
    if (isPlaying) {
      audioEngine.playTrack(selected.id, selected.bpm, selected.duration, activeThemeRef.current, 0);
    }
  }, [isPlaying, playSfx, tracks]);

  const seek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds, currentTrack.bpm, currentTrack.duration);
  }, [currentTrack]);

  const setVolume = useCallback((newVol: number) => {
    setVolumeState(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
    audioEngine.setVolume(newVol);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    playSfx('click');
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, [playSfx]);

  const toggleShuffle = useCallback(() => {
    playSfx('click');
    setIsShuffle((prev) => !prev);
  }, [playSfx]);

  const toggleCrackle = useCallback(() => {
    playSfx('switch');
    setCrackleEnabledState((prev) => {
      const next = !prev;
      audioEngine.setCrackleEnabled(next);
      return next;
    });
  }, [playSfx]);

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => !prev);
  }, []);

  const resetAudio = useCallback(() => {
    pause();
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    audioEngine.seek(0, tracks[0].bpm, tracks[0].duration);
  }, [pause, tracks]);

  return {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration: currentTrack.duration,
    volume,
    isMuted,
    isShuffle,
    crackleEnabled,
    sfxEnabled,
    togglePlay,
    play,
    pause,
    handleNextTrack,
    handlePrevTrack,
    selectTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleCrackle,
    toggleSfx,
    playSfx,
    resetAudio,
  };
}
