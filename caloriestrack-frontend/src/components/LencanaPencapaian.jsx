import { Lock } from 'lucide-react'
import { KARTU, LABEL } from './tema.js'

/**
 * Lencana 3D. Tiap item: { id, nama, deskripsi, ikon, tercapai, warna, glow }.
 * `warna` = kelas gradien Tailwind utuh, `glow` = warna CSS bayangan di bawah medali.
 */
export default function LencanaPencapaian({ daftar, className = '' }) {
  const jumlahTercapai = daftar.filter((l) => l.tercapai).length

  return (
    <section className={`${KARTU} p-6 ${className}`} aria-labelledby="judul-lencana">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="judul-lencana" className={LABEL}>
          Pencapaian hari ini
        </h2>
        <p className="tabular-nums">
          <span className="text-2xl font-bold text-fg">{jumlahTercapai}</span>
          <span className="text-sm text-muted"> / {daftar.length} lencana</span>
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-6">
        {daftar.map(({ id, nama, deskripsi, ikon: Ikon, tercapai, warna, glow }) => (
          <li key={id} className="group flex flex-col items-center text-center [perspective:600px]">
            <div
              style={tercapai ? { '--glow': glow } : undefined}
              className={`relative grid h-16 w-16 place-items-center rounded-full transition-transform duration-500 ease-out [transform:rotateX(20deg)] group-hover:[transform:rotateX(0deg)_rotateY(-16deg)_translateY(-4px)] ${
                tercapai
                  ? `bg-linear-to-br ${warna} shadow-[inset_0_2px_1px_rgba(255,255,255,0.45),inset_0_-6px_10px_rgba(0,0,0,0.3),0_12px_28px_-8px_var(--glow)]`
                  : 'bg-fg/5 ring-1 ring-inset ring-fg/10'
              }`}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-full ${
                  tercapai ? 'bg-black/15 ring-1 ring-white/30' : ''
                }`}
              >
                <Ikon
                  size={22}
                  aria-hidden="true"
                  className={tercapai ? 'text-white drop-shadow' : 'text-muted'}
                />
              </span>
              {!tercapai && (
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-surface text-muted ring-2 ring-canvas">
                  <Lock size={12} aria-hidden="true" />
                </span>
              )}
            </div>
            <p className={`mt-3 text-sm font-medium ${tercapai ? 'text-fg' : 'text-muted'}`}>
              {nama}
              <span className="sr-only">{tercapai ? ' (tercapai)' : ' (terkunci)'}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">{deskripsi}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
