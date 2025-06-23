/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface AudioFileWithId extends File {
 id: string;
 src: string;
}

export interface AudioState {
 isPlaying: boolean;
 currentTime: number;
 duration: number;
 volume: number;
 isLoading: boolean;
 error: string | null;
}

export interface UseMultiAudioReturn {
 audioFiles: AudioFileWithId[];
 currentAudio: string | null;
 audioStates: Record<string, AudioState>;
 addAudioFile: (file: File) => void; // Changed from AudioFile to File
 removeAudioFile: (id: string) => void;
 play: (id: string) => void;
 pause: (id: string) => void;
 stop: (id: string) => void;
 setVolume: (id: string, volume: number) => void;
 setCurrentTime: (id: string, time: number) => void;
 togglePlayPause: (id: string) => void;
 playNext: () => void;
 playPrevious: () => void;
 clearAll: () => void;
}

export function useMultiAudio(): UseMultiAudioReturn {
 const [audioFiles, setAudioFiles] = useState<AudioFileWithId[]>([]);
 const [currentAudio, setCurrentAudio] = useState<string | null>(null);
 const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});

 const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

 // Initialize audio state
 const initializeAudioState = useCallback(
  (id: string): AudioState => ({
   isPlaying: false,
   currentTime: 0,
   duration: 0,
   volume: 1,
   isLoading: false,
   error: null,
  }),
  []
 );

 // Update audio state
 const updateAudioState = useCallback(
  (id: string, updates: Partial<AudioState>) => {
   setAudioStates((prev) => ({
    ...prev,
    [id]: { ...prev[id], ...updates },
   }));
  },
  []
 );

 // Create audio element
 const createAudioElement = useCallback(
  (file: AudioFileWithId) => {
   const audio = new Audio(file.src);
   audio.preload = "metadata";

   // Event listeners
   audio.addEventListener("loadstart", () => {
    updateAudioState(file.id, { isLoading: true, error: null });
   });

   audio.addEventListener("loadedmetadata", () => {
    updateAudioState(file.id, {
     duration: audio.duration,
     isLoading: false,
    });
   });

   audio.addEventListener("timeupdate", () => {
    updateAudioState(file.id, { currentTime: audio.currentTime });
   });

   audio.addEventListener("ended", () => {
    updateAudioState(file.id, { isPlaying: false, currentTime: 0 });
    // Auto play next audio
    const currentIndex = audioFiles.findIndex((f) => f.id === file.id);
    if (currentIndex < audioFiles.length - 1) {
     const nextAudio = audioFiles[currentIndex + 1];
     play(nextAudio.id);
    }
   });

   audio.addEventListener("error", (e) => {
    updateAudioState(file.id, {
     isLoading: false,
     error: "Failed to load audio file",
    });
   });

   audio.addEventListener("play", () => {
    updateAudioState(file.id, { isPlaying: true });
    setCurrentAudio(file.id);
   });

   audio.addEventListener("pause", () => {
    updateAudioState(file.id, { isPlaying: false });
   });

   return audio;
  },
  [audioFiles, updateAudioState]
 );

 // Add audio file
 const addAudioFile = useCallback(
  (file: File) => {
   // Generate unique ID and create object URL
   const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
   const src = URL.createObjectURL(file);

   // Create extended file object
   const audioFileWithId: AudioFileWithId = Object.assign(file, { id, src });

   if (audioFiles.some((f) => f.id === id)) {
    console.warn(`Audio file with id ${id} already exists`);
    return;
   }

   setAudioFiles((prev) => [...prev, audioFileWithId]);
   setAudioStates((prev) => ({
    ...prev,
    [id]: initializeAudioState(id),
   }));

   audioRefs.current[id] = createAudioElement(audioFileWithId);
  },
  [audioFiles, initializeAudioState, createAudioElement]
 );

 // Remove audio file
 const removeAudioFile = useCallback(
  (id: string) => {
   const audio = audioRefs.current[id];
   if (audio) {
    audio.pause();
    audio.src = "";
    delete audioRefs.current[id];
   }

   // Find and revoke object URL
   const fileToRemove = audioFiles.find((f) => f.id === id);
   if (fileToRemove && fileToRemove.src.startsWith("blob:")) {
    URL.revokeObjectURL(fileToRemove.src);
   }

   setAudioFiles((prev) => prev.filter((f) => f.id !== id));
   setAudioStates((prev) => {
    const newStates = { ...prev };
    delete newStates[id];
    return newStates;
   });

   if (currentAudio === id) {
    setCurrentAudio(null);
   }
  },
  [currentAudio, audioFiles]
 );

 // Play audio
 const play = useCallback(
  async (id: string) => {
   const audio = audioRefs.current[id];
   if (!audio) return;

   // Pause all other audio files
   Object.entries(audioRefs.current).forEach(([audioId, audioElement]) => {
    if (audioId !== id && !audioElement.paused) {
     audioElement.pause();
    }
   });

   try {
    await audio.play();
   } catch (error: any) {
    updateAudioState(id, { error: "Failed to play audio" });
   }
  },
  [updateAudioState]
 );

 // Pause audio
 const pause = useCallback((id: string) => {
  const audio = audioRefs.current[id];
  if (audio && !audio.paused) {
   audio.pause();
  }
 }, []);

 // Stop audio
 const stop = useCallback((id: string) => {
  const audio = audioRefs.current[id];
  if (audio) {
   audio.pause();
   audio.currentTime = 0;
  }
 }, []);

 // Set volume
 const setVolume = useCallback(
  (id: string, volume: number) => {
   const audio = audioRefs.current[id];
   if (audio) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audio.volume = clampedVolume;
    updateAudioState(id, { volume: clampedVolume });
   }
  },
  [updateAudioState]
 );

 // Set current time
 const setCurrentTime = useCallback((id: string, time: number) => {
  const audio = audioRefs.current[id];
  if (audio) {
   const clampedTime = Math.max(0, Math.min(audio.duration || 0, time));
   audio.currentTime = clampedTime;
  }
 }, []);

 // Toggle play/pause
 const togglePlayPause = useCallback(
  (id: string) => {
   const state = audioStates[id];
   if (state?.isPlaying) {
    pause(id);
   } else {
    play(id);
   }
  },
  [audioStates, play, pause]
 );

 // Play next
 const playNext = useCallback(() => {
  if (!currentAudio || audioFiles.length === 0) return;

  const currentIndex = audioFiles.findIndex((f) => f.id === currentAudio);
  const nextIndex = (currentIndex + 1) % audioFiles.length;
  play(audioFiles[nextIndex].id);
 }, [currentAudio, audioFiles, play]);

 // Play previous
 const playPrevious = useCallback(() => {
  if (!currentAudio || audioFiles.length === 0) return;

  const currentIndex = audioFiles.findIndex((f) => f.id === currentAudio);
  const prevIndex =
   currentIndex === 0 ? audioFiles.length - 1 : currentIndex - 1;
  play(audioFiles[prevIndex].id);
 }, [currentAudio, audioFiles, play]);

 // Clear all
 const clearAll = useCallback(() => {
  Object.values(audioRefs.current).forEach((audio) => {
   audio.pause();
   audio.src = "";
  });

  // Revoke all object URLs
  audioFiles.forEach((file) => {
   if (file.src.startsWith("blob:")) {
    URL.revokeObjectURL(file.src);
   }
  });

  audioRefs.current = {};
  setAudioFiles([]);
  setAudioStates({});
  setCurrentAudio(null);
 }, [audioFiles]);

 // Cleanup on unmount
 useEffect(() => {
  return () => {
   Object.values(audioRefs.current).forEach((audio) => {
    audio.pause();
    audio.src = "";
   });

   // Revoke all object URLs on unmount
   audioFiles.forEach((file) => {
    if (file.src.startsWith("blob:")) {
     URL.revokeObjectURL(file.src);
    }
   });
  };
 }, [audioFiles]);

 return {
  audioFiles,
  currentAudio,
  audioStates,
  addAudioFile,
  removeAudioFile,
  play,
  pause,
  stop,
  setVolume,
  setCurrentTime,
  togglePlayPause,
  playNext,
  playPrevious,
  clearAll,
 };
}
