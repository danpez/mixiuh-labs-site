import type { Metadata } from "next";
import Link from "next/link";

// Same ES / EN twin as the page: no PortalClient here to switch the tab title
export const metadata: Metadata = {
  title: "Error 404: Sector no encontrado / Sector not found",
};

export default function NotFound() {
  return (
    <main className="min-h-screen labs-grid-bg flex items-center justify-center px-4 py-16">
      <div
        className="w-full max-w-xl bg-[#111622] border-2 border-[#090B10] shadow-[8px_8px_0_#040508]"
        style={{ outline: "2px solid #FFD100" }}
      >
        <div className="px-4 py-2 bg-[#FFD100] text-[#090B10] border-b-2 border-[#090B10] flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-pixel text-[10px] font-bold">
          <span>MIXIUH LABS // ERROR 404</span>
          <span>
            SECTOR NO ENCONTRADO /{" "}
            <span className="whitespace-nowrap" lang="en">SECTOR NOT FOUND</span>
          </span>
        </div>
        <div className="p-6 sm:p-8 space-y-5">
          <p className="font-pixel text-5xl sm:text-6xl font-bold text-[#FFD100] px-extrude-title">
            404
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
            Este cartucho no existe
            <span className="block text-base sm:text-lg text-[#94A3B8] mt-1" lang="en">
              This cartridge does not exist
            </span>
          </h1>
          <p className="font-mono-hud text-sm text-[#CBD5E1] leading-relaxed">
            La pagina que buscas no esta en el laboratorio. Vuelve al portal para
            ver los episodios, la Arena y el Pixel UI Kit.
            <span className="block text-[#94A3B8] mt-1" lang="en">
              This page is not in the lab. Head back to the portal for the
              episodes, the Arena and the Pixel UI Kit.
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-btn bg-[#FFD100] text-[#090B10] px-5 py-3 text-xs sm:text-sm"
            >
              Volver al inicio / Back home
            </Link>
            <Link
              href="/#arena"
              className="px-btn bg-[#131824] text-[#F5F2EB] px-4 py-3 text-xs sm:text-sm"
            >
              Ir a la Arena / Go to the Arena
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
