import SearchBar from './components/SearchBar'
import SatelliteTable from './components/SatelliteTable'
import { useState } from 'react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Satellite Explorer</h1>
      <SearchBar onSearch={setSearchQuery} />
      <SatelliteTable searchQuery={searchQuery} />
    </div>
  )
}

export default App
