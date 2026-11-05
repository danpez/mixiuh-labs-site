import { NextResponse } from "next/server";

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://labs.mixiuh.online</loc>
<lastmod>2026-11-05T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>1</priority>
</url>
<url>
<loc>https://labs.mixiuh.online/benchmarks</loc>
<lastmod>2026-11-05T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://labs.mixiuh.online/arena</loc>
<lastmod>2026-11-05T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://labs.mixiuh.online/pixel-ui</loc>
<lastmod>2026-11-05T00:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://labs.mixiuh.online/foro</loc>
<lastmod>2026-11-05T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://labs.mixiuh.online/noticias</loc>
<lastmod>2026-11-05T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
</urlset>
`;

export function GET() {
  return new NextResponse(XML, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
