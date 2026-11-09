import { useState } from 'react'
import { Calculator, Check, Scale, Sparkles } from 'lucide-react'
import { INPUT, KARTU, LABEL, TOMBOL_UTAMA, formatAngka } from '../components/tema.js'
import { CincinSegmen } from '../components/Grafik.jsx'
import { hitungRasioMakro } from '../application/logic.js'
import { FAKTOR_AKTIVITAS, PILIHAN_GOAL } from '../domain/ProfilBiometrik.js'
import { hitungTargetNutrisiLengkap } from '../application/hitungNutrisiAhli.js'

export default function KalkulatorPage({ profil, onTerapkanTarget }) {
  const [gender, setGender] = useState(profil?.gender || 'pria')
  const [usia, setUsia] = useState(String(profil?.usia || '22'))
  const [tinggi, setTinggi] = useState(String(profil?.tinggiBadan || '172'))
  const [berat, setBerat] = useState(String(profil?.beratSaatIni || '68'))
  const [aktivitas, setAktivitas] = useState(profil?.aktivitas || 'ringan')
  const [goal, setGoal] = useState(profil?.goal || 'maintain')
  const [terapanSukses, setTerapanSukses] = useState(false)

  const hasil = hitungTargetNutrisiLengkap({
    gender,
    beratSaatIni: Number(berat) || 68,
    tinggiBadan: Number(tinggi) || 172,
    usia: Number(usia) || 22,
    aktivitas,
    goal,
  })

  const targetKaloriDihitung = hasil.kalori
  const proteinGram = hasil.protein
  const karboGram = hasil.karbo
  const lemakGram = hasil.lemak

  const rasio = hitungRasioMakro({
    protein: proteinGram,
    karbo: karboGram,
    lemak: lemakGram,
  })

  const handleTerapkan = () => {
    onTerapkanTarget(
      {
        bmr: hasil.bmr,
        tdee: hasil.tdee,
        imt: hasil.imt,
        kalori: targetKaloriDihitung,
        protein: proteinGram,
        karbo: karboGram,
        lemak: lemakGram,
        targetGelas: hasil.targetGelas,
        airMl: hasil.airMl,
      },
      {
        ...profil,
        gender,
        usia: Number(usia) || 22,
        tinggiBadan: Number(tinggi) || 172,
        beratSaatIni: Number(berat) || 68,
        aktivitas,
        goal,
      },
    )
    setTerapanSukses(true)
    setTimeout(() => setTerapanSukses(false), 3000)
  }

  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Formulir Parameter Tubuh & Gaya Hidup */}
        <section
          className={`${KARTU} p-6 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] lg:col-span-7`}
          aria-labelledby="judul-kalkulator"
        >
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-brand" aria-hidden="true" />
            <h2 id="judul-kalkulator" className="text-lg font-semibold tracking-tight text-fg">
              Parameter Tubuh & Tingkat Aktivitas
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            Dihitung dengan rumus klinis Mifflin-St Jeor (BMR/TDEE), IMT Asia-Pasifik, AMDR Makronutrisi, dan standar hidrasi WHO (35 ml/kg BB).
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <span className={`${LABEL} mb-2 block`}>Jenis Kelamin Biologis</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('pria')}
                  className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                    gender === 'pria'
                      ? 'border-brand bg-brand/10 text-brand font-semibold'
                      : 'border-line bg-fg/[0.02] text-muted hover:text-fg'
                  }`}
                >
                  Pria
                </button>
                <button
                  type="button"
                  onClick={() => setGender('wanita')}
                  className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                    gender === 'wanita'
                      ? 'border-brand bg-brand/10 text-brand font-semibold'
                      : 'border-line bg-fg/[0.02] text-muted hover:text-fg'
                  }`}
                >
                  Wanita
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="usiaInput" className={`${LABEL} mb-1.5 block`}>
                  Usia (Tahun)
                </label>
                <input
                  id="usiaInput"
                  type="number"
                  min="10"
                  max="100"
                  value={usia}
                  onChange={(e) => setUsia(e.target.value)}
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="tinggiInput" className={`${LABEL} mb-1.5 block`}>
                  Tinggi Badan (cm)
                </label>
                <input
                  id="tinggiInput"
                  type="number"
                  min="100"
                  max="250"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value)}
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="beratInput" className={`${LABEL} mb-1.5 block`}>
                  Berat Badan (kg)
                </label>
                <input
                  id="beratInput"
                  type="number"
                  min="25"
                  max="300"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <span className={`${LABEL} mb-2 block`}>Tingkat Aktivitas Harian</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(FAKTOR_AKTIVITAS).map(([kunci, f]) => (
                  <button
                    key={kunci}
                    type="button"
                    onClick={() => setAktivitas(kunci)}
                    className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${
                      aktivitas === kunci
                        ? 'border-brand bg-brand/10 text-fg'
                        : 'border-line bg-fg/[0.02] text-muted hover:text-fg'
                    }`}
                  >
                    <span className="text-xs font-semibold text-fg">{f.label.split('(')[0]}</span>
                    <span className="mt-0.5 text-[11px] text-muted">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className={`${LABEL} mb-2 block`}>Sasaran Target (Goals)</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {Object.values(PILIHAN_GOAL).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${
                      goal === g.id
                        ? 'border-brand bg-brand/10 text-fg'
                        : 'border-line bg-fg/[0.02] text-muted hover:text-fg'
                    }`}
                  >
                    <span className="text-xs font-semibold text-fg">{g.label}</span>
                    <span className="mt-0.5 text-[11px] text-muted">
                      {g.penyesuaian === 0 ? 'Keseimbangan kalori' : `${g.penyesuaian > 0 ? '+' : ''}${g.penyesuaian} kcal/hari`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hasil Kalkulasi & Rekomendasi Target */}
        <section
          className={`${KARTU} flex flex-col p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] lg:col-span-5`}
          aria-labelledby="judul-hasil-kalkulator"
        >
          <h2 id="judul-hasil-kalkulator" className={LABEL}>
            Hasil Analisis Biometrik & Energi
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-line bg-fg/[0.02] p-3">
              <span className="block text-[10px] uppercase tracking-wider text-muted">BMR Dasar</span>
              <span className="mt-1 block text-xl font-bold tabular-nums text-fg">{formatAngka(hasil.bmr)}</span>
              <span className="text-[10px] text-muted">kcal istirahat</span>
            </div>
            <div className="rounded-xl border border-line bg-fg/[0.02] p-3">
              <span className="block text-[10px] uppercase tracking-wider text-muted">TDEE Harian</span>
              <span className="mt-1 block text-xl font-bold tabular-nums text-brand">{formatAngka(hasil.tdee)}</span>
              <span className="text-[10px] text-muted">kcal aktif</span>
            </div>
            <div className="rounded-xl border border-line bg-fg/[0.02] p-3">
              <span className="block text-[10px] uppercase tracking-wider text-muted">IMT / BMI</span>
              <span className={`mt-1 block text-xl font-bold tabular-nums ${hasil.imt.warna}`}>
                {hasil.imt.nilai}
              </span>
              <span className="block truncate text-[10px] text-muted" title={hasil.imt.kategori}>
                Ideal: {hasil.imt.bbIdealMin}–{hasil.imt.bbIdealMaks} kg
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-brand/20 bg-brand/[0.05] p-5">
            <div>
              <span className={`${LABEL} text-brand`}>Target Kalori Harian yang Direkomendasikan</span>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="text-5xl font-bold tracking-tight tabular-nums text-fg">
                  {formatAngka(targetKaloriDihitung)}
                </span>
                <span className="text-sm text-muted">kcal / hari</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium text-brand">
                  {PILIHAN_GOAL[goal]?.label}
                </span>
                <span className="text-muted">
                  Kebutuhan Air: <strong className="font-semibold text-air">{formatAngka(hasil.airMl)} ml</strong> ({hasil.targetGelas} gelas)
                </span>
              </div>
            </div>
          </div>

          {/* Rasio Makronutrisi yang Disarankan */}
          <div className="mt-6 flex-1">
            <h3 className={`${LABEL} mb-3`}>Rekomendasi Makronutrisi (Standar AMDR)</h3>
            <div className="flex items-center gap-5">
              <CincinSegmen
                segmen={[
                  { nilai: rasio.karbo, warna: 'var(--karbo)' },
                  { nilai: rasio.protein, warna: 'var(--protein)' },
                  { nilai: rasio.lemak, warna: 'var(--lemak)' },
                ]}
                ukuran={90}
                tebal={9}
                label="Distribusi Makro"
              >
                <Scale size={20} className="text-muted" aria-hidden="true" />
              </CincinSegmen>

              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-karbo">
                    <span className="h-2 w-2 rounded-full bg-karbo" /> Karbohidrat
                  </span>
                  <span className="font-semibold tabular-nums text-fg">
                    {karboGram}g ({Math.round(rasio.karbo)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-protein">
                    <span className="h-2 w-2 rounded-full bg-protein" /> Protein
                  </span>
                  <span className="font-semibold tabular-nums text-fg">
                    {proteinGram}g ({Math.round(rasio.protein)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-lemak">
                    <span className="h-2 w-2 rounded-full bg-lemak" /> Lemak
                  </span>
                  <span className="font-semibold tabular-nums text-fg">
                    {lemakGram}g ({Math.round(rasio.lemak)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <button
              type="button"
              onClick={handleTerapkan}
              className={`${TOMBOL_UTAMA} w-full`}
            >
              {terapanSukses ? (
                <>
                  <Check size={18} aria-hidden="true" />
                  Target Berhasil Diterapkan ke Dashboard!
                </>
              ) : (
                <>
                  <Sparkles size={18} aria-hidden="true" />
                  Terapkan Sebagai Target Harian
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
