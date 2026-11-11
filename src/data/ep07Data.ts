export interface Ep07VideoMetric {
  model_name: string;
  score: string;
  duration_s: number;
  gen_time_s: number;
  credits: number;
  usd: number;
  videoUrl: string;
  note_es: string;
  note_en: string;
  status: "winner" | "ok" | "blocked";
}

export interface Ep07ChallengeData {
  n: number;
  code: "P01" | "P02" | "P03" | "P04";
  name_es: string;
  name_en: string;
  world_es: string;
  world_en: string;
  fun_fact_es: string;
  fun_fact_en: string;
  prompt_es: string;
  prompt_en: string;
  contactSheetUrl: string;
  proofImageUrl?: string;
  winner_label_es: string;
  winner_label_en: string;
  verdict_es: string;
  verdict_en: string;
  omni12: Ep07VideoMetric;
  omni11: Ep07VideoMetric;
  veo31q: Ep07VideoMetric;
}

export const EP07_BENCHMARK_TOTALS = {
  score: "4 - 0 - 0",
  omni12_wins: 4,
  omni11_wins: 0,
  veo31q_wins: 0,
  omni12_avg: "9.70 / 10",
  omni11_avg: "8.58 / 10",
  veo31q_avg: "8.48 / 10",
  omni12_gen_s: 210.6,
  omni11_gen_s: 170.6,
  veo31q_gen_s: 320.7,
  omni12_credits: 132,
  omni11_credits: 51,
  veo31q_credits: 400,
  omni12_usd: 2.71,
  omni11_usd: 3.45,
  veo31q_usd: 12.80,
};

