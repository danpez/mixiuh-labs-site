import { ImageResponse } from "next/og";

/*
 * Evergreen share card for every link to labs.mixiuh.online: Open Graph here,
 * and X through twitter-image.tsx, which re-exports this file. It never names
 * an episode, so a new release cannot make it stale. If you change the card,
 * also bump the revision in twitter-image.tsx (it explains why).
 *
 * Everything is local: next/og's bundled default font (Geist Regular) and the
 * brand's own pixel paths, so neither the build nor a request touches the
 * network. Geist covers ASCII and the Latin-1 letters and punctuation (Spanish
 * accents, "¿", "¡" and the "·" used here), but no emoji: a glyph it lacks, or
 * any emoji, makes next/og download a fallback font at render.
 */

export const alt =
  "Mixiuh Labs | Aqui no se opina: se prueba. Benchmarks zero-shot de IA, Arena y Pixel UI en labs.mixiuh.online";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

const INK = "#090B10";
const PANEL = "#0D1119";
const GRID = "#141B29";
const LINE = "#2A344B";
const PAPER = "#F5F2EB";
const YELLOW = "#FFD100";
const YELLOW_SHADE = "#B89200";
const CYAN = "#00E5FF";
const CYAN_SHADE = "#0099B8";
const EMERALD = "#10B981";
const EMERALD_SHADE = "#057A55";

// Verbatim from public/brand/logos/mixiuh-labs_mark_dark.svg (viewBox 0 0 120 76).
const MARK_PATH =
  "M56 0H80V4H88V8H92V12H96V16H100V20H88V16H84V12H76V8H56V12H48V4H56ZM24 8H40V12H44V16H24V28H32V32H28V36H20V28H16V16H20V12H24ZM56 16H64V20H68V24H76V28H80V32H84V36H88V40H92V44H96V52H92V56H72V68H104V64H108V60H112V40H108V36H104V32H84V28H88V24H104V28H112V32H116V40H120V60H116V64H112V68H108V72H104V76H64V48H84V44H80V40H76V36H72V32H68V28H64V24H56V28H52V32H48V36H44V40H40V44H36V48H56V76H12V72H8V68H4V64H0V40H4V36H8V32H16V36H12V40H8V64H12V68H48V56H28V52H24V44H28V40H32V36H36V32H40V28H44V24H52V20H56Z";

// Verbatim from public/brand/logos/mixiuh-labs_wordmark_dark.svg (viewBox 0 0 252 31.5):
// each word is a face layer over a depth layer that drops 3.5 units below it.
const WORDMARK_MIXIUH_DEPTH =
  "M0 0H4V4H8V8H12V4H16V0H20V31.5H16V11.5H12V19.5H8V11.5H4V31.5H0ZM28 0H40V7.5H36V24H40V31.5H28V24H32V7.5H28ZM48 0H52V8H56V12H60V8H64V0H68V11.5H64V15.5H60V16H64V20H68V31.5H64V23.5H60V19.5H56V23.5H52V31.5H48V20H52V16H56V15.5H52V11.5H48ZM76 0H88V7.5H84V24H88V31.5H76V24H80V7.5H76ZM96 0H100V24H112V0H116V27.5H112V31.5H100V27.5H96ZM120 0H124V12H136V0H140V31.5H136V19.5H124V31.5H120Z";
const WORDMARK_MIXIUH_FACE =
  "M0 0H4V4H8V8H4V28H0ZM16 0H20V28H16V8H12V4H16ZM28 0H40V4H36V24H40V28H28V24H32V4H28ZM48 0H52V8H48ZM64 0H68V8H64ZM76 0H88V4H84V24H88V28H76V24H80V4H76ZM96 0H100V24H96ZM112 0H116V24H112ZM120 0H124V12H136V0H140V28H136V16H124V28H120ZM8 8H12V16H8ZM52 8H56V12H52ZM60 8H64V12H60ZM56 12H60V16H56ZM52 16H56V20H52ZM60 16H64V20H60ZM48 20H52V28H48ZM64 20H68V28H64ZM100 24H112V28H100Z";
