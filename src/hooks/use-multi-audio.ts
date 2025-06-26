/* eslint-disable @typescript-eslint/no-unused-vars */
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
 addAudioFile: (file: File) => void;
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
 const audioFilesRef = useRef<AudioFileWithId[]>([]);
 const blobUrlsRef = useRef<Record<string, string>>({});

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

 // Create audio element with enhanced error handling
 const createAudioElement = useCallback(
  (file: AudioFileWithId) => {
   console.log("Creating audio element for:", {
    name: file.name,
    type: file.type,
    size: file.size,
    src: file.src,
   });

   const audio = new Audio();

   // Set CORS and preload attributes before setting src
   audio.crossOrigin = "anonymous";
   audio.preload = "metadata";

   // Store the blob URL reference
   blobUrlsRef.current[file.id] = file.src;

   const handleLoadStart = () => {
    console.log("Loading started for:", file.name);
    updateAudioState(file.id, { isLoading: true, error: null });
   };

   const handleLoadedMetadata = () => {
    console.log("Metadata loaded for:", file.name, {
     duration: audio.duration,
     src: audio.src,
    });
    updateAudioState(file.id, {
     duration: audio.duration,
     isLoading: false,
    });
   };

   const handleTimeUpdate = () => {
    updateAudioState(file.id, { currentTime: audio.currentTime });
   };

   const handleEnded = () => {
    console.log("Audio ended:", file.name);
    updateAudioState(file.id, { isPlaying: false, currentTime: 0 });

    // Auto-play next track
    const currentFiles = audioFilesRef.current;
    const currentIndex = currentFiles.findIndex((f) => f.id === file.id);
    if (currentIndex < currentFiles.length - 1) {
     const nextAudio = currentFiles[currentIndex + 1];
     setTimeout(() => {
      const nextAudioElement = audioRefs.current[nextAudio.id];
      if (nextAudioElement) {
       nextAudioElement.play().catch(console.error);
      }
     }, 100);
    }
   };

   const handleError = (e: Event) => {
    console.error("Audio error details:", {
     error: e,
     audioError: audio.error,
     networkState: audio.networkState,
     readyState: audio.readyState,
     src: audio.src,
     originalSrc: file.src,
     fileName: file.name,
     fileType: file.type,
     fileSize: file.size,
    });

    let errorMessage = "Failed to load audio file";

    if (audio.error) {
     switch (audio.error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
       errorMessage = "Audio loading was aborted";
       break;
      case MediaError.MEDIA_ERR_NETWORK:
       errorMessage = "Network error occurred while loading audio";
       break;
      case MediaError.MEDIA_ERR_DECODE:
       errorMessage = "Audio format not supported by browser";
       break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
       errorMessage = "Audio source not supported";
       break;
      default:
       errorMessage = `Audio error: ${audio.error.message || "Unknown error"}`;
     }
    }

    // Check if src was modified
    if (audio.src !== file.src) {
     errorMessage += ` (Source was modified from ${file.src} to ${audio.src})`;
    }

    updateAudioState(file.id, {
     isLoading: false,
     error: errorMessage,
    });
   };

   const handlePlay = () => {
    console.log("Audio started playing:", file.name);
    updateAudioState(file.id, { isPlaying: true });
    setCurrentAudio(file.id);
   };

   const handlePause = () => {
    console.log("Audio paused:", file.name);
    updateAudioState(file.id, { isPlaying: false });
   };

   const handleCanPlay = () => {
    console.log("Audio can play:", file.name);
    updateAudioState(file.id, { isLoading: false });
   };

   // Add event listeners
   audio.addEventListener("loadstart", handleLoadStart);
   audio.addEventListener("loadedmetadata", handleLoadedMetadata);
   audio.addEventListener("timeupdate", handleTimeUpdate);
   audio.addEventListener("ended", handleEnded);
   audio.addEventListener("error", handleError);
   audio.addEventListener("play", handlePlay);
   audio.addEventListener("pause", handlePause);
   audio.addEventListener("canplay", handleCanPlay);

   // Set the source AFTER adding event listeners
   try {
    audio.src = file.src;
    console.log("Audio src set to:", audio.src);
   } catch (error) {
    console.error("Error setting audio src:", error);
    updateAudioState(file.id, {
     isLoading: false,
     error: "Failed to set audio source",
    });
   }

   return audio;
  },
  [updateAudioState]
 );

 // Add audio file with better validation
 const addAudioFile = useCallback(
  (file: File) => {
   console.log("Adding audio file:", {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
   });

   // Validate file type
   if (!file.type.startsWith("audio/")) {
    console.error("Invalid file type:", file.type);
    return;
   }

   // Generate unique ID and create object URL
   const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

   let src: string;
   try {
    src = URL.createObjectURL(file);
    console.log("Created object URL:", src);
   } catch (error) {
    console.error("Failed to create object URL:", error);
    return;
   }

   // Create extended file object
   const audioFileWithId: AudioFileWithId = Object.assign(file, { id, src });

   // Update state
   setAudioFiles((prev) => {
    const newFiles = [...prev, audioFileWithId];
    audioFilesRef.current = newFiles;
    return newFiles;
   });

   setAudioStates((prev) => ({
    ...prev,
    [id]: initializeAudioState(id),
   }));

   // Create audio element
   try {
    audioRefs.current[id] = createAudioElement(audioFileWithId);
   } catch (error) {
    console.error("Failed to create audio element:", error);
    updateAudioState(id, {
     isLoading: false,
     error: "Failed to create audio player",
    });
   }
  },
  [initializeAudioState, createAudioElement, updateAudioState]
 );

 // Remove audio file with proper cleanup
 const removeAudioFile = useCallback(
  (id: string) => {
   console.log("Removing audio file:", id);

   const audio = audioRefs.current[id];
   if (audio) {
    // Pause and reset
    audio.pause();
    audio.currentTime = 0;

    // Remove all event listeners
    audio.removeEventListener("loadstart", () => {});
    audio.removeEventListener("loadedmetadata", () => {});
    audio.removeEventListener("timeupdate", () => {});
    audio.removeEventListener("ended", () => {});
    audio.removeEventListener("error", () => {});
    audio.removeEventListener("play", () => {});
    audio.removeEventListener("pause", () => {});
    audio.removeEventListener("canplay", () => {});

    // Clear src
    audio.src = "";
    audio.load(); // Reset the audio element

    delete audioRefs.current[id];
   }

   // Revoke blob URL
   const blobUrl = blobUrlsRef.current[id];
   if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    delete blobUrlsRef.current[id];
   }

   // Update state
   setAudioFiles((prev) => {
    const newFiles = prev.filter((f) => f.id !== id);
    audioFilesRef.current = newFiles;
    return newFiles;
   });

   setAudioStates((prev) => {
    const newStates = { ...prev };
    delete newStates[id];
    return newStates;
   });

   if (currentAudio === id) {
    setCurrentAudio(null);
   }
  },
  [currentAudio]
 );

 // Play audio with error handling
 const play = useCallback(
  async (id: string) => {
   const audio = audioRefs.current[id];
   if (!audio) {
    console.error("Audio element not found for id:", id);
    return;
   }

   console.log("Attempting to play audio:", id, {
    src: audio.src,
    readyState: audio.readyState,
    networkState: audio.networkState,
   });

   // Pause all other audio files
   Object.entries(audioRefs.current).forEach(([audioId, audioElement]) => {
    if (audioId !== id && !audioElement.paused) {
     audioElement.pause();
    }
   });

   // Ensure src is still correct
   const expectedSrc = blobUrlsRef.current[id];
   if (expectedSrc && audio.src !== expectedSrc) {
    console.warn("Audio src mismatch, correcting:", {
     expected: expectedSrc,
     actual: audio.src,
    });
    audio.src = expectedSrc;
   }

   try {
    await audio.play();
    console.log("Audio playing successfully:", id);
   } catch (error: any) {
    console.error("Failed to play audio:", error);
    updateAudioState(id, {
     error: `Failed to play audio: ${error.message}`,
     isLoading: false,
    });
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
  if (audio && audio.duration) {
   const clampedTime = Math.max(0, Math.min(audio.duration, time));
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
  console.log("Clearing all audio files");

  // Clean up audio elements
  Object.values(audioRefs.current).forEach((audio) => {
   audio.pause();
   audio.src = "";
   audio.load();
  });

  // Revoke all blob URLs
  Object.values(blobUrlsRef.current).forEach((blobUrl) => {
   URL.revokeObjectURL(blobUrl);
  });

  // Reset all refs and state
  audioRefs.current = {};
  blobUrlsRef.current = {};
  audioFilesRef.current = [];
  setAudioFiles([]);
  setAudioStates({});
  setCurrentAudio(null);
 }, []);

 // Cleanup on unmount
 useEffect(() => {
  return () => {
   console.log("Cleaning up useMultiAudio hook");

   // Clean up audio elements
   Object.values(audioRefs.current).forEach((audio) => {
    audio.pause();
    audio.src = "";
    audio.load();
   });

   // Revoke all blob URLs
   Object.values(blobUrlsRef.current).forEach((blobUrl) => {
    URL.revokeObjectURL(blobUrl);
   });
  };
 }, []);

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
