import { useState } from 'react'
import { Activity, Flame, Plus, Sparkles, Timer, Trash2, Zap } from 'lucide-react'
import { INPUT, KARTU, LABEL, TOMBOL_UTAMA, formatAngka } from '../components/tema.js'
import { Cincin } from '../components/Grafik.jsx'
import { INTENSITAS_LATIHAN, KATEGORI_OLAHRAGA_MET } from '../domain/Aktivitas.js'
import { hitungKaloriOlahraga } from '../application/hitungNutrisiAhli.js'

const PRESET_OLAHRAGA = [
  { nama: 'Lari Pagi / Jogging', kategori: 'Lari / Jogging', intensitas: 'sedang', durasi: 30 },
  { nama: 'Latihan Beban (Gym)', kategori: 'Angkat Beban / Gym', intensitas: 'sedang', durasi: 45 },
  { nama: 'Futsal / Badminton', kategori: 'Olahraga Tim / Raket', intensitas: 'sedang', durasi: 45 },
  { nama: 'Bersepeda Santai', kategori: 'Bersepeda', intensitas: 'sedang', durasi: 40 },
  { nama: 'Berenang', kategori: 'Berenang', intensitas: 'sedang', durasi: 30 },
  { nama: 'HIIT / Tabata', kategori: 'HIIT / Kardio', intensitas: 'berat', durasi: 20 },
]

const DURASI_CEPAT = [15, 30, 45, 60, 90]

