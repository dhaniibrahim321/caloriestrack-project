/**
 * Layer Infrastructure: Data awal (seed) untuk makanan, aktivitas, dan riwayat konsistensi.
 */
import { buatMakanan } from '../domain/Makanan.js'
import { buatAktivitas } from '../domain/Aktivitas.js'
import { RIWAYAT_CONTOH } from '../domain/riwayatContoh.js'

export const DATA_AWAL_MAKANAN = [
  buatMakanan({ id: 1, nama: 'Oatmeal dengan Pisang', kalori: 320, protein: 11, karbo: 58, lemak: 6 }),
  buatMakanan({ id: 2, nama: 'Dada Ayam Bakar', kalori: 285, protein: 42, karbo: 2, lemak: 11 }),
  buatMakanan({ id: 3, nama: 'Nasi Merah', kalori: 218, protein: 5, karbo: 46, lemak: 2 }),
  buatMakanan({ id: 4, nama: 'Tempe Goreng', kalori: 190, protein: 12, karbo: 9, lemak: 12 }),
]

export const DATA_AWAL_AKTIVITAS = [
  buatAktivitas({
    id: 101,
    nama: 'Jogging Pagi',
    durasi: 25,
    kalori: 247,
    kategori: 'Lari / Jogging • Sedang',
    met: 8.3,
    waktu: '06:30',
  }),
]

export { RIWAYAT_CONTOH }
