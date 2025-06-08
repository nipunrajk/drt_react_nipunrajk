import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu'
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

interface OrbitCodeFilterProps {
  data: Satellite[]
  selectedOrbitCodes: string[]
  onOrbitCodeChange: (codes: string[]) => void
}

const OrbitCodeFilter: React.FC<OrbitCodeFilterProps> = ({
  data,
  selectedOrbitCodes,
  onOrbitCodeChange,
}) => {
  const getOrbitCodeCount = (code: string) => {
    return data.filter((item) => item.orbitCode === `{${code}}`).length
  }

  const toggleOrbitCode = (code: string) => {
    const newCodes = selectedOrbitCodes.includes(code)
      ? selectedOrbitCodes.filter((c) => c !== code)
      : [...selectedOrbitCodes, code]
    onOrbitCodeChange(newCodes)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='px-4 py-2 rounded-full bg-[#112240] text-white hover:bg-[#233554] transition-colors border border-[#233554]'>
          Orbit Code{' '}
          {selectedOrbitCodes.length > 0 && `(${selectedOrbitCodes.length})`}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className='grid grid-cols-3 gap-1'>
          {ORBIT_CODES.map((code) => (
            <DropdownMenuCheckboxItem
              key={code}
              checked={selectedOrbitCodes.includes(code)}
              onCheckedChange={() => toggleOrbitCode(code)}
            >
              <div className='flex items-center justify-between w-full'>
                <span>{code}</span>
                <span className='text-[#8892b0] ml-2'>
                  ({getOrbitCodeCount(code)})
                </span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OrbitCodeFilter
