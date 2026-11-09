import { statusKalori } from '../application/logic.js'
import { KARTU, LABEL, formatAngka } from './tema.js'

const JUMLAH_MINGGU = 15

const WARNA_STATUS = {
  kosong: 'bg-fg/10',
  rendah: 'bg-emerald-500/25',
  sedang: 'bg-emerald-500/50',
  tercapai: 'bg-emerald-500',
  lebih: 'bg-rose-500/75',
}

const LEGENDA = [
  ['kosong', 'Kosong'],
  ['rendah', '<50%'],
  ['sedang', '<80%'],
  ['tercapai', 'Tercapai'],
  ['lebih', '>110%'],
]

const formatTanggal = (tanggal) =>
  tanggal.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })

/** Kalender heatmap: kolom = minggu, baris = Senin..Minggu. `riwayatKalori` urut terlama -> hari ini. */
export default function KalenderHeatmap({ riwayatKalori, hariIni, targetKalori, streak, className = '' }) {
  const indeksHariIni = (hariIni.getDay() + 6) % 7 // Senin = 0
  const data = riwayatKalori.slice(-((JUMLAH_MINGGU - 1) * 7 + indeksHariIni + 1))

  const sel = data.map((kalori, i) => {
    const tanggal = new Date(hariIni)
    tanggal.setDate(hariIni.getDate() - (data.length - 1 - i))
    return { tanggal, kalori, status: statusKalori(kalori, targetKalori) }
  })
  const jumlahTercapai = sel.filter((s) => s.status === 'tercapai').length

  return (
    <section
      className={`${KARTU} flex flex-col p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] ${className}`}
      aria-labelledby="judul-heatmap"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="judul-heatmap" className={LABEL}>
            Riwayat konsistensi
          </h2>
          <p className="mt-1 text-xs tabular-nums text-muted">
            {jumlahTercapai} dari {sel.length} hari tepat target
          </p>
        </div>
        <p className="text-right">
          <span className="block text-4xl font-bold tracking-tight tabular-nums text-fg">{streak}</span>
          <span className={LABEL}>hari beruntun</span>
        </p>
      </div>

      <div
        role="img"
        aria-label={`Kalender ${sel.length} hari terakhir: target tercapai ${jumlahTercapai} hari, streak ${streak} hari`}
        className="mt-5 grid grid-flow-col grid-rows-7 gap-1"
        style={{ gridTemplateColumns: `repeat(${JUMLAH_MINGGU}, minmax(0, 1fr))` }}
      >
        {sel.map(({ tanggal, kalori, status }, i) => (
          <span
            key={i}
            title={`${formatTanggal(tanggal)}: ${formatAngka(kalori)} kcal`}
            className={`aspect-square rounded-[3px] ${WARNA_STATUS[status]} ${
              i === sel.length - 1 ? 'ring-1 ring-fg/70' : ''
            }`}
          />
        ))}
      </div>

      <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs text-muted">
        {LEGENDA.map(([status, label]) => (
          <li key={status} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-[2px] ${WARNA_STATUS[status]}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}
