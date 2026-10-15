"use client";

import { useCallback, useEffect, useRef } from "react";

const ON_SRC = "/toggle%20button%20on.mp3";
const OFF_SRC = "/toggle%20button%20off.mp3";

export type ThemeChoice = "light" | "dark";

/**
 * Toggle click sound. Always on, no mute control.
 *
 * Rule from the brief: switching to light plays the on file, switching to dark
 * plays the off file. Browsers block audio that does not start inside a user
 * gesture. The toggle is a click, so playback is allowed.
 */
export function useToggleSound() {
  const onRef = useRef<HTMLAudioElement | null>(null);
  const offRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const on = new Audio(ON_SRC);
    const off = new Audio(OFF_SRC);
    on.preload = "auto";
    off.preload = "auto";
    on.volume = 0.3;
    off.volume = 0.3;
    onRef.current = on;
    offRef.current = off;

    return () => {
      on.pause();
      off.pause();
      onRef.current = null;
      offRef.current = null;
    };
  }, []);

  const play = useCallback((next: ThemeChoice) => {
    const el = next === "light" ? onRef.current : offRef.current;
    if (!el) return;
    try {
      el.currentTime = 0;
      const result = el.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => undefined);
      }
    } catch {
      // The visual toggle already worked, so nothing else to do here.
    }
  }, []);

  return { play };
}