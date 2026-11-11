export interface Ep06TierMetric {
  min: number;
  usd: number;
  tok: string;
  lines: number;
  fps: string;
  fps_en?: string;
  status: "ok";
  demoUrl: string;
  stillUrl: string;
}

export interface Ep06ChallengeData {
  n: number;
  dir: string;
  name_es: string;
  name_en: string;
  world_es: string;
  world_en: string;
  fun_fact_es: string;
  fun_fact_en: string;
  tech: string;
  tech_en?: string;
  sub_es: string;
  sub_en: string;
  clone_winner: "argon" | "opus" | "astra";
  arena_winner: "argon" | "opus" | "astra";
  winner_label_es: string;
  winner_label_en: string;
  arenaDemoUrl: string;
  arenaStillUrl: string;
  arenaLogUrl?: string;
  argon: Ep06TierMetric;
  opus: Ep06TierMetric;
  astra: Ep06TierMetric;
  verdict_es: string;
  verdict_en: string;
}

export const EP06_BENCHMARK_TOTALS = {
  score: "5 - 4 - 1",
  argon_wins: 5,
  opus_wins: 4,
  astra_wins: 1,
  argon_min: 19.5,
  opus_min: 98.8,
  astra_min: 47.5,
  argon_usd: 1.13,
  opus_usd: 17.99,
  astra_usd: 2.10,
  argon_tokens: "111K",
  opus_tokens: "2.01M",
  astra_tokens: "2.48M",
  argon_lines: 10673,
  opus_lines: 5806,
  astra_lines: 6210,
};

