import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { hitungPersen, hitungTotalKalori, hitungTotalMakro } from '../application/logic.js'
import { Cincin } from '../components/Grafik.jsx'
import KartuMakanan from '../components/KartuMakanan.jsx'
import { INPUT, KARTU, LABEL, MAKRO, TOMBOL_UTAMA, formatAngka } from '../components/tema.js'

const FORM_AWAL = {
  namaMakanan: '',
  kalori: '',
  protein: '',
  karbo: '',
  lemak: '',
}

export default function LogMakananPage({ daftarMakanan, target, onAddFood }) {
  const [form, setForm] = useState(FORM_AWAL)

  const totalKalori = hitungTotalKalori(daftarMakanan)
  const totalMakro = hitungTotalMakro(daftarMakanan)
  const persenKalori = hitungPersen(totalKalori, target.kalori)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((sebelumnya) => ({ ...sebelumnya, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const adaYangKosong = Object.values(form).some((nilai) => String(nilai).trim() === '')
    if (adaYangKosong) return

    onAddFood(form)
    setForm(FORM_AWAL)
  }

  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
        <section
          className={`${KARTU} p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] lg:col-span-4`}
          aria-labelledby="judul-form"
        >
          <h2 id="judul-form" className="text-lg font-semibold tracking-tight text-fg">
            Tambah catatan
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="namaMakanan" className={`${LABEL} mb-1.5 block`}>
                Nama makanan
              </label>
              <input
                id="namaMakanan"
                name="namaMakanan"
                type="text"
                required
                value={form.namaMakanan}
                onChange={handleChange}
                placeholder="Contoh: Nasi Merah"
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="kalori" className={`${LABEL} mb-1.5 block`}>
                Kalori (kcal)
              </label>
              <input
                id="kalori"
                name="kalori"
                type="number"
                min="0"
                required
                value={form.kalori}
                onChange={handleChange}
                placeholder="0"
                className={INPUT}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {MAKRO.map(({ kunci, label, titik }) => (
                <div key={kunci}>
                  <label htmlFor={kunci} className={`${LABEL} mb-1.5 flex items-center gap-1.5`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${titik}`} aria-hidden="true" />
                    {label === 'Karbohidrat' ? 'Karbo' : label} (g)
                  </label>
                  <input
                    id={kunci}
                    name={kunci}
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={form[kunci]}
                    onChange={handleChange}
                    placeholder="0"
                    className={INPUT}
                  />
                </div>
              ))}
            </div>

            <button type="submit" className={`${TOMBOL_UTAMA} w-full`}>
              <Plus size={18} aria-hidden="true" />
              Tambah catatan
            </button>
          </form>
        </section>

        <section
          className={`${KARTU} flex flex-col p-6 lg:col-span-8 lg:row-span-2`}
          aria-labelledby="judul-riwayat"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="judul-riwayat" className={LABEL}>
              Riwayat hari ini
            </h2>
            <span className="text-xs tabular-nums text-muted">{daftarMakanan.length} catatan</span>
          </div>

          {daftarMakanan.length === 0 ? (
            <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl bg-fg/[0.02] px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <UtensilsCrossed size={28} aria-hidden="true" />
              </div>
              <p className="mt-4 font-medium text-fg">Belum ada data Catatan Makanan</p>
              <p className="mt-1 text-sm text-muted">Gunakan formulir untuk mencatat makanan pertamamu.</p>
            </div>
          ) : (
            <ul className="mt-5 grid content-start gap-2 xl:grid-cols-2">
              {daftarMakanan.map((makanan) => (
                <KartuMakanan key={makanan.id} makanan={makanan} />
              ))}
            </ul>
          )}
        </section>

        <section className={`${KARTU} p-6 lg:col-span-4`} aria-labelledby="judul-total">
          <h2 id="judul-total" className={LABEL}>
            Total hari ini
          </h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight tabular-nums text-fg">
                {formatAngka(totalKalori)}
              </span>
              <span className="text-sm tabular-nums text-muted">/ {formatAngka(target.kalori)} kcal</span>
            </p>
            <Cincin persen={persenKalori} warna="var(--brand)" ukuran={56} tebal={5} label={`${Math.round(persenKalori)} persen dari target kalori`}>
              <span className="text-xs font-semibold tabular-nums text-fg">{Math.round(persenKalori)}%</span>
            </Cincin>
          </div>
          <ul className="mt-5 space-y-3">
            {MAKRO.map(({ kunci, label, titik }) => {
              const persen = hitungPersen(totalMakro[kunci], target[kunci])
              return (
                <li key={kunci}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-fg-soft">{label}</span>
                    <span className="tabular-nums text-muted">
                      {formatAngka(totalMakro[kunci])} / {formatAngka(target[kunci])} g
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-fg/10"
                    role="progressbar"
                    aria-label={`Progres ${label}`}
                    aria-valuenow={Math.round(persen)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ease-out ${titik}`}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
