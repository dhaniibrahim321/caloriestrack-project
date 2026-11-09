/**
 * Layer Domain: definisi entitas Makanan dan target harian.
 *
 * Struktur objek makanan:
 * {
 *   id:       number | string  -> pengenal unik (dipakai sebagai `key` saat render)
 *   nama:     string           -> nama makanan
 *   kalori:   number           -> kcal
 *   protein:  number           -> gram
 *   karbo:    number           -> gram
 *   lemak:    number           -> gram
 * }
 */

/** Target harian (dummy) sebagai acuan progress bar. */
export const TARGET_HARIAN = Object.freeze({
  kalori: 2000, // kcal
  protein: 100, // gram
  karbo: 250, // gram
  lemak: 65, // gram
})

/** Membuat objek makanan baru dengan struktur yang konsisten. */
export function buatMakanan({ id, nama, kalori, protein, karbo, lemak }) {
  return {
    id,
    nama: String(nama).trim(),
    kalori: Number(kalori),
    protein: Number(protein),
    karbo: Number(karbo),
    lemak: Number(lemak),
  }
}
