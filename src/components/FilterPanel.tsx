import React, { useState, useEffect } from 'react'
import type { Satellite } from '../types'

const ORBIT_CODES = [
  'LEO',
  'LEO1',
  'LEO2',
  'LEO3',
  'LEO4',
  'MEO',
  'GEO',
  'HEO',
  'IGO',
  'EGO',
  'NSO',
  'GTO',
  'GHO',
  'HAO',
  'MGO',
  'LMO',
  'UFO',
  'ESO',
  'UNKNOWN',
]

interface FilterPanelProps {
  data: Satellite[]
  onApplyFilters: (filters: { orbitCodes: string[] }) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ data, onApplyFilters }) => {
  const [selectedOrbitCodes, setSelectedOrbitCodes] = useState<string[]>([])

  // Apply filters immediately when selection changes
  useEffect(() => {
    onApplyFilters({
      // When applying filters, wrap codes in curly braces to match data format
      orbitCodes: selectedOrbitCodes.map((code) => `{${code}}`),
    })
  }, [selectedOrbitCodes, onApplyFilters])

  const toggleOrbitCode = (code: string) => {
    setSelectedOrbitCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  // Get counts for each orbit code, considering the curly brace format
  const getOrbitCodeCount = (code: string) => {
    return data.filter((item) => item.orbitCode === `{${code}}`).length
  }

  return (
    <div className='p-4 bg-[#0a192f] rounded-lg border border-[#233554]'>
      <h3 className='text-white font-semibold mb-2'>Orbit Code</h3>
      <div className='space-y-2 max-h-[calc(100vh-300px)] overflow-auto scrollbar-thin scrollbar-thumb-[#233554] scrollbar-track-transparent'>
        {ORBIT_CODES.map((code) => (
          <label
            key={code}
            className='flex items-center justify-between text-white hover:bg-[#112240] p-2 rounded cursor-pointer'
          >
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={selectedOrbitCodes.includes(code)}
                onChange={() => toggleOrbitCode(code)}
                className='accent-[#64ffda]'
              />
              <span>{code}</span>
            </div>
            <span className='text-[#8892b0]'>({getOrbitCodeCount(code)})</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default FilterPanel
