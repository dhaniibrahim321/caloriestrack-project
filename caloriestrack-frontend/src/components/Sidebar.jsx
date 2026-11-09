import { Activity, Calculator, ClipboardList, Flame, LayoutDashboard, Settings2, Sparkles } from 'lucide-react'
import { formatAngka } from './tema.js'

const MENU = [
  { id: 'dashboard', label: 'Dashboard', ikon: LayoutDashboard },
  { id: 'log', label: 'Log Makanan', ikon: ClipboardList },
  { id: 'aktivitas', label: 'Aktivitas & Olahraga', ikon: Activity },
  { id: 'rekomendasi', label: 'Rekomendasi Menu', ikon: Sparkles },
  { id: 'kalkulator', label: 'Kalkulator & Target', ikon: Calculator },
]

export default function Sidebar({ activePage, onNavigate, targetKalori, onBukaTarget }) {
  return (
    <aside className="relative flex w-20 shrink-0 flex-col overflow-hidden border-r border-emerald-500/20 bg-linear-to-b from-emerald-950/35 to-amber-950/25 backdrop-blur-2xl in-[.light]:border-emerald-700/15 in-[.light]:from-emerald-100/95 in-[.light]:to-amber-100/90 lg:w-64">
      {/* Pendar Ambient Hijau dan Kuning/Oranye */}
      <div
        className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/12 blur-2xl in-[.light]:bg-emerald-300/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-500/12 blur-2xl in-[.light]:bg-amber-300/25"
        aria-hidden="true"
      />

      {/* Header Logo: Logo lebih besar di atas, nama sistem di bawahnya */}
      <div className="relative z-10 flex flex-col items-center border-b border-emerald-500/15 px-4 pb-5 pt-6 text-center in-[.light]:border-emerald-800/12 lg:px-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-amber-400 text-slate-950 shadow-[0_8px_24px_rgba(52,211,153,0.3)] in-[.light]:shadow-[0_6px_18px_rgba(16,185,129,0.25)] lg:h-16 lg:w-16">
          <Flame size={32} className="text-slate-950" aria-hidden="true" />
        </div>
        <div className="mt-3 hidden lg:block">
          <p className="text-xl font-extrabold leading-tight tracking-tight text-fg in-[.light]:text-slate-900">
            CaloriesTrack
          </p>
          <p className="mt-0.5 text-xs font-medium text-fg-soft/80 in-[.light]:text-slate-600">
            Nutrisi & Aktivitas
          </p>
        </div>
      </div>

      {/* Navigasi Utama - Tanpa Gradasi di Tombol */}
      <nav className="relative z-10 mt-4 flex-1 space-y-1.5 px-3 lg:px-4" aria-label="Navigasi utama">
        {MENU.map(({ id, label, ikon: Ikon }) => {
          const aktif = activePage === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={aktif ? 'page' : undefined}
              title={label}
              className={`group relative flex w-full items-center justify-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors lg:justify-start lg:px-4 ${
                aktif
                  ? 'bg-fg/12 text-fg font-semibold in-[.light]:bg-white/75 in-[.light]:text-slate-900 in-[.light]:shadow-xs'
                  : 'text-fg-soft/80 hover:bg-fg/[0.06] hover:text-fg in-[.light]:text-slate-700 in-[.light]:hover:bg-white/45 in-[.light]:hover:text-slate-900'
              }`}
            >
              <Ikon
                size={20}
                aria-hidden="true"
                className={`transition-colors ${
                  aktif
                    ? 'text-brand in-[.light]:text-emerald-700'
                    : 'text-muted group-hover:text-fg in-[.light]:text-slate-600 in-[.light]:group-hover:text-slate-900'
                }`}
              />
              <span className="hidden lg:inline">{label}</span>
              {aktif && (
                <span className="absolute left-1 hidden h-5 w-1 rounded-full bg-brand in-[.light]:bg-emerald-700 lg:block" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bagian Bawah: Target & Settings - Tanpa Gradasi */}
      <div className="relative z-10 border-t border-emerald-500/15 p-3 in-[.light]:border-emerald-800/12 lg:p-4">
        <button
          type="button"
          onClick={onBukaTarget}
          aria-haspopup="dialog"
          title="Target Nutrisi & Settings"
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-fg/[0.04] px-3.5 py-3 text-left text-muted transition-colors hover:bg-fg/[0.08] hover:text-fg in-[.light]:border-slate-900/12 in-[.light]:bg-white/65 in-[.light]:text-slate-800 in-[.light]:hover:bg-white/85 lg:justify-start lg:px-4"
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-fg/10 text-brand in-[.light]:bg-emerald-600/15 in-[.light]:text-emerald-800">
            <Settings2 size={18} aria-hidden="true" />
          </div>
          <span className="hidden lg:block">
            <span className="block text-xs font-semibold text-fg in-[.light]:text-slate-900">
              Target & Preferensi
            </span>
            <span className="block text-[11px] font-medium tabular-nums text-fg-soft/80 in-[.light]:text-slate-600">
              {formatAngka(targetKalori)} kcal / hari
            </span>
          </span>
        </button>
      </div>
    </aside>
  )
}
