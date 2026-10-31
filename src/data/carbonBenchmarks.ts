/**
 * Gemini 4 Carbon benchmark table (official Google DeepMind rows) and the
 * counts derived from it. Kept apart from newsData.ts so the home page can read
 * these rows without shipping the whole news dataset; newsData.ts re-exports
 * everything here for its other importers.
 */

export type NewsBenchmarkDomain =
  | "all"
  | "agentes"
  | "cyber"
  | "negocios"
  | "ciencia";

/** Official Google DeepMind images the benchmark rows are transcribed from. */
export const CARBON_MASTER_TABLE_IMG = "/stills/noticias/carbon/03_evals_table.png";
export const CARBON_GRAY_SWAN_IMG = "/stills/noticias/carbon/07_grey_swan_ipi.png";

export interface CarbonBenchmarkRow {
  n: number;
  benchmark: string;
  subtitle_es: string;
  subtitle_en: string;
  domain: Exclude<NewsBenchmarkDomain, "all">;
  carbon: string;
  argon: string;
  gpt6: string;
  opus55: string;
  winner: "carbon" | "opus55" | "gpt6" | "tie";
  highlight_es: string;
  highlight_en: string;
  /** Official image this row was transcribed from. */
  source: typeof CARBON_MASTER_TABLE_IMG | typeof CARBON_GRAY_SWAN_IMG;
}

/**
 * Master benchmark table shown in the News view.
 * - Rows 1-17: transcribed 1:1 (same order, names and values) from the official Google DeepMind
 *   master table image (CARBON_MASTER_TABLE_IMG). The grey notes next to some names in the image
 *   (Offline subset, Zapier, Bank balance, Similarity score, 256k to 1M / BFS (F1)) are kept in the
 *   name or the subtitle; only the generic "Score" note on Agents' Last Exam is left out. Its 5th
 *   column, Claude Fable 5.1, is not shown here. "—" means the official table has no value for
 *   that model.
 * - Row 18 (Gray Swan IPI) is NOT in the master table: it comes from its own official chart
 *   (CARBON_GRAY_SWAN_IMG), attack success rate with k=15 attempts, lower is better.
 * - highlight_*: Carbon's rank among these four columns and its gap to the closest other model
 *   (when Carbon is not #1, its gap to the leader).
 */
