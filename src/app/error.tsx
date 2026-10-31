"use client";

import { useEffect } from "react";

// A view chunk that could not be downloaded (a redeploy changed the chunk
// hashes, or the connection dropped). React.lazy and the bundler runtime keep
// the failed import, so reset() would fail again: only a reload fetches it.
const isChunkLoadError = (error: Error) =>
  error.name === "ChunkLoadError" ||
  /Failed to load chunk|Loading chunk|dynamically imported module/i.test(
    error.message ?? ""
  );

// When this page last reloaded itself after a chunk error (sessionStorage)
const CHUNK_RELOAD_KEY = "mixiuh_chunk_reload";

/**
 * Whether a chunk error may reload the page by itself: once a minute at most,
 * and never where the flag cannot be stored (that could loop forever).
 */
function claimAutoReload(): boolean {
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY));
    if (Date.now() - last < 60_000) return false;
    const now = String(Date.now());
    sessionStorage.setItem(CHUNK_RELOAD_KEY, now);
    return sessionStorage.getItem(CHUNK_RELOAD_KEY) === now;
  } catch {
    return false;
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    console.error(error);
    // The #hash survives the reload, so the visitor lands on the same view.
    // Offline, it would only swap this screen for the browser's error page.
    if (chunkError && navigator.onLine && claimAutoReload()) {
      window.location.reload();
    }
  }, [error, chunkError]);

  useEffect(() => {
    if (!chunkError) return;
    // Back/forward can restore this screen from the page cache: load it again
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [chunkError]);

  return (
    <main className="min-h-screen labs-grid-bg flex items-center justify-center px-4 py-16">
      <div
        role="alert"
        className="w-full max-w-xl bg-[#111622] border-2 border-[#090B10] shadow-[8px_8px_0_#040508]"
        style={{ outline: "2px solid #FF3355" }}
      >
        <div className="px-4 py-2 bg-[#FF3355] text-[#090B10] border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
          <span>MIXIUH LABS // FALLO DEL SISTEMA</span>
          {error.digest && <span>#{error.digest}</span>}
        </div>
        <div className="p-6 sm:p-8 space-y-5">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
            Algo se rompio en el laboratorio
          </h1>
          <p className="font-mono-hud text-sm text-[#CBD5E1] leading-relaxed">
            Un componente fallo al cargar. Puedes reintentar sin perder tu lugar.
            <span className="block text-[#94A3B8] mt-1" lang="en">
              Something broke while loading. You can retry safely.
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              // A failed chunk only loads again with a reload (it keeps the #hash)
              onClick={() => (chunkError ? window.location.reload() : reset())}
              className="px-btn bg-[#FFD100] text-[#090B10] px-5 py-3 text-xs sm:text-sm"
            >
              Reintentar / Retry
            </button>
            {/* A full page load: a client-side <Link> from /#foro to / keeps the
                pathname, so this boundary would stay on screen */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="px-btn bg-[#131824] text-[#F5F2EB] px-4 py-3 text-xs sm:text-sm"
            >
              Volver al inicio / Back home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
