import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'sans-serif' }}>
      <h1>Vite + React</h1>
      <p>Inisialisasi Project CaloriesTrack Frontend</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
