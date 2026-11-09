import { TARGET_HARIAN } from './Makanan.js'

/**
 * Riwayat asupan harian CONTOH (aplikasi belum punya penyimpanan/backend).
 * Dibangkitkan dengan seed tetap agar tampilan stabil. Urutan: terlama -> kemarin.
 * Hari ini selalu dihitung dari daftar makanan yang benar-benar dicatat.
 */
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const JUMLAH_HARI = 110
const HARI_KONSISTEN = 9 // beberapa hari terakhir dibuat stabil di target agar streak terlihat
const acak = mulberry32(58)

export const RIWAYAT_CONTOH = Array.from({ length: JUMLAH_HARI }, (_, i) => {
  const konsisten = i >= JUMLAH_HARI - HARI_KONSISTEN
  if (!konsisten && acak() < 0.08) return { kalori: 0, protein: 0, karbo: 0, lemak: 0 }

  const faktor = konsisten ? 0.86 + acak() * 0.18 : 0.55 + acak() * 0.7
  const variasi = () => 0.8 + acak() * 0.4
  return {
    kalori: Math.round(TARGET_HARIAN.kalori * faktor),
    protein: Math.round(TARGET_HARIAN.protein * faktor * variasi()),
    karbo: Math.round(TARGET_HARIAN.karbo * faktor * variasi()),
    lemak: Math.round(TARGET_HARIAN.lemak * faktor * variasi()),
  }
})