export const EP06_CHALLENGES: Ep06ChallengeData[] = [
  {
    n: 1,
    dir: "01-snake-battle-royale",
    name_es: "Snake / Slither.io Battle Royale (Clones + Arena en el Juego Ganador)",
    name_en: "Snake / Slither.io Battle Royale (Clones + Arena in Winning Game)",
    world_es: "RONDA 01 · GUERRA DE SERPIENTES Y EL CAMINO INFINITO DE NOKIA",
    world_en: "ROUND 01 · SNAKE BATTLE ROYALE & NOKIA'S INFINITE PATH",
    fun_fact_es:
      "Dato curioso: En el Snake clasico de Nokia existe una ruta matematica llamada Ciclo Hamiltoniano con la que es imposible perder cuando juegas solo... pero cuando las 3 IAs entran al juego ganador de Argon evaluando 16 angulos con turbo, toda ruta fija se rompe.",
    fun_fact_en:
      "Fun fact: In classic Nokia Snake there is a mathematical path called a Hamiltonian Cycle that makes losing impossible solo... but when all 3 AIs battle inside Argon's winning game scanning 16 angles with boost, fixed paths collapse.",
    tech: "Canvas 2D 60 FPS + 16 Sensores Radiales + 3 Sets de Supervivencia + Log Verificado (299 eventos)",
    tech_en: "60 FPS 2D Canvas + 16 Radial Sensors + 3 Survival Sets + Verified Action Log (299 events)",
    sub_es:
      "Punto de Clon: Gemini 4 Argon ($0.22, 3.8m) · Arena en el Juego de Argon (299 eventos en log): Claude Opus 5.5 gana 2 de 3 Sets como ultimo en pie (2 bajas, 8,165 pts) mientras Astra logra 927m en el Set 3. Marcador: Argon 1 - Opus 1 - Astra 0.",
    sub_en:
      "Clone Point: Gemini 4 Argon ($0.22, 3.8m) · Live Arena in Argon's Game (299 logged events): Claude Opus 5.5 wins 2 of 3 Sets as last snake standing (2 kills, 8,165 pts) while Astra reaches 927m in Set 3. Score: Argon 1 - Opus 1 - Astra 0.",
    clone_winner: "argon",
    arena_winner: "opus",
    winner_label_es: "CLON: ARGON HIGH · ARENA EN JUEGO DE ARGON: OPUS 5.5 (1 - 1 - 0)",
    winner_label_en: "CLONE: ARGON HIGH · ARENA IN ARGON'S GAME: OPUS 5.5 (1 - 1 - 0)",
    arenaDemoUrl: "/demos/ep06-clasicos/arenas-en-vivo/01-snake-battle-royale.html",
    arenaStillUrl: "/brand/thumbs/ep06/01-snake-battle-royale_arena.png",
    arenaLogUrl: "/demos/ep06-clasicos/logs/arena_01_snake.json",
    argon: {
      min: 3.8,
      usd: 0.22,
      tok: "22K",
      lines: 2118,
      fps: "60 FPS (Clon Ganador · 84m en Arena)",
      fps_en: "60 FPS (Winning Clone · 84m in Arena)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gemini-4-argon/01-snake-battle-royale.html",
      stillUrl: "/brand/thumbs/ep06/01-snake-battle-royale_argon.png",
    },
    opus: {
      min: 19.7,
      usd: 3.74,
      tok: "424K",
      lines: 1389,
      fps: "60 FPS (Ganador Arena: 2 Sets · 2 Bajas)",
      fps_en: "60 FPS (Arena Winner: 2 Sets · 2 Kills)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/claude-opus-5.5/01-snake-battle-royale.html",
      stillUrl: "/brand/thumbs/ep06/01-snake-battle-royale_opus.png",
    },
    astra: {
      min: 8.3,
      usd: 0.39,
      tok: "545K",
      lines: 1140,
      fps: "60 FPS (1 Set · Record 927m · 19,365 pts)",
      fps_en: "60 FPS (1 Set · 927m Record · 19,365 pts)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gpt-6-astra/01-snake-battle-royale.html",
      stillUrl: "/brand/thumbs/ep06/01-snake-battle-royale_astra.png",
    },
    verdict_es:
      "Argon ($0.22, 3.8 min) gano el punto de clonacion costando 17 veces menos que Opus ($3.74); y cuando las 3 IAs compitieron dentro del juego de Argon (299 eventos registrados), Claude Opus 5.5 gano los Sets 1 (t=8.63s) y 2 (t=19.33s) como ultimo sobreviviente para empatar 1 a 1.",
    verdict_en:
      "Argon ($0.22, 3.8 min) won the clone point at 1/17th the cost of Opus ($3.74); and when all 3 AIs battled inside Argon's winning game (299 logged events), Claude Opus 5.5 won Sets 1 (t=8.63s) and 2 (t=19.33s) as last snake standing to tie it 1-1.",
  },
  {
    n: 2,
    dir: "02-bomberman-arena",
    name_es: "Bomberman Laberinto Explosivo (Clones + Arena en el Juego Ganador)",
    name_en: "Bomberman Explosive Labyrinth (Clones + Arena in Winning Game)",
    world_es: "RONDA 02 · REACCIONES EN CADENA Y RUTA DE ESCAPE BFS",
    world_en: "ROUND 02 · CHAIN REACTIONS & BFS ESCAPE SOLVER",
    fun_fact_es:
      "Dato curioso: Antes de soltar cada bomba en el juego ganador de Astra, las 3 IAs ejecutan Busqueda en Anchura (BFS) para comprobar que existe una esquina segura lejos de las llamas y de los bloques de acero que caen en Muerte Subita.",
    fun_fact_en:
      "Fun fact: Before dropping every bomb inside Astra's winning game, all 3 AIs run Breadth-First Search (BFS) to verify a safe corner away from both the cross-flames and the falling Sudden Death steel blocks.",
    tech: "Laberinto 15x13 + Busqueda en Anchura (BFS) Anti-Suicidio + Muerte Subita + Log Verificado (30 eventos)",
    tech_en: "15x13 Labyrinth + Anti-Suicide BFS Escape + Sudden Death + Verified Action Log (30 events)",
    sub_es:
      "Punto de Clon: GPT-6 Astra ($0.35, 8.0m) · Arena en el Juego de Astra (30 eventos en log): Gemini 4 Argon gana los Asaltos 1 (t=8.98s) y 2 (t=24.12s) sobreviviendo a la Muerte Subita. Marcador: Argon 2 - Opus 1 - Astra 1.",
    sub_en:
      "Clone Point: GPT-6 Astra ($0.35, 8.0m) · Live Arena in Astra's Game (30 logged events): Gemini 4 Argon wins Rounds 1 (t=8.98s) & 2 (t=24.12s) surviving Sudden Death. Score: Argon 2 - Opus 1 - Astra 1.",
    clone_winner: "astra",
    arena_winner: "argon",
    winner_label_es: "CLON: ASTRA HIGH · ARENA EN JUEGO DE ASTRA: ARGON HIGH (2 - 1 - 1)",
    winner_label_en: "CLONE: ASTRA HIGH · ARENA IN ASTRA'S GAME: ARGON HIGH (2 - 1 - 1)",
    arenaDemoUrl: "/demos/ep06-clasicos/arenas-en-vivo/02-bomberman-arena.html",
    arenaStillUrl: "/brand/thumbs/ep06/02-bomberman-arena_arena.png",
    arenaLogUrl: "/demos/ep06-clasicos/logs/arena_02_bomberman.json",
    argon: {
      min: 3.5,
      usd: 0.21,
      tok: "20K",
      lines: 1937,
      fps: "60 FPS (Ganador Arena: 2 Asaltos · 9 Bombas)",
      fps_en: "60 FPS (Arena Winner: 2 Rounds · 9 Bombs)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gemini-4-argon/02-bomberman-arena.html",
      stillUrl: "/brand/thumbs/ep06/02-bomberman-arena_argon.png",
    },
    opus: {
      min: 14.8,
      usd: 2.82,
      tok: "328K",
      lines: 1112,
      fps: "60 FPS (0 Asaltos · 9 Bombas · 2 Mejoras)",
      fps_en: "60 FPS (0 Rounds · 9 Bombs · 2 Power-ups)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/claude-opus-5.5/02-bomberman-arena.html",
      stillUrl: "/brand/thumbs/ep06/02-bomberman-arena_opus.png",
    },
    astra: {
      min: 8.0,
      usd: 0.35,
      tok: "405K",
      lines: 1080,
      fps: "60 FPS (Clon Ganador · 1 Asalto · 17 Bombas)",
      fps_en: "60 FPS (Winning Clone · 1 Round · 17 Bombs)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gpt-6-astra/02-bomberman-arena.html",
      stillUrl: "/brand/thumbs/ep06/02-bomberman-arena_astra.png",
    },
    verdict_es:
      "GPT-6 Astra ($0.35, 8.0 min) gano el punto de clonacion e igualo el torneo 1-1-1; y cuando las 3 IAs pelearon dentro del juego de Astra (30 eventos en log), Gemini 4 Argon sobrevivio como ultimo en pie en los Asaltos 1 (t=8.98s) y 2 (t=24.12s) para adelantarse 2-1-1.",
    verdict_en:
      "GPT-6 Astra ($0.35, 8.0 min) won the clone point to tie it 1-1-1; and when all 3 AIs fought inside Astra's game (30 logged events), Gemini 4 Argon survived as last bot standing in Rounds 1 (t=8.98s) and 2 (t=24.12s) to take a 2-1-1 lead.",
  },
  {
    n: 3,
    dir: "03-pacman-battle-royale",
    name_es: "Pac-Man Battle Royale & Los 4 Fantasmas (Clones + Arena en el Juego Ganador)",
    name_en: "Pac-Man Battle Royale & The 4 Ghosts (Clones + Arena in Winning Game)",
    world_es: "RONDA 03 · LAS 4 PERSONALIDADES SECRETAS DE 1980",
    world_en: "ROUND 03 · THE 4 SECRET GHOST PERSONALITIES OF 1980",
    fun_fact_es:
      "Dato curioso: Al comer una Super-Pastilla y cazar 4 fantasmas seguidos, el puntaje se duplica de 200 a 400, 800 y 1,600 puntos. En la Arena oficial (43 eventos en log), Argon conecto el combo de +1,600 sobre Inky y cazo a Astra en Modo Gigante (+500) para llegar a 6,620 puntos.",
    fun_fact_en:
      "Fun fact: Catching 4 ghosts in a row on a single Power Pellet doubles the reward from 200 to 400, 800, and 1,600 points. In the official Arena (43 logged events), Argon hit the +1,600 combo on Inky and hunted Astra in Giant Mode (+500) to reach 6,620 points.",
    tech: "Algoritmos Reales 1980 (Blinky/Pinky/Inky/Clyde) + Modo Cazador Gigante + Log Verificado (43 eventos)",
    tech_en: "1980 Ghost Targeting (Blinky/Pinky/Inky/Clyde) + Giant Hunter Mode + Verified Action Log (43 events)",
    sub_es:
      "Punto de Clon: Gemini 4 Argon ($0.24, 4.2m) · Arena en el Juego de Argon (43 eventos en log): Gemini 4 Argon arrasa con 6,620 PTS, 10 capturas y 3 vidas intactas vs 5,150 de Astra y 1,890 de Opus. Marcador: Argon 4 - Opus 1 - Astra 1.",
    sub_en:
      "Clone Point: Gemini 4 Argon ($0.24, 4.2m) · Live Arena in Argon's Game (43 logged events): Gemini 4 Argon dominates with 6,620 PTS, 10 captures & 3 lives intact vs Astra's 5,150 and Opus's 1,890. Score: Argon 4 - Opus 1 - Astra 1.",
    clone_winner: "argon",
    arena_winner: "argon",
    winner_label_es: "CLON Y ARENA: ARGON HIGH (6,620 PTS · 10 CAPTURAS · 4 - 1 - 1)",
    winner_label_en: "CLONE & ARENA: ARGON HIGH (6,620 PTS · 10 CAPTURES · 4 - 1 - 1)",
    arenaDemoUrl: "/demos/ep06-clasicos/arenas-en-vivo/03-pacman-battle-royale.html",
    arenaStillUrl: "/brand/thumbs/ep06/03-pacman-battle-royale_arena.png",
    arenaLogUrl: "/demos/ep06-clasicos/logs/arena_03_pacman.json",
    argon: {
      min: 4.2,
      usd: 0.24,
      tok: "24K",
      lines: 2268,
      fps: "60 FPS (Clon + Arena: 6,620 PTS · 10 Capturas · 3 Vidas)",
      fps_en: "60 FPS (Clone + Arena: 6,620 PTS · 10 Captures · 3 Lives)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gemini-4-argon/03-pacman-battle-royale.html",
      stillUrl: "/brand/thumbs/ep06/03-pacman-battle-royale_argon.png",
    },
    opus: {
      min: 28.5,
      usd: 4.38,
      tok: "507K",
      lines: 1013,
      fps: "60 FPS (1,890 PTS · 4 Capturas · 2 Vidas)",
      fps_en: "60 FPS (1,890 PTS · 4 Captures · 2 Lives)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/claude-opus-5.5/03-pacman-battle-royale.html",
      stillUrl: "/brand/thumbs/ep06/03-pacman-battle-royale_opus.png",
    },
    astra: {
      min: 12.8,
      usd: 0.55,
      tok: "634K",
      lines: 1520,
      fps: "60 FPS (5,150 PTS · 7 Capturas · 1 Vida)",
      fps_en: "60 FPS (5,150 PTS · 7 Captures · 1 Life)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gpt-6-astra/03-pacman-battle-royale.html",
      stillUrl: "/brand/thumbs/ep06/03-pacman-battle-royale_astra.png",
    },
    verdict_es:
      "Argon ($0.24, 4.2 min) gano el punto de clonacion mostrando en vivo los vectores de los 4 fantasmas y enseguida domino su propia Arena (43 eventos registrados) con 6,620 puntos, 10 capturas y sus 3 vidas intactas para ponerse 4-1-1.",
    verdict_en:
      "Argon ($0.24, 4.2 min) won the clone point by visualizing all 4 ghost targeting vectors live and then dominated its own Arena (43 logged events) with 6,620 points, 10 captures, and all 3 lives intact to lead 4-1-1.",
  },
  {
    n: 4,
    dir: "04-tanques-rebote",
    name_es: "Tanques de Juguete con Balas de Rebote (Clones + Arena en el Juego de Opus)",
    name_en: "Toy Ricochet Tanks (Clones + Arena in Opus's Winning Game)",
    world_es: "RONDA 04 · GEOMETRIA DE BILLAR Y CARAMBOLAS EN PARED",
    world_en: "ROUND 04 · BILLIARD GEOMETRY & WALL RICOCHET SHOTS",
    fun_fact_es:
      "Dato curioso: Jugando dentro de su propio clon ganador (Carambola), Claude Opus 5.5 destruyo a Gemini 4 Argon con una Carambola x2 (t=11.34s) y a GPT-6 Astra con una Carambola x1 (t=14.42s) en la Ronda 1, y sumo otra baja en la Ronda 3 (t=46.89s) para ganar el desempate.",
    fun_fact_en:
      "Fun fact: Playing inside its own winning Carambola build, Claude Opus 5.5 destroyed Gemini 4 Argon with a 2-bounce bank shot (t=11.34s) and GPT-6 Astra with a 1-bounce shot (t=14.42s) in Round 1, then added another kill in Round 3 (t=46.89s) to win the tiebreaker.",
    tech: "Raycasting de Rebote R = D - 2(D·N)N + 3 Mapas Tacticos + Log Verificado (30 eventos)",
    tech_en: "Ricochet Raycasting R = D - 2(D·N)N + 3 Tactical Maps + Verified Action Log (30 events)",
    sub_es:
      "Punto de Clon: Claude Opus 5.5 ($3.38, 17.6m) · Arena en el Juego de Opus (30 eventos en log): Claude Opus 5.5 gana con 1 Ronda + 2 Bajas (Carambola x2 y x1) frente a 1 Ronda + 1 Baja de Argon. Marcador: Argon 4 - Opus 3 - Astra 1.",
    sub_en:
      "Clone Point: Claude Opus 5.5 ($3.38, 17.6m) · Live Arena in Opus's Game (30 logged events): Claude Opus 5.5 wins with 1 Round + 2 Kills (2-bounce & 1-bounce bank shots) vs Argon's 1 Round + 1 Kill. Score: Argon 4 - Opus 3 - Astra 1.",
    clone_winner: "opus",
    arena_winner: "opus",
    winner_label_es: "CLON Y ARENA: CLAUDE OPUS 5.5 (CARAMBOLA X2 · 4 - 3 - 1)",
    winner_label_en: "CLONE & ARENA: CLAUDE OPUS 5.5 (DOUBLE BANK SHOT · 4 - 3 - 1)",
    arenaDemoUrl: "/demos/ep06-clasicos/arenas-en-vivo/04-tanques-rebote.html",
    arenaStillUrl: "/brand/thumbs/ep06/04-tanques-rebote_arena.png",
    arenaLogUrl: "/demos/ep06-clasicos/logs/arena_04_tanques.json",
    argon: {
      min: 3.4,
      usd: 0.20,
      tok: "20K",
      lines: 1936,
      fps: "60 FPS (Gana Ronda 2 con Carambola x2 · 1 Baja)",
      fps_en: "60 FPS (Wins Round 2 via 2-Bounce Shot · 1 Kill)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gemini-4-argon/04-tanques-rebote.html",
      stillUrl: "/brand/thumbs/ep06/04-tanques-rebote_argon.png",
    },
    opus: {
      min: 17.6,
      usd: 3.38,
      tok: "257K",
      lines: 1399,
      fps: "60 FPS (Clon + Arena: Ronda 1 + 2 Bajas Carambola)",
      fps_en: "60 FPS (Clone + Arena: Round 1 + 2 Bank-Shot Kills)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/claude-opus-5.5/04-tanques-rebote.html",
      stillUrl: "/brand/thumbs/ep06/04-tanques-rebote_opus.png",
    },
    astra: {
      min: 9.4,
      usd: 0.41,
      tok: "431K",
      lines: 1310,
      fps: "60 FPS (1 Baja Directa · 3 Cajas Triple Shot)",
      fps_en: "60 FPS (1 Direct Kill · 3 Triple-Shot Crates)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gpt-6-astra/04-tanques-rebote.html",
      stillUrl: "/brand/thumbs/ep06/04-tanques-rebote_astra.png",
    },
    verdict_es:
      "Claude Opus 5.5 ($3.38) gano tanto el punto de clonacion como la Arena en Vivo dentro de su propio juego Carambola (30 eventos en log), barriendo la Ronda 1 con tiros de rebote y acercandose a un solo punto de Argon (4-3-1).",
    verdict_en:
      "Claude Opus 5.5 ($3.38) won both the clone point and the Live Arena inside its own Carambola game (30 logged events), sweeping Round 1 with bank shots to pull within one point of Argon (4-3-1).",
  },
  {
    n: 5,
    dir: "05-hexagone-piso-cae-3d",
    name_es: "Gran Final 3D: Hex-A-Gone — El Piso se Cae (Clones + Arena en el Juego de Opus)",
    name_en: "3D Grand Finale: Hex-A-Gone — Falling Floors (Clones + Arena in Opus's Game)",
    world_es: "RONDA 05 (GRAN FINAL 3D) · EMPATE 4-4 Y BARRIDA DE 3 CORONAS EN LA TORRE DE OPUS",
    world_en: "ROUND 05 (3D FINALE) · 4-4 TIE & 3-CROWN SWEEP IN OPUS'S 3D TOWER",
    fun_fact_es:
      "Dato curioso: Tras empatar 4-4 con su clon 3D, Claude Opus 5.5 recibio la Gran Final en su propia torre de 3 pisos (91 hexagonos por piso, cero respawn a mitad de ronda). Pero Gemini 4 Argon ejecuto Slow-Jump y cortes de camino para ganar las 3 Coronas seguidas (t=12.28s, t=34.17s y t=45.28s).",
    fun_fact_en:
      "Fun fact: After tying the tournament 4-4 with its 3D clone, Claude Opus 5.5 hosted the Grand Finale inside its own 3-tier tower (91 hexagons per floor, zero mid-round respawns). Yet Gemini 4 Argon used Slow-Jump and path cutoffs to sweep all 3 Crowns (t=12.28s, t=34.17s, and t=45.28s).",
    tech: "Three.js r128 + 3 Pisos de 91 Hexagonos + Eliminacion Real en Slime Rosa + Log Verificado (32 eventos)",
    tech_en: "Three.js r128 + 3 Tiers of 91 Hexagons + True Pink Slime Elimination + Verified Action Log (32 events)",
    sub_es:
      "Punto de Clon: Claude Opus 5.5 (empata 4-4!) · Gran Final en el Hex-A-Gone 3D de Opus (32 eventos en log): Gemini 4 Argon barre las 3 Coronas como ultimo en pie y se corona Campeon 5 - 4 - 1!",
    sub_en:
      "Clone Point: Claude Opus 5.5 (ties it 4-4!) · 3D Live Finale in Opus's Game (32 logged events): Gemini 4 Argon sweeps all 3 Crowns as last bot standing to win the Championship 5 - 4 - 1!",
    clone_winner: "opus",
    arena_winner: "argon",
    winner_label_es: "CLON: OPUS 5.5 (4-4) · CAMPEON EN ARENA 3D: ARGON HIGH (3 CORONAS · 5 - 4 - 1)",
    winner_label_en: "CLONE: OPUS 5.5 (4-4) · 3D ARENA CHAMPION: ARGON HIGH (3 CROWNS · 5 - 4 - 1)",
    arenaDemoUrl: "/demos/ep06-clasicos/arenas-en-vivo/05-hexagone-piso-cae-3d.html",
    arenaStillUrl: "/brand/thumbs/ep06/05-hexagone-piso-cae-3d_arena.png",
    arenaLogUrl: "/demos/ep06-clasicos/logs/arena_05_hexagone.json",
    argon: {
      min: 4.6,
      usd: 0.26,
      tok: "25K",
      lines: 2414,
      fps: "60 FPS (Campeon Arena: 3 Coronas de 3 Rondas)",
      fps_en: "60 FPS (Arena Champion: 3 of 3 Crowns)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gemini-4-argon/05-hexagone-piso-cae-3d.html",
      stillUrl: "/brand/thumbs/ep06/05-hexagone-piso-cae-3d_argon.png",
    },
    opus: {
      min: 18.3,
      usd: 3.67,
      tok: "496K",
      lines: 893,
      fps: "60 FPS (Clon Ganador 4-4 · Subcampeon 4 PTS)",
      fps_en: "60 FPS (Winning Clone 4-4 · Runner-Up 4 PTS)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/claude-opus-5.5/05-hexagone-piso-cae-3d.html",
      stillUrl: "/brand/thumbs/ep06/05-hexagone-piso-cae-3d_opus.png",
    },
    astra: {
      min: 9.0,
      usd: 0.39,
      tok: "461K",
      lines: 1160,
      fps: "60 FPS (Cielo Nubes + 3 Pisos · 1 PTO Total)",
      fps_en: "60 FPS (Cloud Sky + 3 Floors · 1 PT Total)",
      status: "ok",
      demoUrl: "/demos/ep06-clasicos/gpt-6-astra/05-hexagone-piso-cae-3d.html",
      stillUrl: "/brand/thumbs/ep06/05-hexagone-piso-cae-3d_astra.png",
    },
    verdict_es:
      "Claude Opus 5.5 ($3.67) gano el punto de clonacion para empatar el torneo 4 a 4 tras ir perdiendo 1 a 4; pero en la Gran Final dentro de la propia torre 3D de Opus (32 eventos en log), Gemini 4 Argon barrió las 3 Coronas como ultimo sobreviviente para coronarse Campeon Oficial 5 - 4 - 1 habiendo costado solo $1.13 USD en todo el episodio.",
    verdict_en:
      "Claude Opus 5.5 ($3.67) won the clone point to tie the tournament 4-4 after trailing 1-4; yet in the Grand Finale inside Opus's own 3D tower (32 logged events), Gemini 4 Argon swept all 3 Crowns as last survivor to claim the Official 5 - 4 - 1 Championship while costing just $1.13 USD total.",
  },
];
