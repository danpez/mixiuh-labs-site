"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ============================================================================
   PERSISTED PREFERENCES (v2.3): localStorage-backed, hydration-safe, tab-synced
   ============================================================================ */

const prefListeners = new Map<string, Set<() => void>>();

/** Reads a stored preference; null on the server or when storage is blocked. */
export function readPixelPref(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Safari private mode / disabled cookies throw on access
    return null;
  }
}

/** Stores a preference (best effort) and notifies every hook reading the key. */
export function writePixelPref(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable: the value still updates in memory listeners below
  }
  prefListeners.get(key)?.forEach((fn) => fn());
}

function subscribePref(key: string, onChange: () => void) {
  let listeners = prefListeners.get(key);
  if (!listeners) {
    listeners = new Set();
    prefListeners.set(key, listeners);
  }
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    prefListeners.get(key)?.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * A string preference persisted in localStorage. The server render and the
 * hydration pass use `fallback`; the stored value takes over right after, so
 * statically prerendered pages never hit a hydration mismatch. Other tabs stay
 * in sync through the `storage` event.
 */
export function usePixelPref<T extends string>(
  key: string,
  fallback: T,
  isValid: (value: string) => value is T
): [T, (next: T) => void] {
  const subscribe = useCallback(
    (onChange: () => void) => subscribePref(key, onChange),
    [key]
  );
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const raw = readPixelPref(key);
      return raw !== null && isValid(raw) ? raw : fallback;
    },
    () => fallback
  );
  const setValue = useCallback(
    (next: T) => writePixelPref(key, next),
    [key]
  );
  return [value, setValue];
}
