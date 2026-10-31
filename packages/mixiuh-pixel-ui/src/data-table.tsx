"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { pixelSound } from "./sound";
import { PixelIcon } from "./icons";
import { PIXEL_TONE_STYLES, type PixelTone } from "./components";

/* ============================================================================
   DATA TABLE SUITE (ROADMAP PHASE 2): SORT, SEARCH, PAGINATION & CSV EXPORT
   ============================================================================ */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type PixelCellValue = string | number | null | undefined;
type PixelSortDirection = "asc" | "desc";

interface PixelSortState {
  key: string;
  direction: PixelSortDirection;
}

interface PixelIndexedRow<T> {
  row: T;
  /** Index in the original `rows` array (stable ids + sort tie-breaker). */
  index: number;
}

export interface PixelDataColumn<T> {
  /** Unique column id; also the key stored in the sort state. */
  key: string;
  header: React.ReactNode;
  /** Plain-text header for aria labels, announcements and CSV when `header` is not a string. */
  headerText?: string;
  /** Primitive value used for sorting, searching and CSV export. */
  value?: (row: T) => string | number | null | undefined;
  /** Custom cell content (defaults to `value`). `rowIndex` is the position in the sorted & filtered result. */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** Defaults to `true` when `value` is provided; ignored without `value`. */
  sortable?: boolean;
  /** Include in CSV exports. Defaults to `true` when `value` is provided; ignored without `value`. */
  exportable?: boolean;
  align?: "left" | "center" | "right";
  /** Extra classes for every body cell of this column. */
  className?: string;
  headerClassName?: string;
}

export interface PixelDataTableLabels {
  /** Accessible (visually hidden) label of the search input. */
  search: string;
  searchPlaceholder: string;
  /** Accessible name of the "x" button that clears the search. */
  clearSearch: string;
  noResults: string;
  /** Announced to screen readers when the number of results changes. */
  resultsCount: (count: number) => string;
  exportCsv: string;
  previous: string;
  next: string;
  /** Visible pager summary, e.g. "1–10 de 19". */
  rowsSummary: (from: number, to: number, total: number) => string;
  pageOf: (page: number, pages: number) => string;
  /** Prefix of the sort buttons' accessible name, e.g. "Ordenar por". */
  sortHint: string;
  /** Announced after sorting, e.g. "Ordenado por Modelo, ascendente". */
  sortStatus: (column: string, direction: "asc" | "desc") => string;
  /** Announced when a sort button puts the rows back in their original order, e.g. "Orden original". */
  sortReset: string;
}

export interface PixelDataTableProps<T> {
  columns: PixelDataColumn<T>[];
  rows: T[];
  /** Stable unique id per row (React key). `index` is the row's index in `rows`. */
  getRowId: (row: T, index: number) => string;
  /** Rendered as <caption> (the table's accessible name); visually hidden unless `showCaption`. */
  caption?: string;
  showCaption?: boolean;
  tone?: PixelTone;
  /** Show the search box (default false). */
  searchable?: boolean;
  /**
   * Custom row filter, called with the trimmed, non-empty query. Default: every
   * query token must appear in some column `value` (case- and accent-insensitive).
   */
  searchFn?: (row: T, query: string) => boolean;
  /**
   * The original order. A column's sort button cycles ascending, descending,
   * then back to this order (the order of `rows` when it is left out).
   */
  initialSort?: { key: string; direction: "asc" | "desc" };
  /** Rows per page; 0 or undefined shows every row. */
  pageSize?: number;
  /** Shows an "Export CSV" button that downloads the filtered & sorted rows (all pages). */
  exportFileName?: string;
  /** Extra controls rendered at the start of the toolbar (e.g. category tabs). */
  toolbar?: React.ReactNode;
  /**
   * "inline" (default): `toolbar`, search and export share one wrapping row.
   * "stacked": `toolbar` gets a row of its own, and under 640px the search
   * takes the full width with the export button on the row below it.
   */
  toolbarLayout?: "inline" | "stacked";
  /** Makes rows clickable and focusable (Enter/Space activate, ↑/↓/Home/End move between rows). */
  onRowClick?: (row: T) => void;
  /** Extra row classes; `index` is the position in the sorted & filtered result. */
  rowClassName?: (row: T, index: number) => string;
  /** Per-key overrides; a key left `undefined` (or `null`) keeps its Spanish default. */
  labels?: Partial<PixelDataTableLabels>;
  /** Tighter cell padding for long lists. */
  dense?: boolean;
  /**
   * Locale for text sorting (default: the runtime locale). Pin it (e.g. "es") so
   * the server render and hydration sort text columns identically.
   */
  locale?: string;
  className?: string;
}

