import React from 'react'
import { useStore } from '../store/useStore'
import type { Satellite } from '../types'

interface SelectedAssetsProps {
  satellites: Satellite[]
}

const SelectedAssets: React.FC<SelectedAssetsProps> = ({ satellites }) => {
  const selected = useStore((s) => s.selected)
  const remove = useStore((s) => s.remove)
  const clear = useStore((s) => s.clear)

  const selectedSatellites = satellites.filter((sat) =>
    selected.includes(sat.noradCatId)
  )

  if (selected.length === 0) return null

  return (
    <div className='w-80 bg-[#0a192f] text-white rounded-lg p-4 ml-4'>
      <h2 className='text-2xl mb-4'>Selected Assets</h2>
      <div className='flex justify-between items-center mb-4 text-[#64ffda]'>
        <span>{selected.length} objects selected</span>
        <button onClick={clear} className='hover:text-white flex items-center'>
          Clean all <span className='ml-2'>×</span>
        </button>
      </div>
      <div className='space-y-2'>
        {selectedSatellites.map((sat) => (
          <div
            key={sat.noradCatId}
            className='flex justify-between items-center py-2 border-b border-[#233554]'
          >
            <div className='flex items-center'>
              <span className='text-[#64ffda] mr-3'>{sat.noradCatId}</span>
              <span>{sat.name}</span>
            </div>
            <button
              onClick={() => remove(sat.noradCatId)}
              className='text-[#64ffda] hover:text-white'
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button className='w-full mt-4 py-3 bg-[#64ffda] text-[#0a192f] rounded font-semibold hover:bg-[#4cd8b9] transition-colors'>
        PROCEED
      </button>
    </div>
  )
}

export default SelectedAssets
