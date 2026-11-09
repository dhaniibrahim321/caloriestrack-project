import { Beef, Droplets, Wheat } from 'lucide-react'

/** Kartu kaca melayang (glassmorphism) yang dipakai di seluruh halaman. */
export const KARTU = 'rounded-2xl border border-line bg-surface backdrop-blur-xl transition-shadow duration-300'

/** Label kecil renggang untuk metrik. */
export const LABEL = 'text-xs font-semibold uppercase tracking-wider text-muted'

export const INPUT =
  'w-full rounded-xl border border-fg/12 bg-fg/[0.04] px-4 py-2.5 text-sm text-fg tabular-nums placeholder:text-muted/80 transition-colors focus:border-brand/60 focus:outline-none'

export const TOMBOL_UTAMA =
  'flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-[background-color,box-shadow,transform] duration-200 hover:bg-emerald-300 hover:shadow-[0_0_28px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 in-[.light]:bg-emerald-600 in-[.light]:text-white in-[.light]:hover:bg-emerald-500'

export const TOMBOL_SEKUNDER =
  'flex items-center justify-center gap-2 rounded-xl bg-fg/[0.06] px-4 py-3 text-sm font-medium text-fg-soft transition-colors hover:bg-fg/10 hover:text-fg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'

export const TOMBOL_IKON =
  'grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-fg/5 hover:text-fg active:scale-95'

/**
 * Metadata visual makronutrisi. Kelas Tailwind ditulis utuh agar terdeteksi saat build.
 * `warna` adalah variabel CSS (dipakai SVG) yang otomatis menyesuaikan tema.
 */
export const MAKRO = [
  {
    kunci: 'karbo',
    label: 'Karbohidrat',
    singkat: 'K',
    ikon: Wheat,
    warna: 'var(--karbo)',
    teks: 'text-karbo',
    titik: 'bg-karbo',
    badge: 'bg-karbo/15 text-karbo',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  {
    kunci: 'protein',
    label: 'Protein',
    singkat: 'P',
    ikon: Beef,
    warna: 'var(--protein)',
    teks: 'text-protein',
    titik: 'bg-protein',
    badge: 'bg-protein/15 text-protein',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
  {
    kunci: 'lemak',
    label: 'Lemak',
    singkat: 'L',
    ikon: Droplets,
    warna: 'var(--lemak)',
    teks: 'text-lemak',
    titik: 'bg-lemak',
    badge: 'bg-lemak/15 text-lemak',
    glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
  },
]

export const formatAngka = (nilai) => Math.round(nilai).toLocaleString('id-ID')