export const EP07_CHALLENGES: Ep07ChallengeData[] = [
  {
    n: 1,
    code: "P01",
    name_es: "Cero Referencias: Dron FPV + Tipografia 3D y Audio Nativo",
    name_en: "Zero References: FPV Drone + 3D Typography & Native Audio",
    world_es: "PRUEBA 01 · TEXTO A VIDEO PURO SIN IMAGENES DE APOYO (8 SEGUNDOS)",
    world_en: "TEST 01 · PURE TEXT-TO-VIDEO WITH ZERO REFERENCE IMAGES (8 SECONDS)",
    fun_fact_es:
      "Dato curioso tecnico: Renderizar dos textos distintos en un mismo vuelo continuo ('MIXIUH LABS' afuera y 'OMNI 1.2' adentro) suele colapsar la atencion espacial de los modelos de difusion, que mezclan las letras o duplican el primer letrero.",
    fun_fact_en:
      "Technical fun fact: Rendering two distinct strings in one unbroken flight ('MIXIUH LABS' outside and 'OMNI 1.2' inside) typically collapses spatial attention in video diffusion models, causing them to merge letters or duplicate the first sign.",
    prompt_es:
      "Toma continua FPV de dron cruzando un callejon cyberpunk bajo la lluvia con un letrero de neon cian que dice exactamente 'MIXIUH LABS', entrando por una ventana hacia un estudio de robotica calido donde flota un holograma volumetrico dorado en 3D que dice 'OMNI 1.2' sobre una mesa de trabajo con chispas y audio nativo sincronizado.",
    prompt_en:
      "Unbroken FPV drone shot flying through a rainy cyberpunk alley past a glowing cyan neon sign reading 'MIXIUH LABS', flying through a window into a warm robotics workshop where a floating golden 3D volumetric hologram reading 'OMNI 1.2' hovers above a workbench with sparks and synced native audio.",
    contactSheetUrl: "/news/omni12/contact_P01.png",
    winner_label_es: "PUNTO PARA GEMINI OMNI 1.2 FLASH (1 - 0 - 0)",
    winner_label_en: "POINT FOR GEMINI OMNI 1.2 FLASH (1 - 0 - 0)",
    verdict_es:
      "Omni 1.2 Flash clava 'MIXIUH LABS' bajo la lluvia con reflejos mojados y proyecta el holograma 3D dorado 'OMNI 1.2' flotando en el aire por $0.56 USD. Omni 1.1 Flash repite 'MIXIUH LABS' adentro y Veo 3.1 Quality ($3.20 USD) aplana el holograma como un cuadro colgado en la pared.",
    verdict_en:
      "Omni 1.2 Flash nails 'MIXIUH LABS' in the rain with wet reflections and projects the floating golden 3D 'OMNI 1.2' hologram in mid-air for $0.56 USD. Omni 1.1 Flash duplicates 'MIXIUH LABS' indoors, and Veo 3.1 Quality ($3.20 USD) flattens the hologram into a wall poster.",
    omni12: {
      model_name: "Gemini Omni 1.2 Flash",
      score: "9.7 / 10",
      duration_s: 8.0,
      gen_time_s: 41.1,
      credits: 24,
      usd: 0.56,
      videoUrl: "/news/omni12/videos/P01_OMNI12.mp4",
      note_es: "Holograma 3D dorado flotante + ambos textos exactos",
      note_en: "Floating golden 3D hologram + both texts exact",
      status: "winner",
    },
    omni11: {
      model_name: "Gemini Omni 1.1 Flash",
      score: "8.8 / 10",
      duration_s: 8.0,
      gen_time_s: 41.1,
      credits: 12,
      usd: 0.81,
      videoUrl: "/news/omni12/videos/P01_OMNI11.mp4",
      note_es: "Duplica el cartel 'MIXIUH LABS' dentro del taller",
      note_en: "Duplicates 'MIXIUH LABS' sign inside the studio",
      status: "ok",
    },
    veo31q: {
      model_name: "Veo 3.1 - Quality",
      score: "9.1 / 10",
      duration_s: 7.9,
      gen_time_s: 67.2,
      credits: 100,
      usd: 3.20,
      videoUrl: "/news/omni12/videos/P01_VEO31Q.mp4",
      note_es: "Holograma plano en pared (5.7x mas caro: $3.20 USD)",
      note_en: "Flat wall poster instead of 3D hologram ($3.20 USD)",
      status: "ok",
    },
  },
  {
    n: 2,
    code: "P02",
    name_es: "Inicio a Fin Continuo: El Pasillo Fantasma de Veo 3.1 Quality",
    name_en: "Start-to-End Frame Continuity: Veo 3.1 Quality's Ghost Hallway",
    world_es: "PRUEBA 02 · INTERPOLACION DE 2 FOTOS OPUESTAS (START FRAME + END FRAME)",
    world_en: "TEST 02 · BRIDGING 2 OPPOSITE PHOTOS (START FRAME + END FRAME)",
    fun_fact_es:
      "Dato curioso tecnico: Al conectar un cuadro inicial bajo tormenta con un cuadro final dentro de un invernadero soleado, los modelos antiguos suelen inventar habitaciones intermedias falsas cuando no logran resolver la apertura fisica de la puerta.",
    fun_fact_en:
      "Technical fun fact: When bridging a stormy outdoor start frame with a sunlit greenhouse end frame, older models often hallucinate fake intermediate rooms when they fail to solve the physical door opening.",
    prompt_es:
      "Transicion continua sin cortes desde la foto inicial (robot explorador en acantilado lluvioso frente a puerta de cristal) hasta la foto final (el mismo robot dentro del invernadero botanico soleado), abriendo las puertas corredizas de cristal en una sola caminata fluida.",
    prompt_en:
      "Continuous unbroken transition from the start photo (explorer robot on a stormy cliff facing glass doors) to the end photo (the same robot inside the sunlit botanical greenhouse), sliding the glass doors open in one smooth walk.",
    contactSheetUrl: "/news/omni12/contact_P02.png",
    winner_label_es: "PUNTO PARA GEMINI OMNI 1.2 FLASH (2 - 0 - 0)",
    winner_label_en: "POINT FOR GEMINI OMNI 1.2 FLASH (2 - 0 - 0)",
    verdict_es:
      "En el segundo 3.0s, Veo 3.1 Quality alucina un pasillo amarillo falso que no existe en ninguna de las 2 fotos de referencia. Omni 1.2 Flash desliza las puertas de cristal y cruza directo de la tormenta al invernadero con iluminacion coherente.",
    verdict_en:
      "At t=3.0s, Veo 3.1 Quality hallucinates a fake yellow hallway that exists in neither reference photo. Omni 1.2 Flash slides the glass doors open and walks straight from the storm into the greenhouse with coherent lighting.",
    omni12: {
      model_name: "Gemini Omni 1.2 Flash",
      score: "9.6 / 10",
      duration_s: 8.0,
      gen_time_s: 47.2,
      credits: 24,
      usd: 0.56,
      videoUrl: "/news/omni12/videos/P02_OMNI12.mp4",
      note_es: "Apertura fisica de puertas de cristal sin cortes",
      note_en: "Seamless physical sliding glass door transition",
      status: "winner",
    },
    omni11: {
      model_name: "Gemini Omni 1.1 Flash",
      score: "8.7 / 10",
      duration_s: 8.0,
      gen_time_s: 41.1,
      credits: 12,
      usd: 0.81,
      videoUrl: "/news/omni12/videos/P02_OMNI11.mp4",
      note_es: "Cruza la puerta pero pierde reflejos del piso mojado",
      note_en: "Crosses doorway but loses wet floor reflections",
      status: "ok",
    },
    veo31q: {
      model_name: "Veo 3.1 - Quality",
      score: "8.5 / 10",
      duration_s: 7.9,
      gen_time_s: 69.2,
      credits: 100,
      usd: 3.20,
      videoUrl: "/news/omni12/videos/P02_VEO31Q.mp4",
      note_es: "Alucina un pasillo amarillo falso en t=3.0s",
      note_en: "Hallucinates a fake yellow hallway at t=3.0s",
      status: "ok",
    },
  },
  {
    n: 3,
    code: "P03",
    name_es: "Fusion de 3 Ingredientes: Por Que Veo 3.1 Quality Bloqueo el Reto",
    name_en: "3-Ingredient Fusion: Why Veo 3.1 Quality Blocked the Challenge",
    world_es: "PRUEBA 03 · 3 IMAGENES DE REFERENCIA SIMULTANEAS (HASTA 6 EN OMNI 1.2)",
    world_en: "TEST 03 · 3 SIMULTANEOUS REFERENCE IMAGES (UP TO 6 IN OMNI 1.2)",
    fun_fact_es:
      "Hallazgo en vivo: Al cargar los 3 ingredientes en Google Flow y elegir Veo 3.1 Quality, la plataforma bloqueo el boton de generar con el aviso: 'El modelo seleccionado no admite los ingredientes agregados'. Solo la familia Omni soporta fusion multi-ingrediente (hasta 6 referencias en Omni 1.2 Flash).",
    fun_fact_en:
      "Live discovery: When loading all 3 ingredients in Google Flow and selecting Veo 3.1 Quality, the UI blocked generation with the error: 'The selected model does not support the added ingredients'. Only the Omni family supports multi-ingredient fusion (up to 6 refs in Omni 1.2 Flash).",
    prompt_es:
      "Combina los 3 ingredientes (1: Panda Rojo Samurai, 2: Maquina Arcade Retro 'MIXIUH', 3: Templo Flotante en las Nubes al Atardecer): el panda samurai juega en la arcade 'MIXIUH' sobre el templo flotante y al ganar la pantalla cambia a 'STAGE CLEAR!' con sonido arcade de victoria.",
    prompt_en:
      "Combine all 3 ingredients (1: Samurai Red Panda, 2: Retro 'MIXIUH' Arcade Cabinet, 3: Floating Sky Temple at Sunset): the samurai red panda plays the 'MIXIUH' arcade on the floating temple deck, and upon winning the screen flashes 'STAGE CLEAR!' with victory arcade audio.",
    contactSheetUrl: "/news/omni12/contact_P03.png",
    proofImageUrl: "/news/omni12/VEO31Q_INGREDIENTS_ERROR_PROOF.png",
    winner_label_es: "PUNTO PARA GEMINI OMNI 1.2 FLASH (3 - 0 - 0)",
    winner_label_en: "POINT FOR GEMINI OMNI 1.2 FLASH (3 - 0 - 0)",
    verdict_es:
      "Omni 1.2 Flash ($0.56 USD) integra las 3 fotos al aire libre respetando la armadura del panda, el gabinete 'MIXIUH' y el cambio de pantalla a 'STAGE CLEAR!'. Omni 1.1 Flash encierra el templo bajo techo y Veo 3.1 Quality bloqueo las imagenes de referencia.",
    verdict_en:
      "Omni 1.2 Flash ($0.56 USD) fuses all 3 photos outdoors, preserving the panda's armor, the 'MIXIUH' cabinet, and the 'STAGE CLEAR!' screen transition. Omni 1.1 Flash encloses the temple indoors, and Veo 3.1 Quality blocked the reference images.",
    omni12: {
      model_name: "Gemini Omni 1.2 Flash",
      score: "9.8 / 10",
      duration_s: 8.0,
      gen_time_s: 51.2,
      credits: 24,
      usd: 0.56,
      videoUrl: "/news/omni12/videos/P03_OMNI12.mp4",
      note_es: "Fusiona los 3 ingredientes al aire libre + 'STAGE CLEAR!'",
      note_en: "Fuses all 3 ingredients outdoors + 'STAGE CLEAR!'",
      status: "winner",
    },
    omni11: {
      model_name: "Gemini Omni 1.1 Flash",
      score: "8.6 / 10",
      duration_s: 8.0,
      gen_time_s: 46.8,
      credits: 12,
      usd: 0.81,
      videoUrl: "/news/omni12/videos/P03_OMNI11.mp4",
      note_es: "Encierra el templo flotante dentro de un salon",
      note_en: "Encloses the floating sky temple inside a room",
      status: "ok",
    },
    veo31q: {
      model_name: "Veo 3.1 - Quality",
      score: "8.0 / 10",
      duration_s: 7.9,
      gen_time_s: 87.1,
      credits: 100,
      usd: 3.20,
      videoUrl: "/news/omni12/videos/P03_VEO31Q.mp4",
      note_es: "Bloqueo las 3 fotos (tuvo que correr solo con texto)",
      note_en: "Blocked all 3 reference photos (text-only fallback)",
      status: "blocked",
    },
  },
  {
    n: 4,
    code: "P04",
    name_es: "15 Segundos Nativos + Lip-Sync en Espanol y Veredicto 4-0",
    name_en: "15-Second Native Clip + Spanish Lip-Sync & 4-0 Verdict",
    world_es: "PRUEBA 04 · DURACION MAXIMA CONTINUA (15S OMNI 1.2 VS 10S OMNI 1.1 VS 8S VEO 3.1)",
    world_en: "TEST 04 · MAX CONTINUOUS DURATION (15S OMNI 1.2 VS 10S OMNI 1.1 VS 8S VEO 3.1)",
    fun_fact_es:
      "Dato curioso tecnico: Mientras Veo 3.1 Quality se corta a los 8s y Omni 1.1 Flash a los 10s, Omni 1.2 Flash permite elegir de 4 a 15 segundos en pasos de 1 segundo, manteniendo la cara del personaje y el lip-sync en espanol durante los 15s completos.",
    fun_fact_en:
      "Technical fun fact: While Veo 3.1 Quality caps out at 8s and Omni 1.1 Flash at 10s, Omni 1.2 Flash lets you dial 4 to 15 seconds in 1-second steps, locking character identity and Spanish lip-sync across all 15 seconds.",
    prompt_es:
      "Secuencia continua de 15 segundos en 3 actos: (0-5s) astronauta ingeniera en base marciana hablando en espanol a camara con lip-sync exacto; (5-10s) camina hacia el ventanal senalando el rover solar 'ROVER SOLAR'; (10-15s) la camara hace zoom exterior al rover desplegando sus paneles en el crater marciano.",
    prompt_en:
      "Continuous 15-second 3-act sequence: (0-5s) engineer astronaut inside a Mars base speaking Spanish to camera with exact lip-sync; (5-10s) walks to the viewport pointing at the 'ROVER SOLAR' rover; (10-15s) camera zooms outside to the rover deploying solar panels in the Martian crater.",
    contactSheetUrl: "/news/omni12/contact_P04.png",
    winner_label_es: "CAMPEON INVICTO GEMINI OMNI 1.2 FLASH (4 - 0 - 0)",
    winner_label_en: "UNDEFEATED CHAMPION GEMINI OMNI 1.2 FLASH (4 - 0 - 0)",
    verdict_es:
      "Omni 1.2 Flash entrega los 15.0 segundos completos con los 3 actos, lip-sync en espanol y el letrero 'ROVER SOLAR' por $1.04 USD. Omni 1.1 se corta a los 10.0s ($1.01 USD) y Veo 3.1 Quality se corta a los 7.9s cobrando $3.20 USD.",
    verdict_en:
      "Omni 1.2 Flash delivers the full 15.0 seconds across all 3 acts with Spanish lip-sync and the 'ROVER SOLAR' callout for $1.04 USD. Omni 1.1 cuts off at 10.0s ($1.01 USD) and Veo 3.1 Quality cuts off at 7.9s while charging $3.20 USD.",
    omni12: {
      model_name: "Gemini Omni 1.2 Flash",
      score: "9.7 / 10",
      duration_s: 15.0,
      gen_time_s: 71.2,
      credits: 60,
      usd: 1.04,
      videoUrl: "/news/omni12/videos/P04_OMNI12.mp4",
      note_es: "15.0s nativos completos (3 actos + lip-sync ES)",
      note_en: "Full 15.0s native clip (all 3 acts + ES lip-sync)",
      status: "winner",
    },
    omni11: {
      model_name: "Gemini Omni 1.1 Flash",
      score: "8.2 / 10",
      duration_s: 10.0,
      gen_time_s: 41.5,
      credits: 15,
      usd: 1.01,
      videoUrl: "/news/omni12/videos/P04_OMNI11.mp4",
      note_es: "Tope maximo de 10.0s (no alcanza el 3er acto)",
      note_en: "Hard 10.0s cap (cuts off before Act 3)",
      status: "ok",
    },
    veo31q: {
      model_name: "Veo 3.1 - Quality",
      score: "8.4 / 10",
      duration_s: 7.9,
      gen_time_s: 97.2,
      credits: 100,
      usd: 3.20,
      videoUrl: "/news/omni12/videos/P04_VEO31Q.mp4",
      note_es: "Tope maximo de 8.0s (cuesta 3x mas por la mitad de tiempo)",
      note_en: "Hard 8.0s cap (3x cost for half the duration)",
      status: "ok",
    },
  },
];