const DEFAULT_LABELS: PixelDataTableLabels = {
  search: "Buscar en la tabla",
  searchPlaceholder: "Buscar...",
  clearSearch: "Limpiar busqueda",
  noResults: "Sin resultados",
  resultsCount: (count) =>
    count === 1 ? "1 resultado" : `${count} resultados`,
  exportCsv: "Exportar CSV",
  previous: "Anterior",
  next: "Siguiente",
  rowsSummary: (from, to, total) => `${from}–${to} de ${total}`,
  pageOf: (page, pages) => `Pagina ${page} de ${pages}`,
  sortHint: "Ordenar por",
  sortStatus: (column, direction) =>
    `Ordenado por ${column}, ${
      direction === "asc" ? "ascendente" : "descendente"
    }`,
  sortReset: "Orden original",
};

const LABEL_KEYS = Object.keys(DEFAULT_LABELS) as (keyof PixelDataTableLabels)[];

/**
 * Merges label overrides key by key. A plain spread would let `undefined` (an
 * optional i18n key) replace a default and crash the formatters, so an override
 * only wins when it has the default's kind (string or function).
 */
function resolveLabels(
  overrides: Partial<PixelDataTableLabels> | undefined
): PixelDataTableLabels {
  if (!overrides) return DEFAULT_LABELS;
  const merged: PixelDataTableLabels = { ...DEFAULT_LABELS };
  for (const key of LABEL_KEYS) {
    const value = overrides[key];
    if (typeof value === typeof DEFAULT_LABELS[key]) {
      Object.assign(merged, { [key]: value });
    }
  }
  return merged;
}

interface PixelAnnouncement {
  /** Bumped on every message, so repeating the same text is still spoken. */
  id: number;
  text: string;
}

const nextAnnouncement = (
  prev: PixelAnnouncement,
  text: string
): PixelAnnouncement => ({ id: prev.id + 1, text });

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const JUSTIFY_CLASS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} as const;

/** Nested controls inside clickable rows keep their own click behaviour. */
const NESTED_CONTROL_SELECTOR =
  "a[href], button, input, select, textarea, summary, label, [contenteditable='true'], [role='button'], [role='link'], [role='checkbox'], [role='switch'], [role='menuitem'], [role='tab']";

const isBlankCell = (value: PixelCellValue): boolean =>
  value === null ||
  value === undefined ||
  value === "" ||
  (typeof value === "number" && Number.isNaN(value));

const cellText = (value: PixelCellValue): string =>
  isBlankCell(value) ? "" : String(value);

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function isSortableColumn<T>(column: PixelDataColumn<T>): boolean {
  return column.value !== undefined && column.sortable !== false;
}

function isExportableColumn<T>(column: PixelDataColumn<T>): boolean {
  return column.value !== undefined && column.exportable !== false;
}

/** headerText, else a string/number header, else undefined. */
function columnPlainText<T>(column: PixelDataColumn<T>): string | undefined {
  if (column.headerText !== undefined) return column.headerText;
  if (typeof column.header === "string" || typeof column.header === "number") {
    return String(column.header);
  }
  return undefined;
}

function columnLabel<T>(column: PixelDataColumn<T>): string {
  return columnPlainText(column) ?? column.key;
}

/** Numbers numerically, everything else with a numeric, case/accent-insensitive collator. */
function compareCells(
  a: PixelCellValue,
  b: PixelCellValue,
  collator: Intl.Collator
): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return collator.compare(String(a), String(b));
}

