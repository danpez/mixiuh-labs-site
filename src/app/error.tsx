"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen labs-grid-bg flex items-center justify-center px-4 py-16">
      <div
        role="alert"
        className="w-full max-w-xl bg-[#111622] border-2 border-[#090B10] shadow-[8px_8px_0_#040508]"
        style={{ outline: "2px solid #FF3355" }}
      >
        <div className="px-4 py-2 bg-[#FF3355] text-white border-b-2 border-[#090B10] flex items-center justify-between font-pixel text-[10px] font-bold">
          <span>MIXIUH LABS // FALLO DEL SISTEMA</span>
          {error.digest && <span>#{error.digest}</span>}
        </div>
        <div className="p-6 sm:p-8 space-y-5">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
            Algo se rompio en el laboratorio
          </h1>
          <p className="font-mono-hud text-sm text-[#CBD5E1] leading-relaxed">
            Un componente fallo al cargar. Puedes reintentar sin perder tu lugar.
            <span className="block text-[#94A3B8] mt-1" lang="en">
              Something broke while loading. You can retry safely.
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="px-btn bg-[#FFD100] text-[#090B10] px-5 py-3 text-xs sm:text-sm"
            >
              Reintentar / Retry
            </button>
            <Link
              href="/"
              className="px-btn bg-[#131824] text-[#F5F2EB] px-4 py-3 text-xs sm:text-sm"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
