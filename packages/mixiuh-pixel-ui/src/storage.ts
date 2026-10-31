"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ============================================================================
   PERSISTED PREFERENCES (v2.3): localStorage-backed, hydration-safe, tab-synced
   ============================================================================ */

const prefListeners = new Map<string, Set<() => void>>();
// Values this page wrote that localStorage could not keep (blocked, full or
// silently ignored): they win over storage until the page reloads. Browser
// only: writePixelPref never fills it on the server.
const memoryPrefs = new Map<string, string>();

/**
 * Reads a preference: a value this page could not store (kept in memory),
 * else the stored one; null on the server or when there is neither.
 */
export function readPixelPref(key: string): string | null {
  if (typeof window === "undefined") return null;
  const unsaved = memoryPrefs.get(key);
  if (unsaved !== undefined) return unsaved;
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Safari private mode / disabled cookies throw on access
    return null;
  }
}

/**
 * Stores a preference and notifies every hook reading the key. The value goes
 * to memory first, so it applies even when localStorage is unavailable; it
 * stays there only while storage cannot keep it.
 */
export function writePixelPref(key: string, value: string): void {
  if (typeof window === "undefined") return;
  memoryPrefs.set(key, value);
  try {
    window.localStorage.setItem(key, value);
    // Stored for real: storage is the source of truth again (and other tabs)
    if (window.localStorage.getItem(key) === value) memoryPrefs.delete(key);
  } catch {
    // storage unavailable: the in-memory copy keeps the value until reload
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
    // Another tab stored this key (null: cleared storage): its value wins
    if (e.key !== null && e.key !== key) return;
    memoryPrefs.delete(key);
    onChange();
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
 * in sync through the `storage` event. Where localStorage is blocked, a new
 * value still applies (kept in memory) until the page reloads.
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
      // In-memory value first (readPixelPref), still validated
      const raw = readPixelPref(key);
      return raw !== null && isValid(raw) ? raw : fallback;
    },
    // Server and hydration: never the memory map
    () => fallback
  );
  const setValue = useCallback(
    (next: T) => writePixelPref(key, next),
    [key]
  );
  return [value, setValue];
}