export default function AktivitasPage({
  daftarAktivitas,
  beratBadan = 68,
  onAddAktivitas,
  onHapusAktivitas,
  targetBakar = 400,
}) {
  const [form, setForm] = useState({
    kategori: 'Lari / Jogging',
    namaAktivitas: '',
    intensitas: 'sedang',
    durasi: 30,
  })

  const estimasi = hitungKaloriOlahraga({
    kategori: form.kategori,
    intensitas: form.intensitas,
    durasiMenit: form.durasi,
    beratKg: beratBadan,
  })

  const totalBakar = daftarAktivitas.reduce((total, item) => total + item.kalori, 0)
  const totalMenit = daftarAktivitas.reduce((total, item) => total + item.durasi, 0)
  const persenBakar = Math.min(Math.round((totalBakar / targetBakar) * 100), 100)

  const handleSubmit = (e) => {
    e.preventDefault()
    const durasiNum = Number(form.durasi)
    if (durasiNum <= 0 || estimasi.kalori <= 0) return

    const labelIntensitas =
      INTENSITAS_LATIHAN.find((i) => i.id === form.intensitas)?.label || 'Sedang'

    onAddAktivitas({
      nama: form.namaAktivitas.trim() || form.kategori,
      durasi: durasiNum,
      kalori: estimasi.kalori,
      kategori: `${form.kategori} • ${labelIntensitas}`,
      met: estimasi.met,
    })

    setForm((prev) => ({
      ...prev,
      namaAktivitas: '',
    }))
  }

  const gunakanPreset = (preset) => {
    const hasilPreset = hitungKaloriOlahraga({
      kategori: preset.kategori,
      intensitas: preset.intensitas,
      durasiMenit: preset.durasi,
      beratKg: beratBadan,
    })
    const labelIntensitas =
      INTENSITAS_LATIHAN.find((i) => i.id === preset.intensitas)?.label || 'Sedang'

    onAddAktivitas({
      nama: preset.nama,
      durasi: preset.durasi,
      kalori: hasilPreset.kalori,
      kategori: `${preset.kategori} • ${labelIntensitas}`,
      met: hasilPreset.met,
    })
  }

  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Ringkasan Kalori Terbakar & Preset Cepat */}
        <section
          className={`${KARTU} flex flex-col p-6 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] lg:col-span-4`}
          aria-labelledby="judul-ringkasan-aktivitas"
        >
          <h2 id="judul-ringkasan-aktivitas" className={LABEL}>
            Kalori Terbakar Hari Ini
          </h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="flex items-baseline gap-1.5">
                <span className="text-5xl font-bold tracking-tight tabular-nums text-fg">
                  {formatAngka(totalBakar)}
                </span>
                <span className="text-sm tabular-nums text-muted">/ {formatAngka(targetBakar)} kcal</span>
              </p>
              <p className="mt-2 text-xs text-muted">
                Total durasi aktif: <span className="font-semibold text-fg">{totalMenit} menit</span>
              </p>
            </div>
            <Cincin
              persen={persenBakar}
              warna="var(--bahaya)"
              ukuran={68}
              tebal={6}
              label={`${persenBakar}% target pembakaran tercapai`}
            >
              <span className="text-xs font-semibold tabular-nums text-fg">{persenBakar}%</span>
            </Cincin>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className={`${LABEL} flex items-center gap-1.5`}>
                <Sparkles size={14} className="text-peringatan" aria-hidden="true" />
                Preset Cepat (BB {beratBadan} kg)
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_OLAHRAGA.map((preset, idx) => {
                const hitung = hitungKaloriOlahraga({
                  kategori: preset.kategori,
                  intensitas: preset.intensitas,
                  durasiMenit: preset.durasi,
                  beratKg: beratBadan,
                })
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => gunakanPreset(preset)}
                    className="group flex flex-col rounded-xl border border-line bg-fg/[0.02] p-2.5 text-left transition-colors hover:border-brand/30 hover:bg-fg/[0.06]"
                  >
                    <span className="truncate text-xs font-medium text-fg group-hover:text-brand">
                      {preset.nama}
                    </span>
                    <span className="mt-1 text-[11px] tabular-nums text-muted">
                      {preset.durasi}m • <strong className="text-bahaya">~{hitung.kalori} kcal</strong>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form Tambah Aktivitas - Kalori Dihitung Sistem */}
        <section
          className={`${KARTU} p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] lg:col-span-8`}
          aria-labelledby="judul-form-aktivitas"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 id="judul-form-aktivitas" className="text-lg font-semibold tracking-tight text-fg">
                Catat Latihan & Aktivitas Fisik
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Pilih jenis olahraga, intensitas, dan durasi — sistem otomatis menghitung kalori terbakar berdasarkan berat badanmu ({beratBadan} kg).
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="kategoriOlahraga" className={`${LABEL} mb-1.5 block`}>
                  Kategori Olahraga
                </label>
                <select
                  id="kategoriOlahraga"
                  value={form.kategori}
                  onChange={(e) => setForm((prev) => ({ ...prev, kategori: e.target.value }))}
                  className={`${INPUT} cursor-pointer`}
                >
                  {Object.entries(KATEGORI_OLAHRAGA_MET).map(([kunci, data]) => (
                    <option key={kunci} value={kunci} className="bg-canvas text-fg">
                      {data.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="namaAktivitas" className={`${LABEL} mb-1.5 block`}>
                  Nama Spesifik (Opsional)
                </label>
                <input
                  id="namaAktivitas"
                  type="text"
                  value={form.namaAktivitas}
                  onChange={(e) => setForm((prev) => ({ ...prev, namaAktivitas: e.target.value }))}
                  placeholder={`Contoh: ${form.kategori} Sore`}
                  className={INPUT}
                />
              </div>
            </div>

            {/* Pilihan Tingkat Intensitas */}
            <div>
              <span className={`${LABEL} mb-2 block`}>Tingkat Intensitas Latihan</span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {INTENSITAS_LATIHAN.map((item) => {
                  const aktif = form.intensitas === item.id
                  const metItem = KATEGORI_OLAHRAGA_MET[form.kategori]?.met[item.id]
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, intensitas: item.id }))}
                      className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${
                        aktif
                          ? 'border-brand bg-brand/10 text-fg'
                          : 'border-line bg-fg/[0.02] text-muted hover:text-fg'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-fg">{item.label}</span>
                        <span className="rounded-md bg-fg/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-brand">
                          {metItem} METs
                        </span>
                      </div>
                      <span className="mt-1 text-[11px] text-muted">{item.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Durasi & Hasil Perhitungan Sistem */}
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-12">
              <div className="sm:col-span-6">
                <label htmlFor="durasiInput" className={`${LABEL} mb-1.5 block`}>
                  Durasi Latihan (Menit)
                </label>
                <input
                  id="durasiInput"
                  type="number"
                  min="1"
                  max="360"
                  required
                  value={form.durasi}
                  onChange={(e) => setForm((prev) => ({ ...prev, durasi: e.target.value }))}
                  className={INPUT}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {DURASI_CEPAT.map((menit) => (
                    <button
                      key={menit}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, durasi: menit }))}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium tabular-nums transition-colors ${
                        Number(form.durasi) === menit
                          ? 'bg-emerald-400 font-semibold text-slate-950 in-[.light]:bg-emerald-600 in-[.light]:text-white'
                          : 'bg-fg/[0.06] text-muted hover:bg-fg/10 hover:text-fg'
                      }`}
                    >
                      {menit} mnt
                    </button>
                  ))}
                </div>
              </div>

              {/* Kartu Output Kalkulasi Sistem */}
              <div className="flex flex-col justify-between rounded-xl border border-bahaya/25 bg-bahaya/[0.06] p-4 sm:col-span-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-bahaya">
                    <Zap size={13} aria-hidden="true" />
                    Estimasi Sistem (Otomatis)
                  </span>
                  <span className="text-[11px] tabular-nums text-muted">
                    {estimasi.met} METs × {beratBadan} kg
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight tabular-nums text-fg">
                      ~{formatAngka(estimasi.kalori)}
                    </span>
                    <span className="text-xs font-medium text-muted">kcal terbakar</span>
                  </p>
                  <Flame size={22} className="text-bahaya" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <button type="submit" className={`${TOMBOL_UTAMA} w-full sm:w-auto sm:px-8`}>
                <Plus size={18} aria-hidden="true" />
                Catat Aktivitas ({formatAngka(estimasi.kalori)} kcal)
              </button>
            </div>
          </form>

          {/* Riwayat Aktivitas */}
          <div className="mt-8 border-t border-line pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className={LABEL}>Riwayat Latihan Hari Ini</h3>
              <span className="text-xs tabular-nums text-muted">{daftarAktivitas.length} sesi</span>
            </div>

            {daftarAktivitas.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-fg/[0.02] p-8 text-center">
                <Activity size={32} className="text-muted" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-fg">Belum ada data Aktivitas Olahraga</p>
                <p className="mt-1 text-xs text-muted">
                  Pilih olahraga di atas atau klik preset cepat untuk mencatat sesi pertamamu.
                </p>
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {daftarAktivitas.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-fg/[0.02] p-3.5 transition-colors hover:bg-fg/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-fg">{item.nama}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-fg/10 px-2.5 py-0.5 text-[11px] font-medium text-fg-soft">
                          {item.kategori}
                        </span>
                        <span className="flex items-center gap-1 text-xs tabular-nums text-muted">
                          <Timer size={12} aria-hidden="true" />
                          {item.durasi} mnt
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="block text-lg font-bold tabular-nums text-bahaya">
                          -{item.kalori}
                        </span>
                        <span className="block text-[10px] uppercase text-muted">kcal</span>
                      </div>
                      {onHapusAktivitas && (
                        <button
                          type="button"
                          onClick={() => onHapusAktivitas(item.id)}
                          aria-label={`Hapus ${item.nama}`}
                          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bahaya/15 hover:text-bahaya"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