/* ----------------------------------------------------------------------------
   CSV helpers — RFC 4180 serialisation + client-side download
   ---------------------------------------------------------------------------- */

const CSV_NEEDS_QUOTES = /[",\r\n]/;

function csvField(value: PixelCellValue): string {
  const text = cellText(value);
  return CSV_NEEDS_QUOTES.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Serialises the exportable columns of `rows` as RFC 4180 CSV (CRLF line endings). */
export function pixelTableToCsv<T>(
  columns: PixelDataColumn<T>[],
  rows: T[]
): string {
  const exportable = columns.filter(isExportableColumn);
  if (exportable.length === 0) return "";
  const lines = [exportable.map((c) => csvField(columnLabel(c))).join(",")];
  rows.forEach((row) => {
    lines.push(exportable.map((c) => csvField(c.value?.(row))).join(","));
  });
  return lines.join("\r\n");
}

/**
 * Downloads `csv` as a UTF-8 file with BOM (so Excel keeps accents). Client-only:
 * call it from event handlers. Appends ".csv" when `fileName` lacks it.
 */
export function downloadPixelCsv(fileName: string, csv: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = /\.csv$/i.test(fileName) ? fileName : `${fileName}.csv`;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke after the browser has picked the blob up (immediate revoke breaks some engines)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ----------------------------------------------------------------------------
   PixelDataTable — sortable, searchable, paginated table with CSV export
   ---------------------------------------------------------------------------- */

export function PixelDataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  showCaption = false,
  tone = "cyan",
  searchable = false,
  searchFn,
  initialSort,
  pageSize = 0,
  exportFileName,
  toolbar,
  toolbarLayout = "inline",
  onRowClick,
  rowClassName,
  labels,
  dense = false,
  locale,
  className = "",
}: PixelDataTableProps<T>) {
  const l = useMemo(() => resolveLabels(labels), [labels]);
  const t = PIXEL_TONE_STYLES[tone];
  // "ink" is a panel colour, so its labels fall back to chalk for contrast
  const accent = tone === "ink" ? "#F5F2EB" : t.hex;

  const uid = useId();
  const searchId = `${uid}-search`;
  const captionId = `${uid}-caption`;
  const tableId = `${uid}-table`;
  const pageInfoId = `${uid}-page`;

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<PixelSortState | null>(initialSort ?? null);
  const [page, setPage] = useState(1);
  const [announcement, announce] = useReducer(nextAnnouncement, {
    id: 0,
    text: "",
  });
  const [overflowing, setOverflowing] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const collator = useMemo(
    () => new Intl.Collator(locale, { numeric: true, sensitivity: "base" }),
    [locale]
  );

  // 1. Filter (keeps each row's original index)
  const activeQuery = searchable ? query.trim() : "";
  const filtered = useMemo<PixelIndexedRow<T>[]>(() => {
    const indexed = rows.map((row, index) => ({ row, index }));
    if (!activeQuery) return indexed;
    if (searchFn) return indexed.filter(({ row }) => searchFn(row, activeQuery));
    const tokens = normalizeText(activeQuery).split(/\s+/).filter(Boolean);
    const valueColumns = columns.filter((c) => c.value !== undefined);
    return indexed.filter(({ row }) => {
      const haystacks = valueColumns.map((c) =>
        normalizeText(cellText(c.value?.(row)))
      );
      return tokens.every((token) => haystacks.some((h) => h.includes(token)));
    });
  }, [rows, columns, activeQuery, searchFn]);

  // 2. Sort (stable; blank values always last in both directions)
  const sortColumn = sort
    ? columns.find((c) => c.key === sort.key && isSortableColumn(c))
    : undefined;
  const sorted = useMemo<PixelIndexedRow<T>[]>(() => {
    const getValue = sortColumn?.value;
    if (!sort || !getValue) return filtered;
    const factor = sort.direction === "asc" ? 1 : -1;
    return filtered
      .map((entry) => ({ entry, value: getValue(entry.row) }))
      .sort((a, b) => {
        const aBlank = isBlankCell(a.value);
        const bBlank = isBlankCell(b.value);
        if (aBlank !== bBlank) return aBlank ? 1 : -1;
        const order = aBlank
          ? 0
          : factor * compareCells(a.value, b.value, collator);
        return order || a.entry.index - b.entry.index;
      })
      .map(({ entry }) => entry);
  }, [filtered, sort, sortColumn, collator]);

  // 3. Paginate (clamp the page when the result shrinks)
  const perPage = pageSize >= 1 ? Math.floor(pageSize) : 0;
  const total = sorted.length;
  const pageCount = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;
  if (page > pageCount) setPage(pageCount);
  const currentPage = Math.min(page, pageCount);
  const start = perPage > 0 ? (currentPage - 1) * perPage : 0;
  const end = perPage > 0 ? Math.min(start + perPage, total) : total;
  const visible = perPage > 0 ? sorted.slice(start, end) : sorted;
  const paginated = perPage > 0 && total > perPage;

  // 4. Announce result-count changes politely (debounced while typing, never on load)
  const countText = total === 0 ? l.noResults : l.resultsCount(total);
  const announcedCountRef = useRef(countText);
  useEffect(() => {
    if (announcedCountRef.current === countText) return;
    announcedCountRef.current = countText;
    const timer = window.setTimeout(() => announce(countText), 400);
    return () => window.clearTimeout(timer);
  }, [countText]);

  // 5. The scroller only becomes a focusable region when it really overflows
  useIsoLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      setOverflowing(scroller.scrollWidth > scroller.clientWidth + 1);
    });
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    return () => observer.disconnect();
  }, []);

  const updateQuery = (next: string) => {
    setQuery(next);
    setPage(1);
    // Back on page 1: drop a page announcement that no longer matches the pager
    if (currentPage !== 1) announce("");
  };

  // Each press goes ascending → descending → back to the original order, so
  // getting that order back never needs a column the user may not see ("#")
  const toggleSort = (column: PixelDataColumn<T>) => {
    const original = initialSort ?? null;
    const sorting = sort?.key === column.key ? sort.direction : null;
    // Already the original order (initialSort descending): wrap to ascending
    const restore =
      sorting === "desc" &&
      !(original?.key === column.key && original.direction === "desc");
    const direction: PixelSortDirection = sorting === "asc" ? "desc" : "asc";
    pixelSound.play("click");
    setSort(restore ? original : { key: column.key, direction });
    setPage(1);
    announce(
      restore ? l.sortReset : l.sortStatus(columnLabel(column), direction)
    );
  };

  const goToPage = (next: number) => {
    if (next < 1 || next > pageCount || next === currentPage) return;
    pixelSound.play("crank");
    setPage(next);
    announce(l.pageOf(next, pageCount));
  };

  const exportCsv = () => {
    if (!exportFileName) return;
    pixelSound.play("coin");
    downloadPixelCsv(
      exportFileName,
      pixelTableToCsv(
        columns,
        sorted.map((entry) => entry.row)
      )
    );
  };

  const activateRow = (row: T) => {
    if (!onRowClick) return;
    pixelSound.play("click");
    onRowClick(row);
  };

  const onRowMouseClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    row: T
  ) => {
    const target = e.target;
    // Ignore clicks bubbling from portals, nested controls or a text selection
    if (!(target instanceof Element) || !e.currentTarget.contains(target)) return;
    const control = target.closest(NESTED_CONTROL_SELECTOR);
    if (control && e.currentTarget.contains(control)) return;
    if (window.getSelection()?.toString()) return;
    activateRow(row);
  };

  const onRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    row: T
  ) => {
    // Skip keys typed in nested controls and modifier combos (browser shortcuts)
    if (e.target !== e.currentTarget) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!e.repeat) activateRow(row);
      return;
    }
    const rowEl = e.currentTarget;
    const next =
      e.key === "ArrowDown"
        ? rowEl.nextElementSibling
        : e.key === "ArrowUp"
        ? rowEl.previousElementSibling
        : e.key === "Home"
        ? rowEl.parentElement?.firstElementChild
        : e.key === "End"
        ? rowEl.parentElement?.lastElementChild
        : null;
    if (next instanceof HTMLElement) {
      e.preventDefault();
      next.focus();
    }
  };

  const hasExtraToolbar = toolbar != null && typeof toolbar !== "boolean";
  const hasToolbar = searchable || Boolean(exportFileName) || hasExtraToolbar;
  const stacked = toolbarLayout === "stacked";
  const headPad = dense ? "px-2.5 py-2" : "px-3 py-2.5";
  const cellPad = dense ? "px-2.5 py-1.5" : "px-3 py-2.5";
  const regionLabelled = overflowing && Boolean(caption);

  return (
    <div
      className={`min-w-0 max-w-full bg-[#111622] border-2 border-[#2A344B] shadow-[6px_6px_0_#040508] ${className}`}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="px-sr-only"
      >
        {/* A new node per message: identical consecutive texts still get read */}
        {announcement.text && (
          <span key={announcement.id}>{announcement.text}</span>
        )}
      </div>

      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-[#090B10] border-b-2 border-[#2A344B]">
          {hasExtraToolbar && (
            <div
              className={`flex flex-wrap items-center gap-2 min-w-0 ${
                stacked ? "basis-full" : ""
              }`}
            >
              {toolbar}
            </div>
          )}

          {searchable && (
            <div
              className={`relative flex-1 min-w-[11rem] max-w-sm ${
                stacked ? "max-sm:basis-full max-sm:max-w-none" : ""
              }`}
            >
              <label htmlFor={searchId} className="px-sr-only">
                {l.search}
              </label>
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 flex">
                <PixelIcon name="search" size={14} color={accent} />
              </span>
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                onKeyDown={(e) => {
                  // Escape clears the query first (and stays inside overlays)
                  if (e.key === "Escape" && query) {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuery("");
                  }
                }}
                placeholder={l.searchPlaceholder}
                aria-controls={tableId}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                className="w-full appearance-none pl-8 pr-8 py-1.5 bg-[#111622] border-2 border-[#2A344B] shadow-[2px_2px_0_#040508] font-mono-hud text-xs text-[#F5F2EB] placeholder:text-[#94A3B8] [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    pixelSound.play("click");
                    updateQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label={l.clearSearch}
                  title={l.clearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 flex text-[#94A3B8] hover:text-[#F5F2EB] cursor-pointer"
                >
                  <PixelIcon name="close" size={10} />
                </button>
              )}
            </div>
          )}

          {exportFileName && (
            <button
              type="button"
              onClick={exportCsv}
              className={`px-btn ml-auto px-3 py-1.5 text-xs ${t.bg} ${t.text}`}
            >
              <PixelIcon name="download" size={13} />
              <span>{l.exportCsv}</span>
            </button>
          )}
        </div>
      )}

      <div
        ref={scrollRef}
        role={regionLabelled ? "region" : undefined}
        aria-labelledby={regionLabelled ? captionId : undefined}
        tabIndex={overflowing ? 0 : undefined}
        // A focused header button half outside the scroller stays half hidden
        // in Chromium: bring it into view (honours scroll-padding)
        onFocus={(e) => {
          if (e.target !== e.currentTarget) {
            e.target.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        }}
        // Positioned, so visually hidden nodes (caption, sort hints) stay
        // inside the scroller instead of widening the page
        className="relative overflow-x-auto focus-visible:outline-offset-[-3px]"
      >
        <table
          id={tableId}
          aria-rowcount={paginated ? total + 1 : undefined}
          className="w-full border-collapse font-mono-hud text-xs text-[#CBD5E1]"
        >
          {caption && (
            <caption
              id={captionId}
              className={
                showCaption
                  ? "caption-top px-3 pt-3 pb-2 text-left font-display text-sm text-[#F5F2EB]"
                  : "px-sr-only"
              }
            >
              {caption}
            </caption>
          )}

          <thead className="bg-[#090B10]">
            <tr
              aria-rowindex={paginated ? 1 : undefined}
              className="border-b-2 border-[#2A344B]"
            >
              {columns.map((column) => {
                const align = column.align ?? "left";
                const sortable = isSortableColumn(column);
                const direction =
                  sortable && sort?.key === column.key ? sort.direction : null;
                const plain = columnPlainText(column);
                const indicator = (
                  <PixelIcon
                    name={direction === "desc" ? "chevron-down" : "chevron-up"}
                    size={12}
                    color={direction ? accent : "currentColor"}
                    className={
                      direction
                        ? ""
                        : "text-[#64748B] group-hover/sort:text-[#CBD5E1] group-focus-visible/sort:text-[#CBD5E1]"
                    }
                  />
                );
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      !sortable
                        ? undefined
                        : direction === "asc"
                        ? "ascending"
                        : direction === "desc"
                        ? "descending"
                        : "none"
                    }
                    className={`${sortable ? "p-0" : headPad} align-bottom font-pixel text-[10px] font-bold uppercase tracking-wider ${ALIGN_CLASS[align]} ${column.headerClassName ?? ""}`}
                    style={{
                      color: accent,
                      boxShadow: direction ? `inset 0 -3px 0 ${accent}` : undefined,
                    }}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        aria-label={
                          plain !== undefined ? `${l.sortHint} ${plain}` : undefined
                        }
                        className={`group/sort w-full ${headPad} flex items-center gap-1.5 ${JUSTIFY_CLASS[align]} ${ALIGN_CLASS[align]} font-bold uppercase cursor-pointer hover:bg-[#111622] focus-visible:outline-offset-[-3px]`}
                      >
                        {align === "right" && indicator}
                        {plain === undefined && (
                          <span className="px-sr-only">{`${l.sortHint} `}</span>
                        )}
                        <span>{column.header}</span>
                        {align !== "right" && indicator}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className="px-4 py-8 text-center text-[#94A3B8]"
                >
                  <span className="inline-flex items-center gap-2">
                    <PixelIcon name="ghost" size={14} />
                    <span>{l.noResults}</span>
                  </span>
                </td>
              </tr>
            ) : (
              visible.map(({ row, index }, i) => {
                const position = start + i;
                return (
                  <tr
                    key={getRowId(row, index)}
                    aria-rowindex={paginated ? position + 2 : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={
                      onRowClick ? (e) => onRowMouseClick(e, row) : undefined
                    }
                    onKeyDown={
                      onRowClick ? (e) => onRowKeyDown(e, row) : undefined
                    }
                    className={`group/row border-b border-[#1E2638] last:border-b-0 hover:bg-[#1A2132] ${
                      i % 2 === 0 ? "bg-[#111622]" : "bg-[#0E131D]"
                    } ${
                      onRowClick
                        ? "cursor-pointer focus-visible:bg-[#1A2132] focus-visible:outline-offset-[-2px]"
                        : ""
                    } ${rowClassName?.(row, position) ?? ""}`}
                  >
                    {columns.map((column, c) => (
                      <td
                        key={column.key}
                        className={`${cellPad} ${ALIGN_CLASS[column.align ?? "left"]} ${
                          onRowClick && c === 0
                            ? "group-focus-visible/row:shadow-[inset_3px_0_0_#FFD100]"
                            : ""
                        } ${column.className ?? ""}`}
                      >
                        {column.render
                          ? column.render(row, position)
                          : cellText(column.value?.(row))}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {paginated && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2.5 bg-[#090B10] border-t-2 border-[#2A344B] font-mono-hud text-[11px] text-[#94A3B8]">
          <span>{l.rowsSummary(start + 1, end, total)}</span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              aria-disabled={currentPage <= 1 || undefined}
              aria-describedby={pageInfoId}
              className={`px-btn px-2.5 py-1 text-[11px] ${t.bg} ${t.text}`}
            >
              <PixelIcon name="chevron-left" size={12} />
              <span>{l.previous}</span>
            </button>
            <span
              id={pageInfoId}
              className="font-pixel text-[10px] text-[#CBD5E1] whitespace-nowrap"
            >
              {l.pageOf(currentPage, pageCount)}
            </span>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              aria-disabled={currentPage >= pageCount || undefined}
              aria-describedby={pageInfoId}
              className={`px-btn px-2.5 py-1 text-[11px] ${t.bg} ${t.text}`}
            >
              <span>{l.next}</span>
              <PixelIcon name="chevron-right" size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
