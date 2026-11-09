import { MAKRO } from './tema.js'

/** Baris riwayat makanan dengan badge gizi berwarna. Dipakai di Dashboard dan Log Makanan. */
export default function KartuMakanan({ makanan }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-xl bg-fg/[0.03] p-3 transition-colors hover:bg-fg/[0.06]">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-fg">{makanan.nama}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MAKRO.map(({ kunci, label, singkat, badge }) => (
            <span key={kunci} className={`rounded-full px-3 py-1 text-xs font-medium tabular-nums ${badge}`}>
              <span aria-hidden="true">{singkat}</span>
              <span className="sr-only">{label}</span> {makanan[kunci]}g
            </span>
          ))}
        </div>
      </div>
      <p className="shrink-0 text-right">
        <span className="block text-xl font-bold tabular-nums text-fg">{makanan.kalori}</span>
        <span className="block text-[10px] uppercase tracking-wider text-muted">kcal</span>
      </p>
    </li>
  )
}
