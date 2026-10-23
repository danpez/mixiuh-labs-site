/**
 * Calendario Oficial de Lanzamiento Omnicanal — Mixiuh Labs (Octubre 2026)
 *
 * Todo contenido, video, demo interactiva, dossier forense y prompt se mantiene
 * oculto en la web publica (sin spoilers) hasta que se cumpla su fecha y hora
 * exacta de publicacion en redes sociales (YouTube / Instagram / TikTok / X).
 */

export type ReleaseKey = "ep01" | "ep02" | "cc01" | "ep03";

export const RELEASE_TIMESTAMPS_CST: Record<ReleaseKey, string> = {
  // EP01: Gemini 4 Argon vs. Gemini 3.8 Flash (10 Retos) — Publicado Vie 16 Oct 2026 11:00 CST
  ep01: "2026-10-16T11:00:00-06:00",
  // EP02: Gemini 4 Argon vs. Claude Opus 5.5 (6 Retos) — Publicado Mie 21 Oct 2026 11:00 CST
  ep02: "2026-10-21T11:00:00-06:00",
  // Del Comentario al Codigo #01 (@tenito03 — OVERFIT Studio 3D) — Sab 24 Oct 2026 11:00 CST
  cc01: "2026-10-24T11:00:00-06:00",
  // EP03: Gemini 4 Argon High Sin Kit vs. Mixiuh Superpowers Kit — Dom 25 Oct 2026 11:00 CST
  ep03: "2026-10-25T11:00:00-06:00",
};

export interface ReleasedState {
  ep01: boolean;
  ep02: boolean;
  cc01: boolean;
  ep03: boolean;
}

export function isContentReleased(
  key: ReleaseKey,
  now: Date = new Date(),
  previewAll = false
): boolean {
  if (previewAll) return true;
  const targetMs = new Date(RELEASE_TIMESTAMPS_CST[key]).getTime();
  return now.getTime() >= targetMs;
}

export function getReleasedStatus(
  now: Date = new Date(),
  previewAll = false
): ReleasedState {
  return {
    ep01: isContentReleased("ep01", now, previewAll),
    ep02: isContentReleased("ep02", now, previewAll),
    cc01: isContentReleased("cc01", now, previewAll),
    ep03: isContentReleased("ep03", now, previewAll),
  };
}
