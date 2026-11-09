import { Camera, Moon, Settings2, Sun, User } from 'lucide-react'
import { TOMBOL_IKON, formatAngka } from './tema.js'

const INFO_HALAMAN = {
  dashboard: {
    judul: 'Dashboard',
    subjudul: 'Ringkasan nutrisi harian, analisis makro, dan konsistensi dietmu',
  },
  log: {
    judul: 'Log Makanan',
    subjudul: 'Catat makanan yang kamu konsumsi dan pantau riwayat hari ini',
  },
  aktivitas: {
    judul: 'Aktivitas & Olahraga',
    subjudul: 'Pantau pembakaran kalori dari latihan fisik dan aktivitas aktif harian',
  },
  rekomendasi: {
    judul: 'Rekomendasi Menu',
    subjudul: 'Ide makanan sehat yang disesuaikan dengan sisa target kalori & makromu',
  },
  kalkulator: {
    judul: 'Kalkulator BMR & TDEE',
    subjudul: 'Hitung kebutuhan kalori harian dan tentukan strategi diet ilmiah',
  },
}

export default function Header({
  activePage,
  hariIni,
  isLight,
  onToggleTheme,
  targetKalori,
  onBukaTarget,
  profil,
}) {
  const info = INFO_HALAMAN[activePage] ?? INFO_HALAMAN.dashboard
  const tanggalLengkap = hariIni.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 bg-linear-to-r from-emerald-950/35 to-amber-950/25 px-6 py-4 backdrop-blur-2xl in-[.light]:border-emerald-700/15 in-[.light]:from-emerald-100/95 in-[.light]:to-amber-100/90 lg:px-8">
      {/* Pendar ambient 2 warna lembut */}
      <div
        className="pointer-events-none absolute -top-12 left-1/4 h-32 w-64 rounded-full bg-emerald-500/12 blur-3xl in-[.light]:bg-emerald-300/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-12 right-1/4 h-32 w-64 rounded-full bg-amber-500/12 blur-3xl in-[.light]:bg-amber-300/30"
        aria-hidden="true"
      />

      {/* Info Judul & Tanggal */}
      <div className="relative z-10 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-fg in-[.light]:text-slate-900">{info.judul}</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 in-[.light]:border-emerald-700/25 in-[.light]:bg-emerald-600/12 in-[.light]:text-emerald-900">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 in-[.light]:bg-emerald-700 animate-pulse" />
            {tanggalLengkap}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs font-medium text-fg-soft/80 in-[.light]:text-slate-700">{info.subjudul}</p>
      </div>

      {/* Kontrol Kanan: Target, Mode Tema, dan Ikon/Foto Profil Melingkar */}
      <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
        {/* Tombol Cepat Target & Settings */}
        <button
          type="button"
          onClick={onBukaTarget}
          aria-haspopup="dialog"
          title="Pengaturan & Target Nutrisi"
          className="group flex items-center gap-2.5 rounded-xl border border-line bg-fg/[0.04] px-3.5 py-2 text-left text-xs transition-all duration-200 hover:border-emerald-500/30 hover:bg-fg/[0.08] in-[.light]:border-slate-900/12 in-[.light]:bg-white/60 in-[.light]:hover:bg-white/85"
        >
          <div className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500/15 text-emerald-400 in-[.light]:bg-emerald-600/15 in-[.light]:text-emerald-800">
            <Settings2 size={14} aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <span className="block font-semibold text-fg in-[.light]:text-slate-900">Target Harian</span>
            <span className="block font-medium tabular-nums text-fg-soft in-[.light]:text-slate-600">
              {formatAngka(targetKalori)} kcal
            </span>
          </div>
        </button>

        {/* Toggle Mode Terang / Gelap */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isLight ? 'Beralih ke mode gelap' : 'Beralih ke mode terang'}
          title={isLight ? 'Beralih ke Dark Mode' : 'Beralih ke Light Mode'}
          className={`${TOMBOL_IKON} rounded-full border border-line bg-fg/[0.04] hover:border-amber-500/30 hover:bg-amber-500/10 in-[.light]:border-slate-900/12 in-[.light]:bg-white/60 in-[.light]:text-slate-800 in-[.light]:hover:bg-white/85`}
        >
          {isLight ? (
            <Moon size={18} className="text-slate-800 transition-transform active:rotate-12" aria-hidden="true" />
          ) : (
            <Sun size={18} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" aria-hidden="true" />
          )}
        </button>

        {/* Tombol Ikon / Foto Profil Melingkar (Bukan Kotakan) */}
        <button
          type="button"
          onClick={onBukaTarget}
          aria-label={`Profil ${profil.nama} (${profil.beratSaatIni} kg)`}
          title={`${profil.nama} • ${profil.beratSaatIni} kg → ${profil.beratTarget} kg (Klik untuk ubah foto & profil)`}
          className="group relative grid h-10 w-10 shrink-0 place-items-center rounded-full ring-2 ring-emerald-400/50 transition-transform duration-200 hover:scale-105 hover:ring-amber-400 active:scale-95 in-[.light]:ring-emerald-700/40"
        >
          {profil.foto ? (
            <img
              src={profil.foto}
              alt={profil.nama}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center rounded-full bg-fg/10 text-fg in-[.light]:bg-white/75 in-[.light]:text-slate-800">
              <User size={20} aria-hidden="true" />
            </span>
          )}
          <span
            className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-400 text-slate-950 ring-2 ring-canvas transition-colors group-hover:bg-amber-400 in-[.light]:bg-emerald-600 in-[.light]:text-white"
            aria-hidden="true"
          >
            <Camera size={9} />
          </span>
        </button>
      </div>
    </header>
  )
}
