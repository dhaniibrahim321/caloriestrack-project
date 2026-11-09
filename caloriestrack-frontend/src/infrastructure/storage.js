/**
 * Layer Infrastructure: Adapter penyimpanan browser (localStorage).
 * Memisahkan efek samping I/O dari komponen UI dan domain.
 */

const KUNCI_TEMA = 'tema'
const KUNCI_PROFIL = 'profil_pengguna'

export function muatTemaTersimpan() {
  try {
    return localStorage.getItem(KUNCI_TEMA) === 'terang'
  } catch {
    return false
  }
}

export function simpanTema(isLight) {
  try {
    localStorage.setItem(KUNCI_TEMA, isLight ? 'terang' : 'gelap')
  } catch {
    // Abaikan jika localStorage diblokir
  }
}

export function muatProfilTersimpan(profilDefault) {
  try {
    const mentah = localStorage.getItem(KUNCI_PROFIL)
    return mentah ? { ...profilDefault, ...JSON.parse(mentah) } : profilDefault
  } catch {
    return profilDefault
  }
}

export function simpanProfil(profil) {
  try {
    localStorage.setItem(KUNCI_PROFIL, JSON.stringify(profil))
  } catch {
    // Abaikan jika kuota penuh atau localStorage diblokir
  }
}
