import React from 'react'
import { useStore } from '../store/useStore'
import type { Satellite } from '../types'

const SelectedAssetsPage: React.FC<{ satellites: Satellite[] }> = ({
  satellites,
}) => {
  const selected = useStore((s) => s.selected)
  const selectedSatellites = satellites.filter((sat) =>
    selected.includes(sat.noradCatId)
  )

  return (
    <div className='min-h-screen bg-[#020c1b] text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-light'>Selected Assets Overview</h1>
          <span className='text-[#64ffda] text-xl'>
            {selectedSatellites.length} objects selected
          </span>
        </div>

        <div className='bg-[#0a192f] rounded-xl border border-[#233554]/30 overflow-hidden'>
          <div className='grid grid-cols-2 gap-x-4 px-6 py-4 bg-[#112240] border-b border-[#233554]'>
            <div className='text-[#64ffda] font-medium'>NORAD ID</div>
            <div className='text-[#64ffda] font-medium'>Name</div>
          </div>

          <div className='divide-y divide-[#233554]/50'>
            {selectedSatellites.map((sat) => (
              <div
                key={sat.noradCatId}
                className='grid grid-cols-2 gap-x-4 px-6 py-4 hover:bg-[#112240]'
              >
                <div className='font-mono text-[#64ffda]'>{sat.noradCatId}</div>
                <div className='text-white/90'>{sat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectedAssetsPage
