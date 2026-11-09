/**
 * Layer Domain: Entitas Aktivitas Fisik & Tabel Konstanta METs (Compendium of Physical Activities).
 */

export const KATEGORI_OLAHRAGA_MET = Object.freeze({
  'Lari / Jogging': { label: 'Lari / Jogging', met: { ringan: 6.0, sedang: 8.3, berat: 11.0 } },
  'Jalan Kaki': { label: 'Jalan Kaki / Brisk Walk', met: { ringan: 3.0, sedang: 4.3, berat: 5.5 } },
  'Angkat Beban / Gym': { label: 'Angkat Beban / Gym', met: { ringan: 3.5, sedang: 5.0, berat: 6.5 } },
  Bersepeda: { label: 'Bersepeda', met: { ringan: 4.0, sedang: 6.8, berat: 10.0 } },
  Berenang: { label: 'Berenang', met: { ringan: 5.8, sedang: 8.0, berat: 10.0 } },
  'HIIT / Kardio': { label: 'HIIT / Senam Aerobik', met: { ringan: 5.5, sedang: 8.0, berat: 11.0 } },
  'Olahraga Tim / Raket': { label: 'Futsal / Badminton / Basket', met: { ringan: 5.0, sedang: 7.0, berat: 9.0 } },
  'Yoga / Stretching': { label: 'Yoga / Pilates / Stretching', met: { ringan: 2.5, sedang: 3.3, berat: 4.0 } },
})

export const INTENSITAS_LATIHAN = Object.freeze([
  { id: 'ringan', label: 'Ringan', desc: 'Napas santai, masih bisa mengobrol lancar' },
  { id: 'sedang', label: 'Sedang', desc: 'Berkeringat & detak jantung meningkat stabil' },
  { id: 'berat', label: 'Tinggi / Berat', desc: 'Napas cepat & latihan intensif maksimal' },
])

/** Membuat entitas sesi aktivitas olahraga baru dengan struktur konsisten. */
export function buatAktivitas({ id, nama, durasi, kalori, kategori, met, waktu }) {
  return {
    id,
    nama: String(nama).trim(),
    durasi: Number(durasi),
    kalori: Number(kalori),
    kategori: String(kategori),
    met: Number(met) || 5.0,
    waktu: waktu || '',
  }
}