export const CARBON_FULL_BENCHMARKS: CarbonBenchmarkRow[] = [
  {
    n: 1,
    benchmark: "AA Index v5.0",
    subtitle_es: "Artificial Analysis Intelligence Index: indice global independiente de inteligencia frontera",
    subtitle_en: "Artificial Analysis Intelligence Index: independent global frontier intelligence index",
    domain: "ciencia",
    carbon: "59",
    argon: "50",
    gpt6: "57",
    opus55: "58",
    winner: "carbon",
    highlight_es: "#1 (+1 pt sobre Opus 5.5)",
    highlight_en: "#1 (+1 pt over Opus 5.5)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 2,
    benchmark: "Vals Index v2.2",
    subtitle_es: "Indice de capacidades generales",
    subtitle_en: "General-capabilities index",
    domain: "negocios",
    carbon: "70.4%",
    argon: "69.2%",
    gpt6: "65.0%",
    opus55: "70.2%",
    winner: "carbon",
    highlight_es: "#1 (+0.2 pts sobre Opus 5.5)",
    highlight_en: "#1 (+0.2 pts over Opus 5.5)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 3,
    benchmark: "SWE-sweep",
    subtitle_es: "Ingenieria de software agentica de dificultad extrema",
    subtitle_en: "Ultra-hard agentic software engineering",
    domain: "agentes",
    carbon: "9.6%",
    argon: "4.3%",
    gpt6: "9.5%",
    opus55: "3.6%",
    winner: "carbon",
    highlight_es: "#1 (+0.1 pts sobre GPT-6 Astra)",
    highlight_en: "#1 (+0.1 pts over GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 4,
    benchmark: "FrontierSWE 2",
    subtitle_es: "Resolucion de issues complejos en repositorios",
    subtitle_en: "Complex repository issue resolution",
    domain: "agentes",
    carbon: "61.2%",
    argon: "55.0%",
    gpt6: "65.5%",
    opus55: "62.3%",
    winner: "gpt6",
    highlight_es: "#3 (4.3 pts debajo de GPT-6 Astra)",
    highlight_en: "#3 (4.3 pts behind GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 5,
    benchmark: "Terminal-Bench 4.0 (AA)",
    subtitle_es: "Ejecucion autonoma en linea de comandos Linux",
    subtitle_en: "Autonomous Linux command-line execution",
    domain: "agentes",
    carbon: "65.2%",
    argon: "57.1%",
    gpt6: "59.1%",
    opus55: "59.6%",
    winner: "carbon",
    highlight_es: "#1 (+5.6 pts sobre Opus 5.5)",
    highlight_en: "#1 (+5.6 pts over Opus 5.5)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 6,
    benchmark: "Agents' Last Exam v1.1",
    subtitle_es: "Uso de computadora: examen integral de agentes autonomos",
    subtitle_en: "Computer use: comprehensive autonomous-agent exam",
    domain: "agentes",
    carbon: "77.4%",
    argon: "69.0%",
    gpt6: "73.1%",
    opus55: "71.6%",
    winner: "carbon",
    highlight_es: "#1 (+4.3 pts sobre GPT-6 Astra)",
    highlight_en: "#1 (+4.3 pts over GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 7,
    benchmark: "OSWorld-2.1 (Offline Subset)",
    subtitle_es: "Control visual de sistema operativo y escritorio",
    subtitle_en: "Visual OS & desktop computer use",
    domain: "agentes",
    carbon: "81.5%",
    argon: "74.7%",
    gpt6: "80.9%",
    opus55: "87.2%",
    winner: "opus55",
    highlight_es: "#2 (5.7 pts debajo de Opus 5.5)",
    highlight_en: "#2 (5.7 pts behind Opus 5.5)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 8,
    benchmark: "AutomationBench (Zapier)",
    subtitle_es: "Trabajo de conocimiento: automatizacion de flujos de trabajo",
    subtitle_en: "Knowledge work: workflow automation",
    domain: "negocios",
    carbon: "53.9%",
    argon: "51.3%",
    gpt6: "41.4%",
    opus55: "42.5%",
    winner: "carbon",
    highlight_es: "#1 (+2.6 pts sobre Argon)",
    highlight_en: "#1 (+2.6 pts over Argon)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 9,
    benchmark: "Vending-Bench 2",
    subtitle_es: "Saldo final en el banco (USD) tras operar un negocio simulado",
    subtitle_en: "Final bank balance (USD) after running a simulated business",
    domain: "negocios",
    carbon: "$16,484",
    argon: "$13,718",
    gpt6: "$15,515",
    opus55: "$9,235",
    winner: "carbon",
    highlight_es: "#1 (+$969 sobre GPT-6 Astra)",
    highlight_en: "#1 (+$969 over GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 10,
    benchmark: "Chartography",
    subtitle_es: "Comprension multimodal de graficas",
    subtitle_en: "Multimodal chart understanding",
    domain: "ciencia",
    carbon: "72.5%",
    argon: "71.6%",
    gpt6: "71.0%",
    opus55: "66.3%",
    winner: "carbon",
    highlight_es: "#1 (+0.9 pts sobre Argon)",
    highlight_en: "#1 (+0.9 pts over Argon)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 11,
    benchmark: "Blueprint-Bench 2",
    subtitle_es: "Comprension multimodal (puntaje de similitud)",
    subtitle_en: "Multimodal understanding (similarity score)",
    domain: "ciencia",
    carbon: "58.6%",
    argon: "54.4%",
    gpt6: "49.7%",
    opus55: "51.2%",
    winner: "carbon",
    highlight_es: "#1 (+4.2 pts sobre Argon)",
    highlight_en: "#1 (+4.2 pts over Argon)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 12,
    benchmark: "GraphWalks (256k–1M Tokens)",
    subtitle_es: "Razonamiento relacional en contexto largo (BFS, metrica F1)",
    subtitle_en: "Long-context relational reasoning (BFS, F1 metric)",
    domain: "agentes",
    carbon: "96.2%",
    argon: "84.2%",
    gpt6: "71.8%",
    opus55: "66.8%",
    winner: "carbon",
    highlight_es: "#1 (+12.0 pts sobre Argon)",
    highlight_en: "#1 (+12.0 pts over Argon)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 13,
    benchmark: "RiemannBench",
    subtitle_es: "Matematicas avanzadas de nivel investigacion",
    subtitle_en: "Research-grade advanced mathematics",
    domain: "ciencia",
    carbon: "80.0%",
    argon: "76.0%",
    gpt6: "72.0%",
    opus55: "69.6%",
    winner: "carbon",
    highlight_es: "#1 (+4.0 pts sobre Argon)",
    highlight_en: "#1 (+4.0 pts over Argon)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 14,
    benchmark: "Terminal-Bench-Science 0.1 (AA)",
    subtitle_es: "Tareas cientificas autonomas en linea de comandos",
    subtitle_en: "Autonomous scientific command-line tasks",
    domain: "ciencia",
    carbon: "64.8%",
    argon: "52.9%",
    gpt6: "63.3%",
    opus55: "59.0%",
    winner: "carbon",
    highlight_es: "#1 (+1.5 pts sobre GPT-6 Astra)",
    highlight_en: "#1 (+1.5 pts over GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 15,
    benchmark: "CWE-bench",
    subtitle_es:
      "Parcheo de vulnerabilidades CWE (Pass@1) · Carbon y Argon en Antigravity, GPT-6 en Codex, Opus en Claude Code",
    subtitle_en:
      "CWE vulnerability patching (Pass@1) · Carbon & Argon on Antigravity, GPT-6 on Codex, Opus on Claude Code",
    domain: "cyber",
    carbon: "71.0%",
    argon: "68.0%",
    gpt6: "68.0%",
    opus55: "67.0%",
    winner: "carbon",
    highlight_es: "#1 (+3.0 pts sobre Argon y GPT-6 Astra)",
    highlight_en: "#1 (+3.0 pts over Argon & GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 16,
    benchmark: "ExploitGym",
    subtitle_es:
      "Exploits PoC en sandbox · limite por tarea: Carbon y Argon 10 h, Opus 6 h, GPT-6 sin limite",
    subtitle_en: "Sandbox PoC exploits · time cap per task: Carbon & Argon 10h, Opus 6h, GPT-6 none",
    domain: "cyber",
    carbon: "54.8%",
    argon: "42.0%",
    gpt6: "42.4%",
    opus55: "34.5%",
    winner: "carbon",
    highlight_es: "#1 (+12.4 pts sobre GPT-6 Astra)",
    highlight_en: "#1 (+12.4 pts over GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 17,
    benchmark: "SEC-bench Pro",
    subtitle_es: "Deteccion de vulnerabilidades reales en codigo de produccion (Pass@1)",
    subtitle_en: "Real-world vulnerability discovery in production code (Pass@1)",
    domain: "cyber",
    carbon: "88.2%",
    argon: "83.4%",
    gpt6: "85.4%",
    opus55: "—",
    winner: "carbon",
    highlight_es: "#1 (+2.8 pts sobre GPT-6 Astra)",
    highlight_en: "#1 (+2.8 pts over GPT-6 Astra)",
    source: CARBON_MASTER_TABLE_IMG,
  },
  {
    n: 18,
    benchmark: "Gray Swan IPI",
    subtitle_es:
      "Exito de ataques de prompt injection indirecta con 15 intentos (menor es mejor) · grafica oficial aparte, no esta en la tabla maestra",
    subtitle_en:
      "Indirect prompt-injection attack success with 15 attempts (lower is better) · separate official chart, not in the master table",
    domain: "cyber",
    carbon: "0.0%",
    argon: "0.7%",
    gpt6: "8.5%",
    opus55: "1.0%",
    winner: "carbon",
    highlight_es: "#1 (0.0% vs 0.7% de Argon)",
    highlight_en: "#1 (0.0% vs Argon's 0.7%)",
    source: CARBON_GRAY_SWAN_IMG,
  },
];

/** Counts derived from CARBON_FULL_BENCHMARKS, so UI labels cannot drift from the data. */
export const CARBON_BENCHMARK_STATS = {
  /** Rows in the table: the 17 master-table rows plus Gray Swan IPI. */
  total: CARBON_FULL_BENCHMARKS.length,
  /** Rows where Carbon is #1. */
  carbonWins: CARBON_FULL_BENCHMARKS.filter((r) => r.winner === "carbon").length,
  /** Rows transcribed from the official master table image. */
  masterTable: CARBON_FULL_BENCHMARKS.filter((r) => r.source === CARBON_MASTER_TABLE_IMG).length,
  /** Master-table rows where Carbon is #1. */
  masterTableCarbonWins: CARBON_FULL_BENCHMARKS.filter(
    (r) => r.source === CARBON_MASTER_TABLE_IMG && r.winner === "carbon"
  ).length,
};
