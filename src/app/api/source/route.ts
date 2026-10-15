import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VALID_MODELS = new Set(["argon", "flash"]);
const VALID_DIRS = new Set([
  "sistema-solar",
  "visualizador-adn",
  "vida-artificial",
  "generador-mazmorras",
  "falling-sand",
  "motor-raycasting",
  "generador-sprites",
  "reloj-analogico",
  "arbol-fractal",
  "spirograph-parametrico",
  "gummy-bears",
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model") || "argon";
  const dir = searchParams.get("dir") || "motor-raycasting";

  if (!VALID_MODELS.has(model) || !VALID_DIRS.has(dir)) {
    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "demos", model, dir, "index.html");
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const code = fs.readFileSync(filePath, "utf-8");
  const lines = code.split("\n").length;
  const bytes = Buffer.byteLength(code, "utf-8");

  return NextResponse.json({
    model,
    dir,
    lines,
    bytes,
    kb: Number((bytes / 1024).toFixed(1)),
    code,
  });
}
