import React from 'react'
// TODO: integrate virtualization & data fetching

interface SatelliteTableProps {
  searchQuery: string
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({ searchQuery }) => {
  return (
    <div className='border rounded p-4'>
      {/* Virtualized table will go here */}
      <p>Searching: {searchQuery}</p>
    </div>
  )
}

export default SatelliteTable
