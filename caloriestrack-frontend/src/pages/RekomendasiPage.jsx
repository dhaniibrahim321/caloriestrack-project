import { useState } from 'react'
import {
  ArrowUpDown,
  Beef,
  Check,
  Clock,
  Flame,
  Leaf,
  Plus,
  Search,
  Sparkles,
  UtensilsCrossed,
  Wallet,
  Zap,
} from 'lucide-react'
import { hitungPersen, hitungTotalKalori, hitungTotalMakro } from '../application/logic.js'
import {
  DAFTAR_MENU_REKOMENDASI,
  KATEGORI_FILTER_MENU,
  filterDanUrutkanMenu,
} from '../application/rekomendasiMakanan.js'
import { Cincin } from '../components/Grafik.jsx'
import { INPUT, KARTU, LABEL, MAKRO, TOMBOL_UTAMA, formatAngka } from '../components/tema.js'

const IKON_KATEGORI = {
  semua: Sparkles,
  terjangkau: Wallet,
  'high-protein': Beef,
  'high-kalori': Zap,
  'low-kalori': Leaf,
  'muat-sisa': Flame,
}

function GambarMenu({ menu }) {
  const [gagalMuat, setGagalMuat] = useState(false)

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-fg/5">
      {!gagalMuat && menu.gambar ? (
        <img
          src={menu.gambar}
          alt={menu.nama}
          loading="lazy"
          onError={() => setGagalMuat(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-center bg-linear-to-br ${menu.warnaFallback || 'from-emerald-600/35 to-amber-600/35'} p-4 text-center`}
        >
          <UtensilsCrossed size={36} className="text-white/85 drop-shadow" aria-hidden="true" />
          <span className="mt-2 text-xs font-semibold text-white/90">{menu.tagUtama}</span>
        </div>
      )}

      {/* Vignette gelap halus di atas dan bawah agar badge di atas foto selalu kontras */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/35"
        aria-hidden="true"
      />

      {/* Baris Atas: Tag Utama */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          <Sparkles size={11} className="text-amber-300" aria-hidden="true" />
          {menu.tagUtama}
        </span>
      </div>

      {/* Baris Bawah: Waktu Makan & Kalori */}
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
          <Clock size={11} className="text-amber-300" aria-hidden="true" />
          {menu.waktuMakan}
        </span>
        <div className="rounded-xl border border-white/15 bg-black/65 px-3 py-1 text-right backdrop-blur-md">
          <span className="text-lg font-extrabold leading-none tabular-nums text-white">
            {menu.kalori}
          </span>
          <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            kcal
          </span>
        </div>
      </div>
    </div>
  )
}

export default function RekomendasiPage({ daftarMakanan, target, onAddFood }) {
  const [kategoriAktif, setKategoriAktif] = useState('semua')
  const [kataKunci, setKataKunci] = useState('')
  const [urutkan, setUrutkan] = useState('rekomendasi')
  const [dicatat, setDicatat] = useState([])

  const totalKalori = hitungTotalKalori(daftarMakanan)
  const totalMakro = hitungTotalMakro(daftarMakanan)
  const sisaKalori = Math.max(target.kalori - totalKalori, 0)
  const sisaProtein = Math.max(target.protein - totalMakro.protein, 0)

  const menuTersaring = filterDanUrutkanMenu({
    daftarMenu: DAFTAR_MENU_REKOMENDASI,
    kategoriAktif,
    kataKunci,
    urutkan,
    sisaKalori,
    sisaProtein,
  })

  const jumlahMuat = DAFTAR_MENU_REKOMENDASI.filter((m) => m.kalori <= sisaKalori).length
  const jumlahTerjangkau = DAFTAR_MENU_REKOMENDASI.filter((m) =>
    m.kategori.includes('terjangkau'),
  ).length

  const hitungJumlahPerKategori = (idKategori) => {
    if (idKategori === 'semua') return DAFTAR_MENU_REKOMENDASI.length
    if (idKategori === 'muat-sisa') return jumlahMuat
    return DAFTAR_MENU_REKOMENDASI.filter((m) => m.kategori.includes(idKategori)).length
  }

  const catat = (menu) => {
    onAddFood({
      namaMakanan: menu.nama,
      kalori: menu.kalori,
      protein: menu.protein,
      karbo: menu.karbo,
      lemak: menu.lemak,
    })
    setDicatat((d) => [...d, menu.id])
  }

  return (
    <div className="flex min-h-full flex-col gap-6">
      {/* Banner Ringkasan Sisa Kuota & Makro */}
      <section
        className={`${KARTU} p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]`}
        aria-labelledby="judul-sisa"
      >
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="judul-sisa" className={LABEL}>
              Sisa Kuota Nutrisi Hari Ini
            </h2>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold tracking-tight tabular-nums text-fg">
                  {formatAngka(sisaKalori)}
                </span>
                <span className="text-sm font-medium text-muted">kcal tersisa</span>
              </p>
              <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold tabular-nums text-brand">
                {jumlahMuat} dari {DAFTAR_MENU_REKOMENDASI.length} menu muat
              </span>
            </div>
            <p className="mt-2 text-xs text-fg-soft">
              Tersedia <strong className="font-semibold text-fg">{jumlahTerjangkau} opsi menu terjangkau</strong> yang mudah ditemui sehari-hari, menu <em>high protein</em> untuk otot, serta menu padat kalori untuk <em>bulking</em>.
            </p>
          </div>

          {/* Cincin Sisa Makronutrisi */}
          <ul className="grid grid-cols-3 gap-3 border-t border-line pt-4 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {MAKRO.map(({ kunci, label, warna }) => {
              const sisa = Math.max(target[kunci] - totalMakro[kunci], 0)
              return (
                <li key={kunci} className="flex flex-col items-center text-center">
                  <Cincin
                    persen={hitungPersen(totalMakro[kunci], target[kunci])}
                    warna={warna}
                    ukuran={60}
                    tebal={6}
                    label={`Sisa ${label} ${formatAngka(sisa)} gram`}
                  >
                    <span className="text-xs font-bold tabular-nums text-fg">{formatAngka(sisa)}g</span>
                  </Cincin>
                  <span className="mt-1.5 text-xs font-medium text-fg-soft">Sisa {label}</span>
                </li>
              )
            })}
          </ul>

          {/* Pencarian & Urutan */}
          <div className="flex flex-col gap-3 lg:col-span-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
                placeholder="Cari ayam, tempe, telur, oat..."
                aria-label="Cari menu rekomendasi"
                className={`${INPUT} pl-10 text-xs`}
              />
            </div>

            <div className="relative">
              <ArrowUpDown
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <select
                value={urutkan}
                onChange={(e) => setUrutkan(e.target.value)}
                aria-label="Urutkan menu rekomendasi"
                className={`${INPUT} cursor-pointer pl-10 text-xs`}
              >
                <option value="rekomendasi" className="bg-canvas text-fg">
                  Urutkan: Paling Cocok
                </option>
                <option value="protein-tertinggi" className="bg-canvas text-fg">
                  Urutkan: Protein Tertinggi
                </option>
                <option value="kalori-tertinggi" className="bg-canvas text-fg">
                  Urutkan: Kalori Tertinggi (Bulking)
                </option>
                <option value="kalori-terendah" className="bg-canvas text-fg">
                  Urutkan: Kalori Terendah (Cutting)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Baris Tab Filter Kategori */}
        <div
          className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4"
          role="tablist"
          aria-label="Filter kategori menu"
        >
          {KATEGORI_FILTER_MENU.map((kat) => {
            const Ikon = IKON_KATEGORI[kat.id] || Sparkles
            const aktif = kategoriAktif === kat.id
            const jumlah = hitungJumlahPerKategori(kat.id)
            return (
              <button
                key={kat.id}
                type="button"
                role="tab"
                aria-selected={aktif}
                onClick={() => setKategoriAktif(kat.id)}
                title={kat.deskripsi}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  aktif
                    ? 'border-brand bg-brand/15 text-brand shadow-xs'
                    : 'border-line bg-fg/[0.03] text-fg-soft hover:border-fg/20 hover:bg-fg/[0.07] hover:text-fg'
                }`}
              >
                <Ikon size={14} aria-hidden="true" />
                <span>{kat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    aktif ? 'bg-brand/20 text-brand' : 'bg-fg/10 text-muted'
                  }`}
                >
                  {jumlah}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid Kartu Menu Bergambar */}
      {menuTersaring.length === 0 ? (
        <section className={`${KARTU} flex flex-col items-center justify-center p-12 text-center`}>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand">
            <UtensilsCrossed size={28} aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-bold text-fg">Tidak ada menu yang cocok dengan filter</h3>
          <p className="mt-1 max-w-md text-xs text-muted">
            Coba ganti kategori filter atau hapus kata kunci pencarian untuk melihat pilihan makanan lainnya.
          </p>
          <button
            type="button"
            onClick={() => {
              setKategoriAktif('semua')
              setKataKunci('')
            }}
            className={`${TOMBOL_UTAMA} mt-4 px-5 py-2.5 text-xs`}
          >
            Tampilkan Semua Menu
          </button>
        </section>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuTersaring.map((menu) => {
            const { id, nama, deskripsi, evaluasi } = menu
            const sudahDicatat = dicatat.includes(id)
            const totalEnergiMakro = menu.karbo * 4 + menu.protein * 4 + menu.lemak * 9 || 1
            const persenK = Math.round(((menu.karbo * 4) / totalEnergiMakro) * 100)
            const persenP = Math.round(((menu.protein * 4) / totalEnergiMakro) * 100)
            const persenL = Math.max(100 - persenK - persenP, 5)

            return (
              <li
                key={id}
                className={`${KARTU} group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_14px_34px_-10px_rgba(16,185,129,0.22)]`}
              >
                {/* Gambar Makanan + Overlay Badge */}
                <GambarMenu menu={menu} />

                {/* Isi Kartu */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold leading-snug text-fg group-hover:text-brand transition-colors">
                      {nama}
                    </h3>
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                    {deskripsi}
                  </p>

                  {/* Bar Proporsi Makro Visual */}
                  <div className="mt-4">
                    <div
                      className="flex h-1.5 w-full overflow-hidden rounded-full bg-fg/10"
                      title={`Karbo ${persenK}%, Protein ${persenP}%, Lemak ${persenL}%`}
                    >
                      <span className="bg-karbo" style={{ width: `${persenK}%` }} />
                      <span className="bg-protein" style={{ width: `${persenP}%` }} />
                      <span className="bg-lemak" style={{ width: `${persenL}%` }} />
                    </div>

                    {/* Pill Gizi Karbo, Protein, Lemak */}
                    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                      {MAKRO.map(({ kunci, label, singkat, badge }) => (
                        <div
                          key={kunci}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold tabular-nums ${badge}`}
                        >
                          <span>{singkat}</span>
                          <span className="sr-only">{label}</span>
                          <span>{menu[kunci]}g</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Indikator Kecocokan dengan Sisa Kalori */}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 text-[11px]">
                    <span
                      className={`font-medium ${
                        evaluasi.muatKalori ? 'text-brand' : 'text-bahaya'
                      }`}
                    >
                      {evaluasi.alasanRekomendasi}
                    </span>
                  </div>

                  {/* Tombol Catat ke Log */}
                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => catat(menu)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-[0.98] ${
                        sudahDicatat
                          ? 'bg-brand/20 text-brand border border-brand/30'
                          : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 in-[.light]:bg-emerald-600 in-[.light]:text-white in-[.light]:hover:bg-emerald-500'
                      }`}
                    >
                      {sudahDicatat ? (
                        <>
                          <Check size={15} aria-hidden="true" />
                          Tercatat! Klik untuk tambah lagi
                        </>
                      ) : (
                        <>
                          <Plus size={15} aria-hidden="true" />
                          Catat ke Log Makanan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
