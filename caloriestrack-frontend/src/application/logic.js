/**
 * Layer Application: pure functions untuk logika bisnis perhitungan nutrisi.
 * Tidak ada efek samping dan tidak bergantung pada React.
 */

/** Total kalori (kcal) dari daftar makanan. */
export function hitungTotalKalori(daftarMakanan) {
  return daftarMakanan.reduce((total, makanan) => total + makanan.kalori, 0)
}

/** Total makronutrisi (gram) dari daftar makanan. */
export function hitungTotalMakro(daftarMakanan) {
  return daftarMakanan.reduce(
    (total, makanan) => ({
      protein: total.protein + makanan.protein,
      karbo: total.karbo + makanan.karbo,
      lemak: total.lemak + makanan.lemak,
    }),
    { protein: 0, karbo: 0, lemak: 0 },
  )
}

/** Persentase progres terhadap target, dibatasi 0-100. */
export function hitungPersen(nilai, target) {
  if (target <= 0) return 0
  return Math.min(Math.max((nilai / target) * 100, 0), 100)
}

/**
 * Rasio makronutrisi berdasarkan kontribusi energi
 * (karbo & protein 4 kcal/g, lemak 9 kcal/g), dalam persen dan total 100.
 */
export function hitungRasioMakro({ protein, karbo, lemak }) {
  const energiKarbo = karbo * 4
  const energiProtein = protein * 4
  const energiLemak = lemak * 9
  const total = energiKarbo + energiProtein + energiLemak

  if (total === 0) return { karbo: 0, protein: 0, lemak: 0 }

  return {
    karbo: (energiKarbo / total) * 100,
    protein: (energiProtein / total) * 100,
    lemak: (energiLemak / total) * 100,
  }
}

/** Rasio dianggap seimbang bila masuk rentang AMDR (karbo 45-65%, protein 10-35%, lemak 20-35%). */
export function apakahRasioSeimbang({ karbo, protein, lemak }) {
  return karbo >= 45 && karbo <= 65 && protein >= 10 && protein <= 35 && lemak >= 20 && lemak <= 35
}

/**
 * Status asupan kalori satu hari terhadap target:
 * 'kosong' | 'rendah' (<50%) | 'sedang' (<80%) | 'tercapai' (80-110%) | 'lebih' (>110%).
 */
export function statusKalori(kalori, target) {
  if (kalori <= 0 || target <= 0) return 'kosong'
  const rasio = kalori / target
  if (rasio > 1.1) return 'lebih'
  if (rasio >= 0.8) return 'tercapai'
  if (rasio >= 0.5) return 'sedang'
  return 'rendah'
}

/**
 * Jumlah hari beruntun target kalori tercapai. `daftarKalori` urut terlama -> hari ini.
 * Hari ini yang belum tercapai tidak memutus streak karena harinya belum selesai.
 */
export function hitungStreak(daftarKalori, target) {
  const hari = [...daftarKalori]
  if (statusKalori(hari.at(-1), target) !== 'tercapai') hari.pop()

  let streak = 0
  for (let i = hari.length - 1; i >= 0 && statusKalori(hari[i], target) === 'tercapai'; i--) streak++
  return streak
}
