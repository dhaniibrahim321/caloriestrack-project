/**
 * Layer Domain: Entitas Profil Biometrik, Faktor Aktivitas (PAL WHO/FAO), dan Sasaran Diet.
 */

export const FAKTOR_AKTIVITAS = Object.freeze({
  sedentari: { nilai: 1.2, label: 'Sedentari (Banyak duduk / kerja meja)' },
  ringan: { nilai: 1.375, label: 'Ringan (Olahraga 1–3 hari/minggu)' },
  sedang: { nilai: 1.55, label: 'Sedang (Olahraga 3–5 hari/minggu)' },
  berat: { nilai: 1.725, label: 'Berat (Olahraga 6–7 hari/minggu)' },
})

export const PILIHAN_GOAL = Object.freeze({
  cut: {
    id: 'cut',
    label: 'Turun Berat Badan (Defisit)',
    penyesuaian: -450,
    faktorProtein: 2.0,
    porsiLemak: 0.25,
  },
  maintain: {
    id: 'maintain',
    label: 'Pertahankan Berat Badan',
    penyesuaian: 0,
    faktorProtein: 1.8,
    porsiLemak: 0.27,
  },
  bulk: {
    id: 'bulk',
    label: 'Naik Massa Otot (Surplus)',
    penyesuaian: 350,
    faktorProtein: 1.8,
    porsiLemak: 0.25,
  },
})

export const PROFIL_DEFAULT = Object.freeze({
  nama: 'Rizky Pratama',
  foto: '',
  gender: 'pria',
  usia: 22,
  tinggiBadan: 172,
  beratSaatIni: 68,
  beratTarget: 64,
  aktivitas: 'ringan',
  goal: 'maintain',
  kompensasiOlahraga: true,
  pengingat: true,
  ringkasanMingguan: false,
})
