import { GlassWater, Minus, Plus } from 'lucide-react'
import { KARTU, LABEL, TOMBOL_SEKUNDER, formatAngka } from './tema.js'

const ML_PER_GELAS = 250
const MAKS_GELAS = 20

/** Satu periode ombak diulang dua kali agar translateX(-50%) berulang mulus. */
const OMBAK = 'M0,8 Q25,0 50,8 T100,8 T150,8 T200,8 V16 H0 Z'

export default function JurnalAir({
  gelas,
  onUbah,
  targetGelas = 8,
  targetMl,
  className = '',
}) {
  const targetGelasFinal = targetGelas || 8
  const mlTargetFinal = targetMl || targetGelasFinal * ML_PER_GELAS
  const persen = Math.min(gelas / targetGelasFinal, 1) * 100

  return (
    <section
      className={`${KARTU} flex flex-col p-6 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] ${className}`}
      aria-labelledby="judul-air"
    >
      <div className="flex items-center justify-between">
        <h2 id="judul-air" className={`${LABEL} flex items-center gap-1.5`}>
          <GlassWater size={14} className="text-air" aria-hidden="true" />
          Jurnal Hidrasi
        </h2>
        <span className="text-[11px] text-muted">Standar 35ml/kg BB</span>
      </div>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight tabular-nums text-fg">
          {formatAngka(gelas * ML_PER_GELAS)}
        </span>
        <span className="text-sm text-muted">/ {formatAngka(mlTargetFinal)} ml</span>
      </p>

      <div
        className="relative mt-5 min-h-56 flex-1 overflow-hidden rounded-2xl bg-fg/[0.03] ring-1 ring-inset ring-line"
        role="progressbar"
        aria-label="Gelas air diminum"
        aria-valuemin={0}
        aria-valuemax={targetGelasFinal}
        aria-valuenow={Math.min(gelas, targetGelasFinal)}
        aria-valuetext={`${gelas} dari ${targetGelasFinal} gelas`}
      >
        {/* Garis skala per gelas */}
        {Array.from({ length: Math.min(targetGelasFinal - 1, 12) }, (_, i) => (
          <span
            key={i}
            className="absolute left-0 h-px w-3 bg-fg/15"
            style={{ bottom: `${((i + 1) / targetGelasFinal) * 100}%` }}
            aria-hidden="true"
          />
        ))}

        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: `${persen}%` }}
          aria-hidden="true"
        >
          {gelas > 0 && (
            <>
              <svg
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
                className="absolute bottom-full left-0 -mb-px h-4 w-[200%] fill-cair/35 motion-safe:animate-ombak-lambat"
              >
                <path d={OMBAK} />
              </svg>
              <svg
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
                className="absolute bottom-full left-0 -mb-px h-3 w-[200%] fill-cair/70 motion-safe:animate-ombak"
              >
                <path d={OMBAK} />
              </svg>
            </>
          )}
          <div className="h-full bg-linear-to-b from-cair/60 to-sky-600/45 in-[.light]:from-sky-300/55 in-[.light]:to-sky-400/45" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold tracking-tight tabular-nums text-fg drop-shadow-sm">
            {gelas}
            <span className="text-lg font-semibold text-fg-soft">/{targetGelasFinal}</span>
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-fg-soft">
            {gelas >= targetGelasFinal ? 'Target tercapai' : 'gelas'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onUbah(Math.max(gelas - 1, 0))}
          disabled={gelas === 0}
          aria-label="Kurangi satu gelas"
          className={TOMBOL_SEKUNDER}
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onUbah(Math.min(gelas + 1, MAKS_GELAS))}
          disabled={gelas >= MAKS_GELAS}
          aria-label="Tambah satu gelas (250 ml)"
          className={`${TOMBOL_SEKUNDER} text-air`}
        >
          <Plus size={16} aria-hidden="true" />
          250 ml
        </button>
      </div>
    </section>
  )
}
