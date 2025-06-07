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

      {/* Header with count and clear button */}
      <div className='flex justify-between items-center mb-4'>
        <span className='text-[#64ffda]'>
          {selected.length} objects selected
        </span>
        <button
          onClick={clear}
          className='text-[#64ffda] hover:text-white flex items-center'
        >
          Clean all <span className='ml-2'>×</span>
        </button>
      </div>

      {/* Selected items box */}
      <div className='flex-1 border border-[#64ffda]/20 rounded-md bg-[#112240] mb-4'>
        <div className='h-full overflow-auto'>
          {selectedSatellites.map((sat, index) => (
            <React.Fragment key={sat.noradCatId}>
              <div className='flex justify-between items-center p-4'>
                <div className='flex items-center gap-4'>
                  <span className='text-[#64ffda] font-mono'>
                    {sat.noradCatId}
                  </span>
                  <span className='text-white/90'>{sat.name}</span>
                </div>
                <button
                  onClick={() => remove(sat.noradCatId)}
                  className='text-[#64ffda] hover:text-white text-xl leading-none'
                >
                  ×
                </button>
              </div>
              {index < selectedSatellites.length - 1 && (
                <div className='h-[1px] bg-[#233554]' />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Proceed button */}
      <button className='w-full py-3 bg-[#64ffda] text-[#0a192f] rounded font-semibold hover:bg-[#4cd8b9] transition-colors'>
        PROCEED
      </button>
    </div>
  )
}

export default SelectedAssets
