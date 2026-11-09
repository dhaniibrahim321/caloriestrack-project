import { useEffect, useRef, useState } from 'react'
import { Calculator, Camera, RotateCcw, Trash2, User, X } from 'lucide-react'
import { INPUT, LABEL, MAKRO, TOMBOL_SEKUNDER, TOMBOL_UTAMA, formatAngka } from './tema.js'
import { FAKTOR_AKTIVITAS, PILIHAN_GOAL } from '../domain/ProfilBiometrik.js'
import { hitungTargetNutrisiLengkap } from '../application/hitungNutrisiAhli.js'

function Toggle({ label, deskripsi, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="text-xs text-muted">{deskripsi}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-emerald-400' : 'bg-fg/15'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-out ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function FormTargetDanProfil({ target, profil, onSimpan, onTutup }) {
  const inputFotoRef = useRef(null)
  const [drafProfil, setDrafProfil] = useState({
    nama: profil?.nama || 'Rizky Pratama',
    foto: profil?.foto || '',
    gender: profil?.gender || 'pria',
    usia: profil?.usia || 22,
    tinggiBadan: profil?.tinggiBadan || 172,
    beratSaatIni: profil?.beratSaatIni || 68,
    beratTarget: profil?.beratTarget || 64,
    aktivitas: profil?.aktivitas || 'ringan',
    goal: profil?.goal || 'maintain',
    kompensasiOlahraga: profil?.kompensasiOlahraga ?? true,
    pengingat: profil?.pengingat ?? true,
    ringkasanMingguan: profil?.ringkasanMingguan ?? false,
  })

  const [drafTarget, setDrafTarget] = useState({
    kalori: target.kalori,
    protein: target.protein,
    karbo: target.karbo,
    lemak: target.lemak,
    targetGelas: target.targetGelas || 10,
    airMl: target.airMl || 2380,
  })

  // Hitung estimasi klinis berdasarkan drafProfil saat ini
  const estimasiAhli = hitungTargetNutrisiLengkap(drafProfil)

  // Mengubah field biometrik langsung memperbarui drafTarget secara otomatis
  const ubahBiometrik = (kunci, nilai) => {
    const profilBerikutnya = { ...drafProfil, [kunci]: nilai }
    setDrafProfil(profilBerikutnya)

    if (['gender', 'usia', 'tinggiBadan', 'beratSaatIni', 'aktivitas', 'goal'].includes(kunci)) {
      const hasil = hitungTargetNutrisiLengkap(profilBerikutnya)
      setDrafTarget({
        kalori: hasil.kalori,
        protein: hasil.protein,
        karbo: hasil.karbo,
        lemak: hasil.lemak,
        targetGelas: hasil.targetGelas,
        airMl: hasil.airMl,
      })
    }
  }

  const handlePilihFoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDrafProfil((prev) => ({ ...prev, foto: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const resetKeRumusAhli = () => {
    setDrafTarget({
      kalori: estimasiAhli.kalori,
      protein: estimasiAhli.protein,
      karbo: estimasiAhli.karbo,
      lemak: estimasiAhli.lemak,
      targetGelas: estimasiAhli.targetGelas,
      airMl: estimasiAhli.airMl,
    })
  }

  // Jika slider kalori digeser manual, sesuaikan gram makro secara proporsional
  const ubahKaloriManual = (kaloriBaru) => {
    const k = Number(kaloriBaru)
    const proteinGram = drafTarget.protein
    const lemakGram = Math.round((k * 0.25) / 9)
    const karboGram = Math.max(Math.round((k - (proteinGram * 4 + lemakGram * 9)) / 4), 0)
    setDrafTarget((prev) => ({
      ...prev,
      kalori: k,
      lemak: lemakGram,
      karbo: karboGram,
    }))
  }

  const ubahMakroManual = (kunci) => (e) =>
    setDrafTarget((prev) => ({ ...prev, [kunci]: Number(e.target.value) }))

  const energiMakro =
    Number(drafTarget.protein) * 4 + Number(drafTarget.karbo) * 4 + Number(drafTarget.lemak) * 9
  const selisih = energiMakro - drafTarget.kalori

  const handleSubmit = (e) => {
    e.preventDefault()
    onSimpan(
      {
        bmr: estimasiAhli.bmr,
        tdee: estimasiAhli.tdee,
        imt: estimasiAhli.imt,
        kalori: Number(drafTarget.kalori),
        protein: Number(drafTarget.protein),
        karbo: Number(drafTarget.karbo),
        lemak: Number(drafTarget.lemak),
        targetGelas: Number(drafTarget.targetGelas) || 8,
        airMl: Number(drafTarget.airMl) || 2000,
      },
      {
        nama: String(drafProfil.nama).trim() || 'Pengguna',
        foto: drafProfil.foto,
        gender: drafProfil.gender,
        usia: Number(drafProfil.usia) || 22,
        tinggiBadan: Number(drafProfil.tinggiBadan) || 170,
        beratSaatIni: Number(drafProfil.beratSaatIni) || 68,
        beratTarget: Number(drafProfil.beratTarget) || 64,
        aktivitas: drafProfil.aktivitas,
        goal: drafProfil.goal,
        kompensasiOlahraga: drafProfil.kompensasiOlahraga,
        pengingat: drafProfil.pengingat,
        ringkasanMingguan: drafProfil.ringkasanMingguan,
      },
    )
    onTutup()
  }

  return (
    <form id="form-target" onSubmit={handleSubmit} className="space-y-6">
      {/* Foto & Nama Profil */}
      <section className="flex items-center gap-4 rounded-xl border border-line bg-fg/[0.02] p-4">
        <div className="relative h-16 w-16 shrink-0">
          {drafProfil.foto ? (
            <img
              src={drafProfil.foto}
              alt={drafProfil.nama}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand/50"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-fg/10 text-brand ring-2 ring-line">
              <User size={28} aria-hidden="true" />
            </div>
          )}
          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            title="Pilih foto profil"
            className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-400 text-slate-950 shadow transition-transform hover:scale-105 in-[.light]:bg-emerald-600 in-[.light]:text-white"
          >
            <Camera size={14} aria-hidden="true" />
          </button>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            onChange={handlePilihFoto}
            className="hidden"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <label htmlFor="namaPengguna" className="mb-1 block text-xs text-muted">
              Nama Tampilan
            </label>
            <input
              id="namaPengguna"
              type="text"
              required
              value={drafProfil.nama}
              onChange={(e) => ubahBiometrik('nama', e.target.value)}
              className={INPUT}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-fg/10 px-2.5 py-1 text-xs font-medium text-fg transition-colors hover:bg-fg/15"
            >
              <Camera size={12} aria-hidden="true" />
              {drafProfil.foto ? 'Ganti Foto' : 'Tambah Foto Profil'}
            </button>
            {drafProfil.foto && (
              <button
                type="button"
                onClick={() => setDrafProfil((prev) => ({ ...prev, foto: '' }))}
                className="inline-flex items-center gap-1 rounded-lg bg-bahaya/15 px-2.5 py-1 text-xs font-medium text-bahaya transition-colors hover:bg-bahaya/25"
              >
                <Trash2 size={12} aria-hidden="true" />
                Hapus
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Parameter Fisik Pengguna */}
      <section className="space-y-4 rounded-xl border border-line bg-fg/[0.02] p-4">
        <div className="flex items-center justify-between">
          <h3 className={`${LABEL} flex items-center gap-1.5`}>
            <Calculator size={14} className="text-brand" aria-hidden="true" />
            Data Tubuh (Otomatis Hitung)
          </h3>
          <button
            type="button"
            onClick={resetKeRumusAhli}
            title="Kembalikan target ke hasil perhitungan rumus ahli"
            className="flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand/20"
          >
            <RotateCcw size={12} aria-hidden="true" />
            Reset Rumus
          </button>
        </div>

        <div>
          <span className="mb-1 block text-xs text-muted">Jenis Kelamin Biologis</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => ubahBiometrik('gender', 'pria')}
              className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                drafProfil.gender === 'pria'
                  ? 'border-brand bg-brand/15 text-brand font-semibold'
                  : 'border-line text-muted hover:text-fg'
              }`}
            >
              Pria
            </button>
            <button
              type="button"
              onClick={() => ubahBiometrik('gender', 'wanita')}
              className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                drafProfil.gender === 'wanita'
                  ? 'border-brand bg-brand/15 text-brand font-semibold'
                  : 'border-line text-muted hover:text-fg'
              }`}
            >
              Wanita
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="panelUsia" className="mb-1 block text-xs text-muted">
              Usia (thn)
            </label>
            <input
              id="panelUsia"
              type="number"
              min="10"
              max="100"
              required
              value={drafProfil.usia}
              onChange={(e) => ubahBiometrik('usia', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="panelTb" className="mb-1 block text-xs text-muted">
              Tinggi (cm)
            </label>
            <input
              id="panelTb"
              type="number"
              min="100"
              max="250"
              required
              value={drafProfil.tinggiBadan}
              onChange={(e) => ubahBiometrik('tinggiBadan', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="panelBb" className="mb-1 block text-xs text-muted">
              Berat (kg)
            </label>
            <input
              id="panelBb"
              type="number"
              min="25"
              max="300"
              required
              value={drafProfil.beratSaatIni}
              onChange={(e) => ubahBiometrik('beratSaatIni', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="panelTargetBb" className="mb-1 block text-xs text-muted">
              Target BB (kg)
            </label>
            <input
              id="panelTargetBb"
              type="number"
              min="25"
              max="300"
              value={drafProfil.beratTarget}
              onChange={(e) => ubahBiometrik('beratTarget', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="panelGoal" className="mb-1 block text-xs text-muted">
              Tujuan Diet
            </label>
            <select
              id="panelGoal"
              value={drafProfil.goal}
              onChange={(e) => ubahBiometrik('goal', e.target.value)}
              className={`${INPUT} cursor-pointer`}
            >
              {Object.values(PILIHAN_GOAL).map((g) => (
                <option key={g.id} value={g.id} className="bg-canvas text-fg">
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="panelAktivitas" className="mb-1 block text-xs text-muted">
            Tingkat Aktivitas Harian
          </label>
          <select
            id="panelAktivitas"
            value={drafProfil.aktivitas}
            onChange={(e) => ubahBiometrik('aktivitas', e.target.value)}
            className={`${INPUT} cursor-pointer`}
          >
            {Object.entries(FAKTOR_AKTIVITAS).map(([kunci, data]) => (
              <option key={kunci} value={kunci} className="bg-canvas text-fg">
                {data.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ringkasan BMR, TDEE, dan IMT */}
        <div className="grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
          <div className="rounded-lg bg-fg/[0.03] p-2">
            <span className="block text-[10px] uppercase text-muted">BMR</span>
            <span className="text-sm font-bold tabular-nums text-fg">{formatAngka(estimasiAhli.bmr)}</span>
          </div>
          <div className="rounded-lg bg-fg/[0.03] p-2">
            <span className="block text-[10px] uppercase text-muted">TDEE</span>
            <span className="text-sm font-bold tabular-nums text-brand">{formatAngka(estimasiAhli.tdee)}</span>
          </div>
          <div className="rounded-lg bg-fg/[0.03] p-2">
            <span className="block text-[10px] uppercase text-muted">IMT (BMI)</span>
            <span className={`text-sm font-bold tabular-nums ${estimasiAhli.imt.warna}`}>
              {estimasiAhli.imt.nilai}
            </span>
          </div>
        </div>
      </section>

      {/* Target Hasil Perhitungan */}
      <section className="space-y-4">
        <div>
          <div className="flex items-end justify-between">
            <label htmlFor="targetKaloriRange" className={LABEL}>
              Target Kalori Harian
            </label>
            <p>
              <span className="text-3xl font-bold tracking-tight tabular-nums text-fg">
                {formatAngka(drafTarget.kalori)}
              </span>
              <span className="ml-1 text-xs text-muted">kcal</span>
            </p>
          </div>
          <input
            id="targetKaloriRange"
            type="range"
            min="1200"
            max="3500"
            step="25"
            value={drafTarget.kalori}
            onChange={(e) => ubahKaloriManual(e.target.value)}
            className="mt-3 h-2 w-full cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Makronutrisi Target */}
        <div>
          <span className={`${LABEL} mb-2 block`}>Target Makronutrisi Harian</span>
          <div className="grid grid-cols-3 gap-2">
            {MAKRO.map(({ kunci, label, titik }) => (
              <div key={kunci}>
                <label htmlFor={`target-${kunci}`} className="mb-1 flex items-center gap-1 text-[11px] text-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${titik}`} aria-hidden="true" />
                  {label === 'Karbohidrat' ? 'Karbo' : label}
                </label>
                <div className="relative">
                  <input
                    id={`target-${kunci}`}
                    type="number"
                    min="0"
                    required
                    value={drafTarget[kunci]}
                    onChange={ubahMakroManual(kunci)}
                    className={`${INPUT} pr-7 text-xs`}
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">
                    g
                  </span>
                </div>
              </div>
            ))}
          </div>
          {Math.abs(selisih) > 150 && (
            <p className="mt-2 text-[11px] tabular-nums text-peringatan">
              Energi dari makro: {formatAngka(energiMakro)} kcal (selisih {formatAngka(Math.abs(selisih))} kcal dari target kalori)
            </p>
          )}
        </div>

        {/* Target Hidrasi Air */}
        <div className="rounded-xl border border-line bg-fg/[0.02] p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-fg">Target Hidrasi Air (35 ml/kg BB)</span>
              <span className="text-[11px] text-muted">
                BB {drafProfil.beratSaatIni} kg → {formatAngka(drafTarget.airMl)} ml / hari
              </span>
            </div>
            <span className="text-xl font-bold tabular-nums text-air">
              {drafTarget.targetGelas} <span className="text-xs font-normal text-muted">gelas</span>
            </span>
          </div>
        </div>
      </section>

      {/* Preferensi */}
      <section className="space-y-4 border-t border-line pt-4">
        <h3 className={LABEL}>Preferensi</h3>
        <Toggle
          label="Kompensasi Kalori Olahraga"
          deskripsi="Tambahkan kalori yang dibakar dari olahraga ke kuota kalori harian."
          checked={drafProfil.kompensasiOlahraga}
          onChange={(v) => ubahBiometrik('kompensasiOlahraga', v)}
        />
        <Toggle
          label="Pengingat Jam Makan & Air"
          deskripsi="Notifikasi berkala untuk mencatat asupan harian."
          checked={drafProfil.pengingat}
          onChange={(v) => ubahBiometrik('pengingat', v)}
        />
        <Toggle
          label="Rangkuman Mingguan"
          deskripsi="Evaluasi kepatuhan makronutrisi setiap akhir pekan."
          checked={drafProfil.ringkasanMingguan}
          onChange={(v) => ubahBiometrik('ringkasanMingguan', v)}
        />
      </section>
    </form>
  )
}

export default function TargetPanel({ terbuka, target, profil, onSimpan, onTutup }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (terbuka && !dialog.open) dialog.showModal()
    if (!terbuka && dialog.open) dialog.close()
  }, [terbuka])

  return (
    <dialog
      ref={dialogRef}
      onClose={onTutup}
      onClick={(e) => e.target === dialogRef.current && onTutup()}
      aria-labelledby="judul-target"
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-transparent p-0 text-fg backdrop:bg-black/50 backdrop:backdrop-blur-sm motion-safe:open:animate-panel-masuk"
    >
      <div className="flex h-full flex-col border-l border-line bg-canvas/90 backdrop-blur-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 pb-4 pt-6">
          <div>
            <h2 id="judul-target" className="text-xl font-bold tracking-tight text-fg">
              Profil Biometrik & Target
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Ubah foto profil, BB, TB, usia, atau gender untuk menyesuaikan target otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup panel"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-fg/10 hover:text-fg"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {terbuka && (
            <FormTargetDanProfil
              target={target}
              profil={profil}
              onSimpan={onSimpan}
              onTutup={onTutup}
            />
          )}
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onTutup} className={TOMBOL_SEKUNDER}>
            Batal
          </button>
          <button type="submit" form="form-target" className={TOMBOL_UTAMA}>
            Simpan & Terapkan
          </button>
        </footer>
      </div>
    </dialog>
  )
}
