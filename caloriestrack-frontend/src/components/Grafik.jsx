import { useId } from 'react'

/** Kurva halus melalui titik-titik [x, y] (kontrol kubik di titik tengah horizontal). */
function jalurHalus(titik) {
  if (titik.length === 0) return ''
  let d = `M${titik[0][0]},${titik[0][1]}`
  for (let i = 1; i < titik.length; i++) {
    const [x0, y0] = titik[i - 1]
    const [x1, y1] = titik[i]
    const cx = (x0 + x1) / 2
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`
  }
  return d
}

// Warna dikirim lewat `style` karena atribut presentasi SVG tidak mendukung var() CSS.

/** Grafik garis mini dengan area gradien. Opsional garis target putus-putus. */
export function Sparkline({ nilai, warna, garisTarget, className = '' }) {
  const id = `spark${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const L = 100
  const T = 40
  const PAD = 4
  const maks = Math.max(...nilai, garisTarget ?? 0, 1)
  const keY = (v) => T - PAD - (Math.min(v, maks) / maks) * (T - PAD * 2)
  const langkah = nilai.length > 1 ? L / (nilai.length - 1) : 0
  const garis = jalurHalus(nilai.map((v, i) => [i * langkah, keY(v)]))

  return (
    <svg viewBox={`0 0 ${L} ${T}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: warna, stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: warna, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={`${garis} L${L},${T} L0,${T} Z`} fill={`url(#${id})`} />
      {garisTarget != null && (
        <line
          x1="0"
          x2={L}
          y1={keY(garisTarget)}
          y2={keY(garisTarget)}
          className="stroke-fg/25"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
      <path
        d={garis}
        fill="none"
        style={{ stroke: warna }}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Cincin progres melingkar. Isi tengah lewat children. */
export function Cincin({ persen, warna, ukuran = 64, tebal = 6, label, children }) {
  const r = (ukuran - tebal) / 2
  const keliling = 2 * Math.PI * r
  const tengah = ukuran / 2

  return (
    <div className="relative shrink-0" style={{ width: ukuran, height: ukuran }} role="img" aria-label={label}>
      <svg width={ukuran} height={ukuran} className="-rotate-90" aria-hidden="true">
        <circle cx={tengah} cy={tengah} r={r} fill="none" className="stroke-fg/10" strokeWidth={tebal} />
        {persen > 0 && (
          <circle
            cx={tengah}
            cy={tengah}
            r={r}
            fill="none"
            style={{ stroke: warna }}
            strokeWidth={tebal}
            strokeLinecap="round"
            strokeDasharray={keliling}
            strokeDashoffset={keliling * (1 - Math.min(persen, 100) / 100)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        )}
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}

/** Donat bersegmen; tiap segmen { nilai (persen), warna }. */
export function CincinSegmen({ segmen, ukuran = 112, tebal = 12, label, children }) {
  const r = (ukuran - tebal) / 2
  const keliling = 2 * Math.PI * r
  const tengah = ukuran / 2
  const CELAH = segmen.filter((s) => s.nilai > 0).length > 1 ? 3 : 0
  // Offset awal tiap segmen = jumlah panjang segmen sebelumnya
  const busur = segmen.map(({ nilai, warna }, i) => ({
    warna,
    panjang: (nilai / 100) * keliling,
    offset: segmen.slice(0, i).reduce((t, s) => t + (s.nilai / 100) * keliling, 0),
  }))

  return (
    <div className="relative shrink-0" style={{ width: ukuran, height: ukuran }} role="img" aria-label={label}>
      <svg width={ukuran} height={ukuran} className="-rotate-90" aria-hidden="true">
        <circle cx={tengah} cy={tengah} r={r} fill="none" className="stroke-fg/10" strokeWidth={tebal} />
        {busur.map(({ warna, panjang, offset }, i) =>
          panjang > 0 ? (
            <circle
              key={i}
              cx={tengah}
              cy={tengah}
              r={r}
              fill="none"
              style={{ stroke: warna }}
              strokeWidth={tebal}
              strokeDasharray={`${Math.max(panjang - CELAH, 0)} ${keliling}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700 ease-out"
            />
          ) : null,
        )}
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}