const WORDMARK_LABS_DEPTH =
  "M160 0H164V24H180V31.5H160ZM188 0H200V4H204V31.5H200V19.5H188V31.5H184V4H188ZM208 0H224V4H228V15.5H224V16H228V27.5H224V31.5H208ZM236 0H252V7.5H236V12H248V16H252V27.5H248V31.5H232V24H248V19.5H236V15.5H232V4H236ZM188 7.5V12H200V7.5ZM212 7.5V12H224V7.5ZM212 19.5V24H224V19.5Z";
const WORDMARK_LABS_FACE =
  "M160 0H164V24H180V28H160ZM188 0H200V4H188ZM208 0H224V4H212V12H224V16H212V24H224V28H208ZM236 0H252V4H236ZM184 4H188V12H200V4H204V28H200V16H188V28H184ZM224 4H228V12H224ZM232 4H236V12H232ZM236 12H248V16H236ZM224 16H228V24H224ZM248 16H252V24H248ZM232 24H248V28H232Z";

// Decorative pixel bars in the corner. They carry no data.
const BARS = [
  { height: 18, color: LINE },
  { height: 30, color: LINE },
  { height: 42, color: CYAN },
  { height: 54, color: EMERALD },
  { height: 66, color: YELLOW },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 36,
            width: 1112,
            height: 542,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 56px 48px",
            backgroundColor: PANEL,
            backgroundImage: `linear-gradient(${GRID} 2px, transparent 2px), linear-gradient(90deg, ${GRID} 2px, transparent 2px)`,
            backgroundSize: "32px 32px",
            border: `6px solid ${YELLOW}`,
            boxShadow: `16px 16px 0 0 ${YELLOW_SHADE}`,
          }}
        >
          {/* Brand row: the header's yellow badge with the mark, then the pixel wordmark */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: YELLOW,
                border: `4px solid ${INK}`,
                boxShadow: `8px 8px 0 0 ${CYAN}`,
              }}
            >
              <svg width={84} height={53.2} viewBox="0 0 120 76">
                <path d={MARK_PATH} fill={INK} />
              </svg>
            </div>
            <div style={{ display: "flex", marginLeft: 44 }}>
              <svg width={800} height={100} viewBox="0 0 252 31.5">
                <path d={WORDMARK_MIXIUH_DEPTH} fill={CYAN_SHADE} />
                <path d={WORDMARK_MIXIUH_FACE} fill={PAPER} />
                <path d={WORDMARK_LABS_DEPTH} fill={YELLOW_SHADE} />
                <path d={WORDMARK_LABS_FACE} fill={YELLOW} />
              </svg>
            </div>
          </div>

          {/* Motto and scope */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 16, height: 16, backgroundColor: YELLOW }} />
              <div style={{ width: 16, height: 16, marginLeft: 8, backgroundColor: CYAN }} />
              <div style={{ width: 16, height: 16, marginLeft: 8, backgroundColor: EMERALD }} />
              <div style={{ flexGrow: 1, height: 4, marginLeft: 16, backgroundColor: LINE }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
              <div style={{ fontSize: 68, lineHeight: 1.1, color: PAPER }}>
                Aqui no se opina: se prueba.
              </div>
              <div style={{ width: 22, height: 60, marginLeft: 14, backgroundColor: YELLOW }} />
            </div>
            <div style={{ fontSize: 36, marginTop: 14, color: CYAN }}>
              Benchmarks zero-shot de IA · Arena · Pixel UI
            </div>
          </div>

          {/* URL chip and decorative bars */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                backgroundColor: INK,
                border: `3px solid ${EMERALD}`,
                boxShadow: `6px 6px 0 0 ${EMERALD_SHADE}`,
              }}
            >
              <div style={{ width: 14, height: 14, backgroundColor: EMERALD }} />
              <div style={{ fontSize: 32, marginLeft: 14, color: PAPER }}>labs.mixiuh.online</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {BARS.map((bar, i) => (
                <div
                  key={bar.height}
                  style={{
                    width: 22,
                    height: bar.height,
                    marginLeft: i === 0 ? 0 : 8,
                    backgroundColor: bar.color,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
