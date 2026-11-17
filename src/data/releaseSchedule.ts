/**
 * Calendario Oficial de Lanzamiento Omnicanal — Mixiuh Labs (Octubre – Noviembre 2026)
 *
 * Todo contenido, video, demo interactiva, dossier forense, noticia y prompt se mantiene
 * oculto en la web publica (sin spoilers) hasta que se cumpla su fecha y hora
 * exacta de publicacion en redes sociales (YouTube / Instagram / TikTok / X).
 */

export type ReleaseKey =
  | "ep01"
  | "ep02"
  | "cc01"
  | "ep03"
  | "ep04"
  | "carbon01"
  | "cc02"
  | "ep05"
  | "ep06"
  | "ep07"
  | "ep08"
  | "ep09"
  | "ep10"
  | "ep11"
  | "ep12";

export const RELEASE_TIMESTAMPS_CST: Record<ReleaseKey, string> = {
  // EP01: Gemini 4 Argon vs. Gemini 3.8 Flash (10 Retos) — Publicado Vie 16 Oct 2026 11:00 CST
  ep01: "2026-10-16T11:00:00-06:00",
  // EP02: Gemini 4 Argon vs. Claude Opus 5.5 (6 Retos) — Publicado Mie 21 Oct 2026 11:00 CST
  ep02: "2026-10-21T11:00:00-06:00",
  // Del Comentario al Codigo #01 (@tenito03 — OVERFIT Studio 3D) — Sab 24 Oct 2026 11:00 CST
  cc01: "2026-10-24T11:00:00-06:00",
  // EP03: Gemini 4 Argon High Sin Kit vs. Mixiuh Superpowers Kit — Dom 25 Oct 2026 11:00 CST
  ep03: "2026-10-25T11:00:00-06:00",
  // EP04: Claude Haiku 5.5 vs. Sonnet 5.5 vs. Opus 5.5 (Escalera Claude) — Mie 28 Oct 2026 11:00 CST
  ep04: "2026-10-28T11:00:00-06:00",
  // NOTICIAS IA #01 (Radar Mixiuh): Google Gemini 4 Carbon (#1 Mundial) — Jue 29 Oct 2026 15:00 CST
  carbon01: "2026-10-29T15:00:00-06:00",
  // Del Comentario al Codigo #02 (Juego Tipo ROBLOX 3D: Argon High vs Opus 5.5 High vs GPT-6 Astra High + Bonus) — Sab 31 Oct 2026
  cc02: "2026-10-31T00:00:00-06:00",
  // EP05: El Torneo de los 3 Gigantes (6 Retos 3D + Ronda de Rescate: Argon High vs Opus 5.5 High vs GPT-6 Astra High)
  ep05: "2026-10-31T00:00:00-06:00",
  // EP06: Clasicos Mundiales + Arena de Supervivencia en Vivo (5 Clasicos = 15 Clones + 5 Arenas en Vivo = 20 Juegos)
  ep06: "2026-11-07T12:00:00-06:00",
  // EP07: Especial Gemini Omni 1.2 Flash vs Omni 1.1 Flash vs Veo 3.1 Quality (12 Videos Reales en Google Flow · 4 Pruebas) — Mie 11 y Jue 12 Nov 2026
  ep07: "2026-11-11T10:00:00-06:00",
  // EP08: Gemini 4 Carbon GA en Vivo vs Gemini 4 Argon (4 Retos + Ronda de Recuperacion P03) — Vie 13 al Dom 15 Nov 2026
  ep08: "2026-11-13T12:00:00-06:00",
  // EP09: Claude Fable 5.2 en Vivo vs Claude Opus 5.5 (4 Retos Zero-Shot) — Lun 16 al Mie 18 Nov 2026
  ep09: "2026-11-16T12:00:00-06:00",
  // EP10: Gran Final Frontera Gemini 4 Carbon ($2/$10) vs Claude Fable 5.2 ($8/$40) (12 Apps + 4 Arenas IA en Vivo) — Jue 19 al Sab 21 Nov 2026
  ep10: "2026-11-19T12:00:00-06:00",
  // EP11: Intro Gemini 4 Hydrogen ($1.50/$7.50, 4 Niveles) vs Gemini 3.8 Flash (15 Demos + 3 Arenas IA) — Dom 22 al Mar 24 Nov 2026
  ep11: "2026-11-22T12:00:00-06:00",
  // EP12: Torneo de los 3 Ligeros Extra (Hydrogen Extra vs Haiku 5.5 Extra vs GPT-6 Luna Extra · 20 Demos + 6 Arenas Triples) — Mie 25 al Vie 27 Nov 2026
  ep12: "2026-11-25T12:00:00-06:00",
};

export interface ReleasedState {
  ep01: boolean;
  ep02: boolean;
  cc01: boolean;
  ep03: boolean;
  ep04: boolean;
  carbon01: boolean;
  cc02: boolean;
  ep05: boolean;
  ep06: boolean;
  ep07: boolean;
  ep08: boolean;
  ep09: boolean;
  ep10: boolean;
  ep11: boolean;
  ep12: boolean;
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
    ep04: isContentReleased("ep04", now, previewAll),
    carbon01: isContentReleased("carbon01", now, previewAll),
    cc02: isContentReleased("cc02", now, previewAll),
    ep05: isContentReleased("ep05", now, previewAll),
    ep06: isContentReleased("ep06", now, previewAll),
    ep07: isContentReleased("ep07", now, previewAll),
    ep08: isContentReleased("ep08", now, previewAll),
    ep09: isContentReleased("ep09", now, previewAll),
    ep10: isContentReleased("ep10", now, previewAll),
    ep11: isContentReleased("ep11", now, previewAll),
    ep12: isContentReleased("ep12", now, previewAll),
  };
}

/**
 * Moment the static HTML was generated. Use it for the first render of any
 * release-gated UI (server prerender + hydration must match), then switch to
 * the live clock after mount.
 */
export const BUILD_TIME = new Date(
  process.env.NEXT_PUBLIC_BUILD_TIME ?? "2026-11-17T06:00:00-06:00"
);
