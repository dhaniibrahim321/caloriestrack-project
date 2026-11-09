import { ArrowRight, Beef, ClipboardList, Flame, GlassWater, Plus, Scale, Target, UtensilsCrossed } from 'lucide-react'
import { RIWAYAT_CONTOH } from '../infrastructure/seedData.js'
import {
  apakahRasioSeimbang,
  hitungPersen,
  hitungRasioMakro,
  hitungStreak,
  hitungTotalKalori,
  hitungTotalMakro,
  statusKalori,
} from '../application/logic.js'
import { Cincin, CincinSegmen, Sparkline } from '../components/Grafik.jsx'
import JurnalAir from '../components/JurnalAir.jsx'
import KalenderHeatmap from '../components/KalenderHeatmap.jsx'
import KartuMakanan from '../components/KartuMakanan.jsx'
import LencanaPencapaian from '../components/LencanaPencapaian.jsx'
import { KARTU, LABEL, MAKRO, TOMBOL_UTAMA, formatAngka } from '../components/tema.js'

function KartuMakro({ makro, nilai, target, tren }) {
  const persen = hitungPersen(nilai, target)
  const sisa = target - nilai
  const Ikon = makro.ikon

  return (
    <section className={`${KARTU} ${makro.glow} relative overflow-hidden p-5`}>
      <Sparkline
        nilai={tren}
        warna={makro.warna}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-70"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={`${LABEL} flex items-center gap-1.5`}>
            <Ikon size={14} className={makro.teks} aria-hidden="true" />
            {makro.label}
          </h2>
          <p className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight tabular-nums text-fg">{formatAngka(nilai)}</span>
            <span className="text-sm text-muted">/ {formatAngka(target)} g</span>
          </p>
        </div>
        <Cincin persen={persen} warna={makro.warna} ukuran={56} tebal={5} label={`${makro.label} ${Math.round(persen)} persen dari target`}>
          <span className="text-xs font-semibold tabular-nums text-fg">{Math.round(persen)}%</span>
        </Cincin>
      </div>
      <p className="relative mt-10 text-xs tabular-nums text-fg-soft">
        {sisa > 0 ? `${formatAngka(sisa)} g lagi menuju target` : 'Target tercapai'}
      </p>
    </section>
  )
}

