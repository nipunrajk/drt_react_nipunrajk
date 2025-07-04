import { useState, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SearchBar from './components/SearchBar'
import SatelliteTable from './components/SatelliteTable'
import SelectedAssets from './components/SelectedAssets'
import { useSatellites } from './services'
import { useStore } from './store/useStore'
import CategoryFilter from './components/CategoryFilter'
import OrbitCodeFilter from './components/OrbitCodeFilter'
import SelectedAssetsPage from './pages/SelectedAssetsPage'
import { Checkbox } from './components/ui/checkbox'
import { Label } from './components/ui/label'

function MainContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedOrbitCodes, setSelectedOrbitCodes] = useState<string[]>([])
  const { data: allSats = [] } = useSatellites()
  const clear = useStore((s) => s.clear)
  const add = useStore((s) => s.add)
  const selected = useStore((s) => s.selected)

  // Filter satellites based on selected filters
  const filteredSatellites = useMemo(() => {
    let filtered = allSats

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((sat) =>
        selectedCategories.includes(sat.objectType)
      )
    }

    // Apply orbit code filters
    if (selectedOrbitCodes.length > 0) {
      filtered = filtered.filter((sat) =>
        selectedOrbitCodes.some((code) => sat.orbitCode === `{${code}}`)
      )
    }

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sat) =>
          sat.name.toLowerCase().includes(q) ||
          String(sat.noradCatId).includes(q)
      )
    }

    return filtered
  }, [allSats, selectedCategories, selectedOrbitCodes, searchQuery])

  const handleSelectFirstTen = () => {
    // If we already have selections, just clear them
    if (selected.length > 0) {
      clear()
      return
    }

    // Select first 10 from filtered satellites
    filteredSatellites.slice(0, 10).forEach((sat) => add(sat.noradCatId))
  }

  const hasSelection = selected.length > 0

  return (
    <div className='min-h-screen bg-[#020c1b]'>
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
            selectedCategories={selectedCategories}
            onSelectCategories={setSelectedCategories}
          />

          <div className='mb-4 space-y-4'>
            <div className='flex gap-2 items-center'>
              <div className='flex-1'>
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <OrbitCodeFilter
                data={allSats}
                selectedOrbitCodes={selectedOrbitCodes}
                onOrbitCodeChange={setSelectedOrbitCodes}
              />
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='select-all'
                  checked={selected.length > 0}
                  onCheckedChange={handleSelectFirstTen}
                />
                <Label
                  htmlFor='select-all'
                  className='text-sm font-medium leading-none text-primary hover:text-white cursor-pointer  peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {selected.length > 0 ? 'Clear All' : 'Select All'}
                </Label>
                <span className='text-white/50 text-sm'>
                  {selected.length} of 10 selected
                </span>
              </div>
            </div>
          </div>

          <SatelliteTable
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            selectedOrbitCodes={selectedOrbitCodes}
            filteredSatellites={filteredSatellites}
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

function App() {
  const { data: allSats = [] } = useSatellites()

  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainContent />} />
        <Route
          path='/selected-assets'
          element={<SelectedAssetsPage satellites={allSats} />}
        />
      </Routes>
    </Router>
  )
}

export default App
