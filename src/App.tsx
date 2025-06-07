import { useState } from 'react'
import SearchBar from './components/SearchBar'
import SatelliteTable from './components/SatelliteTable'
import { useSatellites } from './services'
import { useStore } from './store/useStore'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: allSats = [] } = useSatellites()
  const clear = useStore((s) => s.clear)
  const add = useStore((s) => s.add)
  const selected = useStore((s) => s.selected)

  const handleSelectFirstTen = () => {
    // If we already have selections, just clear them
    if (selected.length > 0) {
      clear()
      return
    }

    // Otherwise, select the first 10
    allSats.slice(0, 10).forEach((sat) => add(sat.noradCatId))
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Satellite Explorer</h1>
      <SearchBar onSearch={setSearchQuery} />
      <button
        className='mb-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
        onClick={handleSelectFirstTen}
        disabled={allSats.length < 10}
      >
        {selected.length > 0 ? 'Clear Selection' : 'Select First 10'}
      </button>
      <SatelliteTable searchQuery={searchQuery} />
    </div>
  )
}

export default App
