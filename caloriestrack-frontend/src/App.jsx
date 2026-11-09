import { useEffect, useState } from 'react'
import { buatMakanan } from './domain/Makanan.js'
import { buatAktivitas } from './domain/Aktivitas.js'
import { PROFIL_DEFAULT } from './domain/ProfilBiometrik.js'
import { hitungTargetNutrisiLengkap } from './application/hitungNutrisiAhli.js'
import { DATA_AWAL_AKTIVITAS, DATA_AWAL_MAKANAN } from './infrastructure/seedData.js'
import { muatProfilTersimpan, muatTemaTersimpan, simpanProfil, simpanTema } from './infrastructure/storage.js'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import TargetPanel from './components/TargetPanel.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LogMakananPage from './pages/LogMakananPage.jsx'
import AktivitasPage from './pages/AktivitasPage.jsx'
import RekomendasiPage from './pages/RekomendasiPage.jsx'
import KalkulatorPage from './pages/KalkulatorPage.jsx'

export default function App() {
  // State utama: navigasi (5 halaman), makanan, aktivitas, target, profil, hidrasi, tema
  const [activePage, setActivePage] = useState('dashboard')
  const [daftarMakanan, setDaftarMakanan] = useState(DATA_AWAL_MAKANAN)
  const [daftarAktivitas, setDaftarAktivitas] = useState(DATA_AWAL_AKTIVITAS)
  const [profil, setProfil] = useState(() => muatProfilTersimpan(PROFIL_DEFAULT))
  const [target, setTarget] = useState(() => hitungTargetNutrisiLengkap(profil))
  const [gelasAir, setGelasAir] = useState(4)
  const [panelTargetTerbuka, setPanelTargetTerbuka] = useState(false)
  const [hariIni] = useState(() => new Date())
  const [isLight, setIsLight] = useState(() => muatTemaTersimpan())

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight)
    simpanTema(isLight)
  }, [isLight])

  const handleAddFood = (dataForm) => {
    const makananBaru = buatMakanan({
      id: Date.now(),
      nama: dataForm.namaMakanan,
      kalori: dataForm.kalori,
      protein: dataForm.protein,
      karbo: dataForm.karbo,
      lemak: dataForm.lemak,
    })
    setDaftarMakanan((sebelumnya) => [makananBaru, ...sebelumnya])
  }

  const handleAddAktivitas = (dataAktivitas) => {
    const itemBaru = buatAktivitas({
      id: Date.now(),
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...dataAktivitas,
    })
    setDaftarAktivitas((sebelumnya) => [itemBaru, ...sebelumnya])
  }

  const handleHapusAktivitas = (id) => {
    setDaftarAktivitas((sebelumnya) => sebelumnya.filter((item) => item.id !== id))
  }

  const handleSimpanTarget = (targetBaru, profilBaru) => {
    if (profilBaru) {
      setProfil(profilBaru)
      simpanProfil(profilBaru)
    }
    setTarget(targetBaru)
  }

  const totalKaloriTerbakar = daftarAktivitas.reduce((total, item) => total + item.kalori, 0)

  const renderHalaman = () => {
    switch (activePage) {
      case 'log':
        return <LogMakananPage daftarMakanan={daftarMakanan} target={target} onAddFood={handleAddFood} />

      case 'aktivitas':
        return (
          <AktivitasPage
            daftarAktivitas={daftarAktivitas}
            beratBadan={profil.beratSaatIni}
            onAddAktivitas={handleAddAktivitas}
            onHapusAktivitas={handleHapusAktivitas}
          />
        )

      case 'rekomendasi':
        return <RekomendasiPage daftarMakanan={daftarMakanan} target={target} onAddFood={handleAddFood} />

      case 'kalkulator':
        return (
          <KalkulatorPage
            key={`${profil.gender}-${profil.usia}-${profil.tinggiBadan}-${profil.beratSaatIni}-${profil.aktivitas}-${profil.goal}`}
            profil={profil}
            onTerapkanTarget={handleSimpanTarget}
          />
        )

      case 'dashboard':
      default:
        return (
          <DashboardPage
            daftarMakanan={daftarMakanan}
            target={target}
            profil={profil}
            hariIni={hariIni}
            gelasAir={gelasAir}
            onUbahAir={setGelasAir}
            onNavigate={setActivePage}
            totalKaloriTerbakar={totalKaloriTerbakar}
          />
        )
    }
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-canvas font-sans text-fg transition-colors duration-300">
      {/* Cahaya ambient tipis agar kaca (backdrop-blur) punya sesuatu untuk dibiaskan */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-emerald-500/[0.08] blur-3xl" />
        <div className="absolute -bottom-48 right-0 h-[36rem] w-[36rem] rounded-full bg-sky-500/[0.07] blur-3xl" />
      </div>

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        targetKalori={target.kalori}
        onBukaTarget={() => setPanelTargetTerbuka(true)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Header
          activePage={activePage}
          hariIni={hariIni}
          isLight={isLight}
          onToggleTheme={() => setIsLight((s) => !s)}
          targetKalori={target.kalori}
          onBukaTarget={() => setPanelTargetTerbuka(true)}
          profil={profil}
        />

        <main className="min-h-[calc(100vh-4.5rem)] w-full flex-1 p-6 lg:p-8">{renderHalaman()}</main>
      </div>

      <TargetPanel
        terbuka={panelTargetTerbuka}
        target={target}
        profil={profil}
        onSimpan={handleSimpanTarget}
        onTutup={() => setPanelTargetTerbuka(false)}
      />
    </div>
  )
}
