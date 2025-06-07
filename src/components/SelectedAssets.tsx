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

  return (
    <div className='h-full bg-[#0a192f] text-white p-4 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.1)]'>
      <h2 className='text-2xl mb-4'>Selected Assets</h2>
      <div className='flex justify-between items-center mb-4 text-[#64ffda]'>
        <span>{selected.length} objects selected</span>
        <button onClick={clear} className='hover:text-white flex items-center'>
          Clean all <span className='ml-2'>×</span>
        </button>
      </div>
      <div className='flex-1 overflow-auto space-y-2'>
        {selectedSatellites.map((sat) => (
          <div
            key={sat.noradCatId}
            className='flex justify-between items-center py-2 border-b border-[#233554]'
          >
            <div className='flex items-center'>
              <span className='text-[#64ffda] mr-3'>{sat.noradCatId}</span>
              <span className='truncate'>{sat.name}</span>
            </div>
            <button
              onClick={() => remove(sat.noradCatId)}
              className='text-[#64ffda] hover:text-white ml-2 flex-shrink-0'
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
