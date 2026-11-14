# labs.mixiuh.online — Mixiuh Labs

> "Aqui no se opina: se prueba." Portal de benchmarks zero-shot de IA, Arena de demos jugables,
> Noticias IA, foro tecnico y la libreria gratuita **Mixiuh Pixel UI**.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · desplegado en Vercel.

## Scripts

| Comando | Que hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:3008` |
| `npm run build` | Regenera el kit de Pixel UI, revisa los archivos estaticos y las portadas ligeras (`prebuild`), luego compila para produccion |
| `npm run start` | Sirve el build de produccion |
| `npm run lint` | ESLint 9 (config plana en `eslint.config.mjs`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:assets` | Falla si `src/` cita una imagen, video o archivo que no esta en `public/` o no esta en git (corre solo antes de cada build) |
| `npm run covers` | Genera la version ligera (AVIF, 1600 px) de cada portada listada en `src/data/covers.ts` y actualiza `src/data/coverManifest.json`. Al agregar un episodio: anota su portada ahi, corre esto, usa `COVERS.<id>` como `thumb` y sube los `.avif` |
| `npm run check:covers` | Falla si una portada no tiene su version ligera al dia o si pesa mas de 250 KB (corre solo antes de cada build) |
| `npm run test:e2e` | Playwright sobre el build de produccion (`npm run build` antes), en Chromium y WebKit (Safari), en espanol e ingles. En el monitor de la portada ningun texto se corta ni se trunca y todas las portadas cargan, en 19 anchos de 280 a 1920 px. Ninguna portada que baja el navegador pesa mas de 250 KB, no se descarga el original pesado, y un navegador sin AVIF sigue viendo todas las portadas |
| `npm run pixel-ui:kit` | Publica `public/pixel-ui/mixiuh-pixel-ui.css` (CDN) y `mixiuh-pixel-ui-kit.zip` |

## Estructura

```
src/app/                 layout, pagina principal (portal de una sola pagina), 404, error, robots, sitemap
src/app/api/source/      devuelve el index.html original de cada demo (lista blanca de modelos/carpetas)
src/components/          vistas pesadas cargadas bajo demanda (Noticias, Foro, Arena EP01/EP02, Pixel UI)
src/data/                datos de episodios, foro, glosario, noticias y calendario de lanzamientos
packages/mixiuh-pixel-ui fuente UNICA de la libreria @mixiuh/pixel-ui (ver su README)
scripts/                 build-pixel-ui-kit.mjs (CDN + ZIP deterministas)
public/demos/            salidas zero-shot originales de cada modelo: NO se editan nunca
```

## Navegacion y URLs

Cada vista tiene su URL compartible y el boton "atras" funciona:
`#laboratorios`, `#ep04-escalera-claude`, `#ep03-superpowers-kit`, `#ep02-argon-vs-opus`,
`#ep01-argon-vs-flash`, `#comentario-al-codigo`, `#noticias`, `#arena`, `#pixel-ui`, `#foro`, `#glosario`.
`Ctrl/⌘ + K` abre la paleta de comandos (secciones, episodios, demos, ajustes y terminos del glosario).

## Calendario de lanzamientos (sin spoilers)

`src/data/releaseSchedule.ts` define la fecha/hora exacta (CST) de cada produccion. Todo el contenido
(tarjetas, dossiers, demos, foro, calendario, bloque principal del inicio) se oculta hasta esa hora.

- El HTML estatico se genera con la hora del build (`BUILD_TIME`, inyectada desde `next.config.ts`)
  y el navegador cambia a su reloj real despues de hidratar, asi nunca hay desajustes de hidratacion.
- `?preview=all` muestra todo lo programado para revisarlo antes de publicar.

## Sistema de diseno

Todo el sitio usa `@mixiuh/pixel-ui`: paleta Playdate de tinta/tiza con 5 acentos, esquinas rectas,
superficies opacas, sombras duras, iconos pixel 16x16 y tipografias pixel. Los colores por produccion
viven en `EPISODE_ACCENT` (`src/app/page.tsx`). La libreria respeta `prefers-reduced-motion` y tiene
foco visible en todos los controles.
