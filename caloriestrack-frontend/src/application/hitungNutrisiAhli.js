/**
 * Layer Application: Use Cases & Perhitungan Klinis Nutrisi, Energi, Hidrasi, dan Olahraga.
 * Bergantung hanya pada Layer Domain (murni, tanpa efek samping UI/framework).
 */
import { FAKTOR_AKTIVITAS, PILIHAN_GOAL } from '../domain/ProfilBiometrik.js'
import { INTENSITAS_LATIHAN, KATEGORI_OLAHRAGA_MET } from '../domain/Aktivitas.js'

export { FAKTOR_AKTIVITAS, PILIHAN_GOAL, INTENSITAS_LATIHAN, KATEGORI_OLAHRAGA_MET }

/**
 * Menghitung BMR (Basal Metabolic Rate) menggunakan Rumus Mifflin-St Jeor:
 * Pria   : BMR = (10 × BB kg) + (6.25 × TB cm) - (5 × Usia) + 5
 * Wanita : BMR = (10 × BB kg) + (6.25 × TB cm) - (5 × Usia) - 161
 */
export function hitungBMR({ gender = 'pria', berat = 68, tinggi = 172, usia = 22 }) {
  const bb = Math.max(Number(berat) || 60, 25)
  const tb = Math.max(Number(tinggi) || 165, 100)
  const u = Math.min(Math.max(Number(usia) || 20, 10), 100)

  const dasar = 10 * bb + 6.25 * tb - 5 * u
  return Math.round(gender === 'wanita' ? dasar - 161 : dasar + 5)
}

/**
 * Menghitung TDEE (Total Daily Energy Expenditure) = BMR × Faktor Aktivitas
 */
export function hitungTDEE(bmr, tingkatAktivitas = 'ringan') {
  const faktor = FAKTOR_AKTIVITAS[tingkatAktivitas]?.nilai || 1.375
  return Math.round(bmr * faktor)
}

/**
 * Menghitung Indeks Massa Tubuh (IMT / BMI) dan rentang Berat Badan Ideal (BMI 18.5 – 22.9 Asia/Kemenkes)
 */
export function hitungIMT(beratKg = 68, tinggiCm = 172) {
  const bb = Math.max(Number(beratKg) || 60, 25)
  const meter = Math.max(Number(tinggiCm) || 165, 100) / 100
  const imt = bb / (meter * meter)
  const nilai = Math.round(imt * 10) / 10

  let kategori = 'Normal (Ideal)'
  let warna = 'text-brand'
  if (nilai < 18.5) {
    kategori = 'Berat Badan Kurang (Underweight)'
    warna = 'text-air'
  } else if (nilai >= 25) {
    kategori = 'Obesitas'
    warna = 'text-bahaya'
  } else if (nilai >= 23) {
    kategori = 'Berat Badan Lebih (Overweight)'
    warna = 'text-peringatan'
  }

  const bbIdealMin = Math.round(18.5 * meter * meter)
  const bbIdealMaks = Math.round(22.9 * meter * meter)

  return { nilai, kategori, warna, bbIdealMin, bbIdealMaks }
}

/**
 * Menghitung kebutuhan air harian (standar WHO/EFSA: 35 ml per kg BB)
 * Returns: { ml, gelas } (asumsi 1 gelas = 250 ml)
 */
export function hitungKebutuhanAir(beratKg = 68) {
  const bb = Math.max(Number(beratKg) || 60, 25)
  const ml = Math.round(bb * 35)
  const gelas = Math.max(Math.round(ml / 250), 6)
  return { ml, gelas }
}

/**
 * Menghitung target kalori, makronutrisi (dijamin dalam rentang AMDR), hidrasi, dan IMT.
 */
export function hitungTargetNutrisiLengkap(profil = {}) {
  const {
    gender = 'pria',
    beratSaatIni = 68,
    tinggiBadan = 172,
    usia = 22,
    aktivitas = 'ringan',
    goal = 'maintain',
  } = profil

  const bb = Math.max(Number(beratSaatIni) || 68, 25)
  const tb = Math.max(Number(tinggiBadan) || 172, 100)
  const u = Math.min(Math.max(Number(usia) || 22, 10), 100)

  const bmr = hitungBMR({ gender, berat: bb, tinggi: tb, usia: u })
  const tdee = hitungTDEE(bmr, aktivitas)
  const imt = hitungIMT(bb, tb)

  const sasaran = PILIHAN_GOAL[goal] || PILIHAN_GOAL.maintain
  const batasBawah = gender === 'wanita' ? 1200 : 1400
  const targetKalori = Math.max(tdee + sasaran.penyesuaian, batasBawah)

  // 1. Protein: 1.8–2.0g/kg BB, dijaga dalam koridor AMDR (15% – 30% total energi)
  const proteinIdeal = bb * sasaran.faktorProtein
  const proteinMin = (targetKalori * 0.15) / 4
  const proteinMaks = (targetKalori * 0.30) / 4
  const proteinGram = Math.round(Math.min(Math.max(proteinIdeal, proteinMin), proteinMaks))
  const kaloriProtein = proteinGram * 4

  // 2. Lemak: 25–27% dari total kalori harian (koridor AMDR 20% – 35%, 1g lemak = 9 kcal)
  const lemakGram = Math.round((targetKalori * sasaran.porsiLemak) / 9)
  const kaloriLemak = lemakGram * 9

  // 3. Karbohidrat: sisa energi harian dibagi 4 kcal/g (berada di 45% – 60% AMDR)
  const kaloriKarbo = Math.max(targetKalori - (kaloriProtein + kaloriLemak), 0)
  const karboGram = Math.round(kaloriKarbo / 4)

  const air = hitungKebutuhanAir(bb)

  return {
    bmr,
    tdee,
    imt,
    kalori: targetKalori,
    protein: proteinGram,
    karbo: karboGram,
    lemak: lemakGram,
    airMl: air.ml,
    targetGelas: air.gelas,
  }
}

/**
 * Menghitung kalori terbakar dengan Rumus Standar ACSM / Compendium of Physical Activities:
 * Kalori (kcal) = ((MET × 3.5 × Berat Badan kg) / 200) × Durasi (menit)
 */
export function hitungKaloriOlahraga({
  kategori = 'Lari / Jogging',
  intensitas = 'sedang',
  durasiMenit = 30,
  beratKg = 68,
}) {
  const dataKategori = KATEGORI_OLAHRAGA_MET[kategori] ?? KATEGORI_OLAHRAGA_MET['Lari / Jogging']
  const met = dataKategori.met[intensitas] ?? dataKategori.met.sedang
  const bb = Math.max(Number(beratKg) || 68, 25)
  const durasi = Math.max(Number(durasiMenit) || 0, 0)

  const kalori = ((met * 3.5 * bb) / 200) * durasi
  return {
    kalori: Math.round(kalori),
    met,
  }
}
