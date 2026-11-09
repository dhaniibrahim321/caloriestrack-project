/**
 * Layer Application: Use Case Rekomendasi Menu Pintar.
 * Menyaring, mengurutkan, dan memberi penilaian kecocokan menu terhadap sisa kuota kalori & makronutrisi pengguna.
 */
import { DAFTAR_MENU_REKOMENDASI, KATEGORI_FILTER_MENU } from '../domain/MenuRekomendasi.js'

export { DAFTAR_MENU_REKOMENDASI, KATEGORI_FILTER_MENU }

/**
 * Menghitung skor kecocokan suatu menu dengan sisa kuota nutrisi harian pengguna.
 */
export function evaluasiKecocokanMenu(menu, { sisaKalori, sisaProtein }) {
  const muatKalori = menu.kalori <= sisaKalori
  const selisihKalori = sisaKalori - menu.kalori

  let alasanRekomendasi = 'Pas dengan sisa kalori harian'
  let skor = 50

  if (muatKalori) {
    skor += 30
    if (sisaProtein >= 20 && menu.protein >= 25) {
      skor += 25
      alasanRekomendasi = `Bantu penuhi sisa ${sisaProtein}g protein`
    } else if (selisihKalori >= 0 && selisihKalori <= 250) {
      skor += 15
      alasanRekomendasi = 'Porsi ideal menutup kuota hari ini'
    } else if (menu.kategori.includes('terjangkau')) {
      skor += 10
      alasanRekomendasi = 'Terjangkau & muat di kuota harian'
    }
  } else {
    skor -= Math.min(Math.round((menu.kalori - sisaKalori) / 20), 40)
    alasanRekomendasi = `Melebihi sisa kuota (+${menu.kalori - sisaKalori} kcal)`
  }

  return {
    muatKalori,
    skor: Math.max(Math.min(skor, 100), 10),
    alasanRekomendasi,
  }
}

/**
 * Menyaring dan mengurutkan daftar menu berdasarkan kategori, kata kunci pencarian, dan mode urutan.
 */
export function filterDanUrutkanMenu({
  daftarMenu = DAFTAR_MENU_REKOMENDASI,
  kategoriAktif = 'semua',
  kataKunci = '',
  urutkan = 'rekomendasi',
  sisaKalori = 2000,
  sisaProtein = 100,
}) {
  const kueri = kataKunci.trim().toLowerCase()

  const hasilEvaluasi = daftarMenu.map((menu) => ({
    ...menu,
    evaluasi: evaluasiKecocokanMenu(menu, { sisaKalori, sisaProtein }),
  }))

  const tersaring = hasilEvaluasi.filter((menu) => {
    const cocokKategori =
      kategoriAktif === 'semua'
        ? true
        : kategoriAktif === 'muat-sisa'
          ? menu.evaluasi.muatKalori
          : menu.kategori.includes(kategoriAktif)

    if (!cocokKategori) return false
    if (!kueri) return true

    return (
      menu.nama.toLowerCase().includes(kueri) ||
      menu.deskripsi.toLowerCase().includes(kueri) ||
      menu.waktuMakan.toLowerCase().includes(kueri) ||
      menu.tagUtama.toLowerCase().includes(kueri)
    )
  })

  return [...tersaring].sort((a, b) => {
    switch (urutkan) {
      case 'protein-tertinggi':
        return b.protein - a.protein
      case 'kalori-tertinggi':
        return b.kalori - a.kalori
      case 'kalori-terendah':
        return a.kalori - b.kalori
      case 'rekomendasi':
      default:
        return b.evaluasi.skor - a.evaluasi.skor
    }
  })
}
