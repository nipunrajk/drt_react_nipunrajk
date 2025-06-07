import { useState } from 'react'
import SearchBar from './components/SearchBar'
import SatelliteTable from './components/SatelliteTable'
import SelectedAssets from './components/SelectedAssets'
import { useSatellites } from './services'
import { useStore } from './store/useStore'
import CategoryFilter from './components/CategoryFilter'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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

  const hasSelection = selected.length > 0

  return (
    <div className='min-h-screen bg-[#020c1b] flex'>
      {/* Main Content */}
      <div
        className={`flex-1 p-4 overflow-auto transition-all duration-300 ease-in-out ${
          hasSelection ? 'pr-[320px]' : ''
        }`}
      >
        <div className='max-w-[1400px] mx-auto'>
          <h1 className='text-2xl font-bold mb-4 text-white'>
            Create My Asset list
          </h1>

          {/* Category Filter */}
          <CategoryFilter
            data={allSats}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className='mb-4 space-y-4'>
            <SearchBar onSearch={setSearchQuery} />
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
              onClick={handleSelectFirstTen}
              disabled={allSats.length < 10}
            >
              {hasSelection ? 'Clear Selection' : 'Select First 10'}
            </button>
          </div>

          <SatelliteTable
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      {/* Animated Sidebar */}
      <div
        className={`fixed right-0 top-0 w-80 h-screen transform transition-transform duration-300 ease-in-out ${
          hasSelection ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <SelectedAssets satellites={allSats} />
      </div>
    </div>
  )
}

export default App