export default function DashboardPage({
  daftarMakanan,
  target,
  profil,
  hariIni,
  gelasAir,
  onUbahAir,
  onNavigate,
  totalKaloriTerbakar = 0,
}) {
  const totalKalori = hitungTotalKalori(daftarMakanan)
  const kompensasiAktif = profil?.kompensasiOlahraga ?? true
  const kaloriEfektif = kompensasiAktif ? Math.max(totalKalori - totalKaloriTerbakar, 0) : totalKalori
  const totalMakro = hitungTotalMakro(daftarMakanan)
  const persenKalori = hitungPersen(kaloriEfektif, target.kalori)
  const sisaKalori = target.kalori - kaloriEfektif
  const rasio = hitungRasioMakro(totalMakro)
  const energiMakro = totalMakro.karbo * 4 + totalMakro.protein * 4 + totalMakro.lemak * 9

  const tujuhHari = [...RIWAYAT_CONTOH.slice(-6), { kalori: totalKalori, ...totalMakro }]
  const rataRataKalori = tujuhHari.reduce((t, h) => t + h.kalori, 0) / tujuhHari.length
  const labelHari = tujuhHari.map((_, i) => {
    const tanggal = new Date(hariIni)
    tanggal.setDate(hariIni.getDate() - (6 - i))
    return i === 6 ? 'Hari ini' : tanggal.toLocaleDateString('id-ID', { weekday: 'short' })
  })

  const riwayatKalori = [...RIWAYAT_CONTOH.map((h) => h.kalori), totalKalori]
  const streak = hitungStreak(riwayatKalori, target.kalori)

  const lencana = [
    {
      id: 'target',
      nama: 'Tepat Sasaran',
      deskripsi: 'Kalori 80–110% target',
      ikon: Target,
      tercapai: statusKalori(totalKalori, target.kalori) === 'tercapai',
      warna: 'from-emerald-300 to-emerald-600',
      glow: 'rgba(16,185,129,0.6)',
    },
    {
      id: 'protein',
      nama: 'Pejuang Protein',
      deskripsi: 'Target protein terpenuhi',
      ikon: Beef,
      tercapai: totalMakro.protein >= target.protein,
      warna: 'from-amber-200 to-amber-500',
      glow: 'rgba(245,158,11,0.6)',
    },
    {
      id: 'air',
      nama: 'Hidrasi Penuh',
      deskripsi: `Minum ${target.targetGelas || 8} gelas air`,
      ikon: GlassWater,
      tercapai: gelasAir >= (target.targetGelas || 8),
      warna: 'from-sky-300 to-sky-600',
      glow: 'rgba(14,165,233,0.6)',
    },
    {
      id: 'streak',
      nama: 'Api Konsisten',
      deskripsi: 'Streak 7 hari',
      ikon: Flame,
      tercapai: streak >= 7,
      warna: 'from-orange-300 to-rose-500',
      glow: 'rgba(244,63,94,0.6)',
    },
    {
      id: 'seimbang',
      nama: 'Piring Seimbang',
      deskripsi: 'Rasio makro ideal',
      ikon: Scale,
      tercapai: daftarMakanan.length > 0 && apakahRasioSeimbang(rasio),
      warna: 'from-violet-300 to-violet-600',
      glow: 'rgba(139,92,246,0.6)',
    },
    {
      id: 'rajin',
      nama: 'Pencatat Rajin',
      deskripsi: '4+ catatan sehari',
      ikon: ClipboardList,
      tercapai: daftarMakanan.length >= 4,
      warna: 'from-teal-200 to-teal-600',
      glow: 'rgba(20,184,166,0.6)',
    },
  ]

  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-12">
        {/* Progres kalori + tren 7 hari */}
        <section
          className={`${KARTU} p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] md:col-span-4 lg:col-span-8`}
          aria-labelledby="judul-kalori"
        >
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center">
            <div className="flex items-center gap-6">
              <Cincin
                persen={persenKalori}
                warna="var(--brand)"
                ukuran={132}
                tebal={10}
                label={`${Math.round(persenKalori)} persen dari target kalori`}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold tabular-nums text-fg">{Math.round(persenKalori)}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">target</p>
                </div>
              </Cincin>
              <div>
                <h2 id="judul-kalori" className={LABEL}>
                  Kalori hari ini
                </h2>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-6xl font-bold tracking-tight tabular-nums text-fg">
                    {formatAngka(totalKalori)}
                  </span>
                  <span className="text-sm tabular-nums text-muted">/ {formatAngka(target.kalori)} kcal</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium tabular-nums ${
                      sisaKalori >= 0 ? 'bg-brand/15 text-brand' : 'bg-bahaya/15 text-bahaya'
                    }`}
                  >
                    {sisaKalori >= 0
                      ? `Sisa ${formatAngka(sisaKalori)} kcal`
                      : `Lebih ${formatAngka(-sisaKalori)} kcal`}
                  </span>
                  {totalKaloriTerbakar > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-bahaya/15 px-3 py-1 text-xs font-medium tabular-nums text-bahaya">
                      <Flame size={12} aria-hidden="true" />
                      Terbakar {formatAngka(totalKaloriTerbakar)} kcal
                      {kompensasiAktif ? ` (Netto: ${formatAngka(kaloriEfektif)})` : ''}
                    </span>
                  )}
                  {target.bmr && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-fg/[0.06] px-3 py-1 text-xs tabular-nums text-muted">
                      BMR {formatAngka(target.bmr)} • TDEE {formatAngka(target.tdee)} kcal
                      {target.imt ? ` • IMT ${target.imt.nilai}` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className={LABEL}>Tren 7 hari</h3>
                <span className="text-xs tabular-nums text-muted">
                  rata-rata {formatAngka(rataRataKalori)} kcal
                </span>
              </div>
              <Sparkline
                nilai={tujuhHari.map((h) => h.kalori)}
                warna="var(--brand)"
                garisTarget={target.kalori}
                className="mt-3 h-28 w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                {labelHari.map((label, i) => (
                  <span key={i} className={i === 6 ? 'font-medium text-fg' : undefined}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Makanan terakhir: kartu vertikal tinggi */}
        <section
          className={`${KARTU} flex flex-col p-6 md:col-span-4 lg:col-span-4 lg:row-span-2`}
          aria-labelledby="judul-terakhir"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="judul-terakhir" className={LABEL}>
                Makanan terakhir
              </h2>
              <span className="mt-0.5 block text-xs tabular-nums text-muted">{daftarMakanan.length} catatan</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('log')}
              className={`${TOMBOL_UTAMA} px-3 py-2 text-xs`}
            >
              <Plus size={15} aria-hidden="true" />
              Catat
            </button>
          </div>

          {daftarMakanan.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <UtensilsCrossed size={26} aria-hidden="true" />
              </div>
              <p className="mt-4 font-medium text-fg">Belum ada catatan hari ini</p>
              <p className="mt-1 text-sm text-muted">Catat makanan pertamamu untuk mulai melacak.</p>
            </div>
          ) : (
            <ul className="mt-4 flex-1 space-y-2 overflow-y-auto lg:h-0">
              {daftarMakanan.map((makanan) => (
                <KartuMakanan key={makanan.id} makanan={makanan} />
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => onNavigate('log')}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
          >
            Buka log makanan
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </section>

        {/* Makronutrisi: angka + cincin + sparkline latar */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:col-span-4 lg:col-span-8">
          {MAKRO.map((makro) => (
            <KartuMakro
              key={makro.kunci}
              makro={makro}
              nilai={totalMakro[makro.kunci]}
              target={target[makro.kunci]}
              tren={tujuhHari.map((h) => h[makro.kunci])}
            />
          ))}
        </div>

        {/* Rasio energi makro */}
        <section className={`${KARTU} flex flex-col p-6 md:col-span-2 lg:col-span-4`} aria-labelledby="judul-rasio">
          <h2 id="judul-rasio" className={LABEL}>
            Rasio energi makro
          </h2>
          <div className="mt-5 flex flex-1 items-center gap-6">
            <CincinSegmen
              segmen={MAKRO.map((m) => ({ nilai: rasio[m.kunci], warna: m.warna }))}
              label={MAKRO.map((m) => `${m.label} ${Math.round(rasio[m.kunci])} persen`).join(', ')}
            >
              <div className="text-center">
                <p className="text-xl font-bold tabular-nums text-fg">{formatAngka(energiMakro)}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted">kcal</p>
              </div>
            </CincinSegmen>
            <ul className="min-w-0 flex-1 space-y-3">
              {MAKRO.map(({ kunci, label, titik }) => (
                <li key={kunci} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-fg-soft">
                    <span className={`h-2 w-2 rounded-full ${titik}`} aria-hidden="true" />
                    {label}
                  </span>
                  <span className="font-semibold tabular-nums text-fg">{Math.round(rasio[kunci])}%</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 text-xs text-muted">
            {apakahRasioSeimbang(rasio) ? 'Seimbang menurut rentang AMDR.' : 'Belum masuk rentang AMDR.'} Karbo &
            protein 4 kkal/g, lemak 9 kkal/g.
          </p>
        </section>

        <KalenderHeatmap
          riwayatKalori={riwayatKalori}
          hariIni={hariIni}
          targetKalori={target.kalori}
          streak={streak}
          className="md:col-span-2 lg:col-span-5"
        />

        <JurnalAir
          gelas={gelasAir}
          onUbah={onUbahAir}
          targetGelas={target.targetGelas || 8}
          targetMl={target.airMl}
          className="md:col-span-2 lg:col-span-3 lg:row-span-2"
        />

        <LencanaPencapaian daftar={lencana} className="md:col-span-2 lg:col-span-9" />
      </div>
    </div>
  )
}
